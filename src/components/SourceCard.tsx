import { ExternalLink, Globe } from "lucide-react";
import type { SearchResult } from "@/lib/subfeed";

interface SourceCardProps {
  source: SearchResult;
  index: number;
}

export function SourceCard({ source, index }: SourceCardProps) {
  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block p-4 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-card transition-all duration-200"
    >
      <div className="flex items-start gap-3">
        <div className="flex items-center justify-center h-6 w-6 rounded-md bg-primary/10 text-primary text-xs font-semibold shrink-0">
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {source.favicon ? (
              <img
                src={source.favicon}
                alt=""
                className="h-4 w-4 rounded shrink-0"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <Globe className="h-4 w-4 text-muted-foreground shrink-0" />
            )}
            <span className="text-xs text-muted-foreground truncate">
              {source.domain}
            </span>
          </div>
          <h3 className="text-sm font-medium text-foreground group-hover:text-primary line-clamp-2 transition-colors">
            {source.title}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
            {source.snippet}
          </p>
        </div>
        <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
      </div>
    </a>
  );
}
