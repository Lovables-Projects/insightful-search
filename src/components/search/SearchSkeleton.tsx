import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

export function SearchSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr,380px] gap-8 animate-fade-in">
      {/* Left Column - Answer Skeleton */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="text-muted-foreground">Searching and analyzing...</span>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-5 w-24" />
          </div>
          
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>

      {/* Right Column - Sources Skeleton */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-5 w-20" />
        </div>
        
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 rounded-xl border border-border">
            <div className="flex items-start gap-3">
              <Skeleton className="h-6 w-6 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-4/5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
