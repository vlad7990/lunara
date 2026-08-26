import { Footer } from "@/components/shell/Footer";

/** Every page except the bag and checkout, which use the condensed footer. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
