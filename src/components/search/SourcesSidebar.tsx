import { ExternalLink, Globe } from "lucide-react";
import { SearchResult } from "@/lib/subfeed";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SourcesSidebarProps {
  sources: SearchResult[];
}

export function SourcesSidebar({ sources }: SourcesSidebarProps) {
  if (sources.length === 0) {
    return (
      <div className="p-4 rounded-xl border border-border bg-muted/20">
        <p className="text-muted-foreground text-sm text-center">No sources found</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 animate-fade-in">
      <h3 className="font-medium text-foreground flex items-center gap-2">
        <Globe className="h-4 w-4 text-primary" />
        Sources ({sources.length})
      </h3>
      
      <ScrollArea className="h-[calc(100vh-200px)] lg:h-auto">
        <div className="space-y-3 pr-2">
          {sources.map((source, index) => (
            <a
              key={index}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 rounded-xl border border-border bg-card hover:bg-muted/50 hover:border-primary/30 transition-all group"
            >
              <div className="flex items-start gap-3">
                {/* Citation Number */}
                <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center justify-center">
                  {index + 1}
                </span>

                <div className="flex-1 min-w-0 space-y-1">
                  {/* Domain with favicon */}
                  <div className="flex items-center gap-2">
                    {source.favicon && (
                      <img 
                        src={source.favicon} 
                        alt="" 
                        className="h-4 w-4 rounded"
                        onError={(e) => e.currentTarget.style.display = 'none'}
                      />
                    )}
                    <span className="text-xs text-muted-foreground truncate">
                      {source.domain}
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {source.title}
                  </h4>

                  {/* Snippet */}
                  {source.snippet && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {source.snippet}
                    </p>
                  )}
                </div>

                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
              </div>
            </a>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
