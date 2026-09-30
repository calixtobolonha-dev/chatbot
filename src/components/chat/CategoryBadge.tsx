import { CATEGORY_STYLES } from "@/lib/categories";
import type { Category } from "@/types/chat";

interface CategoryBadgeProps {
  category: Category;
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  const style = CATEGORY_STYLES[category];

  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${style.className}`}
    >
      {style.label}
    </span>
  );
}
