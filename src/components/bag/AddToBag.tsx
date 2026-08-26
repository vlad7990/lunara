import type { Plan } from "@/lib/bag";

import { addToBag } from "./actions";

/**
 * Add to bag.
 *
 * A plain form posting to a server action — it works before hydration, and the bag count in
 * the nav is re-rendered on the server so it can never disagree with the bag itself.
 */
export function AddToBag({
  sku,
  plan = "once",
  qty = 1,
  label = "Add to bag",
  className = "lu-btn",
  goToBag = false,
}: {
  sku: string;
  plan?: Plan;
  qty?: number;
  label?: string;
  className?: string;
  goToBag?: boolean;
}) {
  return (
    <form action={addToBag}>
      <input type="hidden" name="sku" value={sku} />
      <input type="hidden" name="plan" value={plan} />
      <input type="hidden" name="qty" value={qty} />
      {goToBag ? <input type="hidden" name="then" value="bag" /> : null}
      <button type="submit" className={className}>
        {label}
      </button>
    </form>
  );
}
