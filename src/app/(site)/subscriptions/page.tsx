import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { PolicyPage } from "@/components/legal/PolicyPage";
import { getPolicy } from "@/lib/legal";

const SLUG = "subscriptions";

export function generateMetadata(): Metadata {
  const policy = getPolicy(SLUG);
  return { title: policy?.name, description: policy?.summary };
}

export default function Page() {
  const policy = getPolicy(SLUG);
  if (!policy) notFound();
  return <PolicyPage policy={policy} />;
}
