import { cn } from "@/lib/utils";

const variantClasses: Record<
  string,
  string
> = {
  active:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  inactive: "bg-muted text-muted-foreground",
  trialing:
    "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  past_due:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  canceled:
    "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  owner:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  admin:
    "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  member:
    "bg-muted text-muted-foreground",
};

interface StatusBadgeProps {
  variant: keyof typeof variantClasses;
  label: string;
  className?: string;
}

export function StatusBadge({ variant, label, className }: StatusBadgeProps) {
  const classes = variantClasses[variant] ?? variantClasses.inactive;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
        classes,
        className
      )}
    >
      {label}
    </span>
  );
}
