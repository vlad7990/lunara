"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  MAX_QTY,
  readBag,
  supportsSubscription,
  writeBag,
  type BagLine,
  type Plan,
} from "@/lib/bag";
import { formats } from "@/lib/content";
import { isStoreMode } from "@/lib/mode";

/**
 * The bag is one of three writes on the site. Every one of them goes through a server
 * action so the bag can never be mutated into a state the server would not accept — and so
 * that in waitlist mode there is simply no path to a bag at all.
 */

function readLine(formData: FormData): { sku: string; plan: Plan; qty: number } | null {
  const sku = String(formData.get("sku") ?? "");
  if (!formats.some((format) => format.sku === sku)) return null;

  const requestedPlan = formData.get("plan");
  const plan: Plan =
    requestedPlan === "sub" && supportsSubscription(sku) ? "sub" : "once";

  const qty = Number.parseInt(String(formData.get("qty") ?? "1"), 10);

  return {
    sku,
    plan,
    qty: Number.isFinite(qty) ? Math.min(Math.max(qty, 1), MAX_QTY) : 1,
  };
}

export async function addToBag(formData: FormData) {
  if (!(await isStoreMode())) return;

  const incoming = readLine(formData);
  if (!incoming) return;

  const lines = await readBag();
  const existing = lines.find(
    (line) => line.sku === incoming.sku && line.plan === incoming.plan,
  );

  if (existing) {
    existing.qty = Math.min(existing.qty + incoming.qty, MAX_QTY);
  } else {
    lines.push(incoming);
  }

  await writeBag(lines);
  revalidatePath("/", "layout");

  if (formData.get("then") === "bag") redirect("/bag");
}

export async function updateBagLine(formData: FormData) {
  if (!(await isStoreMode())) return;

  const sku = String(formData.get("sku") ?? "");
  const plan = formData.get("plan") === "sub" ? "sub" : "once";
  const intent = String(formData.get("intent") ?? "");

  const lines = await readBag();
  const index = lines.findIndex((line) => line.sku === sku && line.plan === plan);
  if (index === -1) return;

  const line = lines[index];

  switch (intent) {
    case "increment":
      line.qty = Math.min(line.qty + 1, MAX_QTY);
      break;
    case "decrement":
      // One is the floor. Removing is an explicit act, not an accidental one.
      line.qty = Math.max(line.qty - 1, 1);
      break;
    case "remove":
      lines.splice(index, 1);
      break;
    case "switchPlan": {
      if (!supportsSubscription(sku)) break;
      const nextPlan: Plan = plan === "sub" ? "once" : "sub";
      const merged = lines.find(
        (other, otherIndex) =>
          otherIndex !== index && other.sku === sku && other.plan === nextPlan,
      );
      if (merged) {
        merged.qty = Math.min(merged.qty + line.qty, MAX_QTY);
        lines.splice(index, 1);
      } else {
        line.plan = nextPlan;
      }
      break;
    }
    default:
      return;
  }

  await writeBag(lines as BagLine[]);
  revalidatePath("/", "layout");
}
