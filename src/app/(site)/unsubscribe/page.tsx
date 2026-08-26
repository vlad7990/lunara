import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { site } from "@/lib/content";

import { unsubscribe } from "./actions";
import styles from "./unsubscribe.module.css";

export const metadata: Metadata = {
  title: "Unsubscribe",
  robots: { index: false },
};

/**
 * Unsubscribe.
 *
 * The link in an email arrives as a GET, and mail scanners follow those links before anyone
 * reads the message — so a GET never unsubscribes anyone. It shows a button, and the button
 * posts. One click either way, which is what the microcopy promises.
 */
export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string; done?: string }>;
}) {
  const { email, done } = await searchParams;

  if (done === "1") {
    return (
      <section className={`lu-container ${styles.page}`}>
        <h1 className={styles.title}>You&rsquo;re unsubscribed.</h1>
        <p className={styles.body}>
          No more email from us. Your place on the list is unchanged — if you want it back,
          sign up with the same address and you keep the number you had.
        </p>
        <Link href="/" className={styles.back}>
          Back to the formula
        </Link>
      </section>
    );
  }

  async function confirm(formData: FormData) {
    "use server";
    await unsubscribe(formData);
    redirect("/unsubscribe?done=1");
  }

  return (
    <section className={`lu-container ${styles.page}`}>
      <h1 className={styles.title}>Unsubscribe from LUNARA email</h1>
      <p className={styles.body}>
        {email ? (
          <>
            One click and we stop emailing <span className={styles.address}>{email}</span>. We
            do not ask why, and there is no second screen.
          </>
        ) : (
          <>
            Enter the address you signed up with. We do not ask why, and there is no second
            screen.
          </>
        )}
      </p>

      <form action={confirm} className={styles.form}>
        {email ? (
          <input type="hidden" name="email" value={email} />
        ) : (
          <div className={styles.row}>
            <label htmlFor="unsub-email" className="lu-sr-only">
              Email address
            </label>
            <input
              id="unsub-email"
              name="email"
              type="email"
              required
              placeholder="you@email.com"
              className={`lu-field ${styles.field}`}
            />
          </div>
        )}
        <button type="submit" className="lu-btn">
          Unsubscribe
        </button>
      </form>

      <p className={styles.note}>
        This stops the email. It does not delete what we hold on you — to have that erased,
        write to <a href={`mailto:${site.brand.email}`}>{site.brand.email}</a> and we confirm
        within 30 days.
      </p>
    </section>
  );
}
