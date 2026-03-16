import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const sizeClasses = {
  sm: "h-6 w-6 text-xs",
  md: "h-8 w-8 text-sm",
  lg: "h-10 w-10 text-base",
  xl: "h-16 w-16 text-2xl",
} as const;

function getInitials(name: string | null): string {
  if (!name || !name.trim()) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    const first = parts[0]?.charAt(0) ?? "";
    const last = parts[parts.length - 1]?.charAt(0) ?? "";
    return (first + last).toUpperCase().slice(0, 2);
  }
  return name.slice(0, 2).toUpperCase();
}

interface UserAvatarProps {
  name: string | null;
  image: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function UserAvatar({ name, image, size = "md", className }: UserAvatarProps) {
  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      {image ? (
        <AvatarImage src={image} alt={name ?? "Avatar"} />
      ) : null}
      <AvatarFallback className="bg-muted text-muted-foreground">
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
}
