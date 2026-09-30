import { CATEGORY_STYLES } from "@/lib/categories";
import type { Category } from "@/types/chat";

interface CategoryBadgeProps {
  category: Category;
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  const style = CATEGORY_STYLES[category];

  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-xs px-1.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ring-1 ring-inset ${style.className}`}
    >
      {style.label}
    </span>
  );
}
