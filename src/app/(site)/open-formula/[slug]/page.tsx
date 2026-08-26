import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { FdaDisclaimer } from "@/components/compliance";
import { getArticleBody, seriesPosition } from "@/lib/articles";
import { articles, getArticle } from "@/lib/content";
import { resolveSiteMode } from "@/lib/mode";

import {
  ArticleSidebar,
  DecisionLog,
  OpenFormulaHead,
  SeriesIndex,
} from "../OpenFormulaParts";
import styles from "../openFormula.module.css";

export function generateStaticParams() {
  return articles.filter((article) => article.published).map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};

  return { title: article.title, description: article.dek };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = getArticle(slug);

  // An unpublished slug is not a page yet. A slug we have never heard of is a 404.
  if (!article || !article.published) notFound();

  const [mode, body] = await Promise.all([resolveSiteMode(), getArticleBody(slug)]);

  return (
    <>
      <OpenFormulaHead />
      <SeriesIndex currentSlug={slug} />

      <article className={styles.article}>
        <div className={`lu-container ${styles.article__inner}`}>
          <header className={styles.article__head}>
            <p className={styles.article__kicker}>
              <span className="lu-label lu-label--wide">Open formula</span>
              <span className={styles.article__kickerRule} aria-hidden="true" />
              <span className="lu-label lu-label--wide lu-label--muted">
                {seriesPosition(article, articles.length)}
                {body ? ` · ${body.readingTime} min` : ""}
              </span>
            </p>

            <h2 className={styles.article__title}>{article.title}</h2>
            <p className={styles.article__dek}>{body?.dek ?? article.dek}</p>
          </header>

          <div className={styles.article__grid}>
            <div className={styles.article__body}>
              {body ? (
                <div
                  className={styles.prose}
                  // Markdown authored in `content/articles/` by the editorial team.
                  dangerouslySetInnerHTML={{ __html: body.html }}
                />
              ) : (
                <div className={styles.pending}>
                  <p className={styles.pending__title}>{article.dek}</p>
                  <p className={styles.pending__body}>
                    The full write-up for this decision is not online yet. It goes up in week{" "}
                    {article.week}, and everyone on the list gets it by email the same day.
                  </p>
                </div>
              )}

              {article.decision ? <DecisionLog decision={article.decision} /> : null}

              {/* Adjacent to every structure/function claim — an article about a
                  formulation decision is exactly that. */}
              <FdaDisclaimer />
            </div>

            <ArticleSidebar mode={mode} />
          </div>
        </div>
      </article>
    </>
  );
}
