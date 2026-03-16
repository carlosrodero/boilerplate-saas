import { Skeleton } from "@/components/ui/skeleton";

export default function BillingLoading() {
  return (
    <>
      <div className="mb-6">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="mt-2 h-4 w-40" />
      </div>
      <Skeleton className="h-48 w-full" />
    </>
  );
}
