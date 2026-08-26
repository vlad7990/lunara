import styles from "./DropInSlot.module.css";

/**
 * Photography beyond the two supplied pack renders is a drop-in slot: the shoot is pending.
 *
 * Each slot reserves the final aspect ratio, so nothing shifts when the frame lands, and
 * names what belongs there. Swap a slot for an `<img>` when the file exists — the
 * surrounding layout does not change.
 */
export function DropInSlot({
  caption,
  height,
  aspectRatio,
  className,
  style,
}: {
  /** What belongs here, e.g. "stick pack carton". Rendered under "Drop in". */
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
      aria-label={`Placeholder for photography: ${caption}`}
    >
      <span className={styles.caption} aria-hidden="true">
        Drop in
        <br />
        {caption}
      </span>
    </div>
  );
}
