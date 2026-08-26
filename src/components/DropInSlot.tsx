import { IconCalendar } from "@/components/Icon";

import styles from "./DropInSlot.module.css";

/**
 * A frame that has not been shot yet.
 *
 * The photography cannot exist before the product does, and this site does not fake the
 * things it has not got. So the slot reserves the final aspect ratio, so nothing shifts when
 * the frame lands, and says plainly what is going there and why it is not there yet.
 *
 * It used to read "DROP IN / stick macro" in the uppercase treatment the brand reserves for
 * structural labels, which is production shorthand pointed at a visitor. The frame name is
 * now sentence case and secondary, and the label above it says something a reader can
 * actually use. Swap the slot for an `<img>` when the file exists; the layout does not move.
 */
export function DropInSlot({
  caption,
  height,
  aspectRatio,
  className,
  style,
}: {
  /** What belongs here, e.g. "stick macro". Rendered as the frame name. */
  caption: string;
  /** Fixed pixel height, when the design specifies one. */
  height?: number;
  /** Or an aspect ratio, when the slot is fluid. */
  aspectRatio?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={[styles.slot, className].filter(Boolean).join(" ")}
      style={{ height, aspectRatio, ...style }}
      role="img"
      aria-label={`Photography not shot yet: ${caption}. The product is not made yet.`}
    >
      <span className={styles.inner} aria-hidden="true">
        <IconCalendar size={15} strokeWidth={1.5} className={styles.mark} />
        <span className={styles.label}>Not shot yet</span>
        <span className={styles.caption}>{caption}</span>
      </span>
    </div>
  );
}
