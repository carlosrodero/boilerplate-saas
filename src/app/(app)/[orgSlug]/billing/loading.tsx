import { Skeleton } from "@/components/ui/skeleton";

export default function BillingLoading() {
  return (
    <>
      <div className="mb-6 space-y-1">
        <Skeleton className="h-8 w-52" />
        <Skeleton className="h-4 w-40" />
      </div>
      <div className="space-y-6">
        <Skeleton className="h-40 w-full" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    </>
  );
}
