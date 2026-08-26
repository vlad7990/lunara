import { Footer } from "@/components/shell/Footer";

/**
 * Bag and checkout. The link farm is a distraction while someone is deciding whether to
 * pay, so the footer here is the legal block and nothing else.
 */
export default function CommerceLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main id="main">{children}</main>
      <Footer compact />
    </>
  );
}
