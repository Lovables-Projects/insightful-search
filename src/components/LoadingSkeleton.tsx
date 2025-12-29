import { Skeleton } from "@/components/ui/skeleton";
import { Search, Bot } from "lucide-react";

export function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Answer skeleton */}
      <div className="rounded-2xl bg-card border border-border p-6 shadow-card">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center h-8 w-8 rounded-lg gradient-primary">
            <Bot className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Search className="h-3.5 w-3.5 animate-pulse" />
            <span>Searching the web...</span>
          </div>
        </div>
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-9/12" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>

      {/* Sources skeleton */}
      <div className="lg:hidden space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-start gap-3">
              <Skeleton className="h-6 w-6 rounded-md" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SourcesSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="p-4 rounded-xl bg-card border border-border">
          <div className="flex items-start gap-3">
            <Skeleton className="h-6 w-6 rounded-md" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
