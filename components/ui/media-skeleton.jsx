import { Skeleton } from "@/components/ui/skeleton";

// Skeleton for image grid
export const ImageGridSkeleton = () => {
  return (
    <div className="grid grid-cols-2 gap-2 mt-8">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="aspect-square">
          <Skeleton className="w-full h-full rounded-lg" />
        </div>
      ))}
    </div>
  );
};

// Skeleton for file list
export const FileListSkeleton = () => {
  return (
    <div className="space-y-2 mt-8">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-2 border-b border-default-200 py-2 last:border-none"
        >
          <Skeleton className="h-16 w-16 rounded-sm" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      ))}
    </div>
  );
};

// Skeleton for link list
export const LinkListSkeleton = () => {
  return (
    <div className="space-y-2 mt-8">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-2 border-b border-default-200 py-2 last:border-none"
        >
          <Skeleton className="h-16 w-16 rounded-sm" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
      ))}
    </div>
  );
};
