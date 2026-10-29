import { Fragment } from "react";

/** Renders `**text**` in admin-edited copy as bold; everything else stays plain text. */
export function withBold(text: string, className?: string) {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className={className}>
        {part}
      </strong>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}
