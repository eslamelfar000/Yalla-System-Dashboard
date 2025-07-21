import { Skeleton } from "@/components/ui/skeleton";

// Skeleton for lesson board table row
export const LessonBoardRowSkeleton = () => {
  return (
    <>
      <tr className="hover:bg-default-100 transition-all duration-300">
        <td className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex gap-3 items-center">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div>
                <Skeleton className="h-4 w-32 mb-2" />
              </div>
            </div>
          </div>
        </td>
        <td className="p-4">
          <Skeleton className="h-4 w-16" />
        </td>
        <td className="p-4">
          <Skeleton className="h-4 w-20" />
        </td>
        <td className="p-4">
          <Skeleton className="h-4 w-24" />
        </td>
        <td className="p-4">
          <Skeleton className="h-6 w-32 rounded-full" />
        </td>
        <td className="p-4">
          <Skeleton className="h-7 w-7 rounded-full" />
        </td>
      </tr>
    </>
  );
};

// Skeleton for lesson steps (expanded content)
export const LessonStepsSkeleton = () => {
  return (
    <tr>
      <td colSpan={6} className="p-4">
        <div className="ltr:pl-12 rtl:pr-12">
          <Skeleton className="h-6 w-full mb-4" />
          <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
        </div>
      </td>
    </tr>
  );
};
