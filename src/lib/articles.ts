import "server-only";

import { readFile } from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";
import { marked } from "marked";

import { getArticle, type Article } from "./content";

/**
 * Article bodies.
 *
 * The series index and the change log live in `articles.json`; the prose lives in markdown
 * next to it, so an editor can write a piece without touching the site. Rendering happens on
 * the server at request time — nothing about a formulation write-up needs the client.
 */

const ARTICLES_DIR = path.join(process.cwd(), "content", "articles");

export interface ArticleBody {
  html: string;
  /** Minutes, from frontmatter when present, otherwise estimated from length. */
  readingTime: number;
  /** Frontmatter may override the index entry's dek for the article page itself. */
  dek?: string;
}

/** Roughly 220 words a minute, rounded up. Only used when frontmatter omits it. */
function estimateReadingTime(markdown: string): number {
  const words = markdown.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

export async function getArticleBody(slug: string): Promise<ArticleBody | null> {
  const article = getArticle(slug);
  if (!article) return null;

  const file = article.bodyFile
    ? path.join(process.cwd(), "content", article.bodyFile)
    : path.join(ARTICLES_DIR, `${slug}.md`);

  let raw: string;
  try {
    raw = await readFile(file, "utf8");
  } catch {
    // No body on disk yet. The index still lists the piece; the article page says so.
    return null;
  }

  const { content, data } = matter(raw);

  return {
    html: await marked.parse(content, { async: true, gfm: true }),
    readingTime:
      typeof data.readingTime === "number" ? data.readingTime : estimateReadingTime(content),
    dek: typeof data.dek === "string" ? data.dek : undefined,
  };
}

/** "04 of 06" — the article's place in the series, as the design prints it. */
export function seriesPosition(article: Article, total: number): string {
  return `${article.number} of ${String(total).padStart(2, "0")}`;
}
