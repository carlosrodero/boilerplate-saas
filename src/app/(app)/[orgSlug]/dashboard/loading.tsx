import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <>
      <Skeleton className="mb-6 h-8 w-48" />
      <div className="grid gap-6 md:grid-cols-3 sm:grid-cols-1">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    </>
  );
}
