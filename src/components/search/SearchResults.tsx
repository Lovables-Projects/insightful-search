import { useState } from "react";
import { Search, ArrowLeft, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AnswerSection } from "./AnswerSection";
import { SourcesSidebar } from "./SourcesSidebar";
import { FollowUpInput } from "./FollowUpInput";
import { SearchSkeleton } from "./SearchSkeleton";
import { SearchResponse } from "@/lib/subfeed";

interface SearchResultsProps {
  query: string;
  result: SearchResponse | null;
  isLoading: boolean;
  followUpLoading: boolean;
  onSearch: (query: string) => void;
  onFollowUp: (message: string) => void;
  onNewSearch: () => void;
}

export function SearchResults({
  query,
  result,
  isLoading,
  followUpLoading,
  onSearch,
  onFollowUp,
  onNewSearch,
}: SearchResultsProps) {
  const [searchQuery, setSearchQuery] = useState(query);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && searchQuery.trim() !== query) {
      onSearch(searchQuery.trim());
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onNewSearch}
              className="h-9 w-9"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>

            <form onSubmit={handleSubmit} className="flex-1 max-w-2xl">
              <div className="relative flex items-center">
                <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
                <Input
                  data-search-input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 pl-10 pr-4 rounded-full border-border bg-muted/50 focus-visible:bg-background"
                />
              </div>
            </form>

            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {isLoading ? (
          <SearchSkeleton />
        ) : result ? (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr,380px] gap-8">
            {/* Left Column - Answer */}
            <div className="space-y-6">
              <AnswerSection 
                answer={result.answer} 
                sources={result.results}
                query={query}
              />
              
              <FollowUpInput 
                onSubmit={onFollowUp}
                isLoading={followUpLoading}
              />
            </div>

            {/* Right Column - Sources */}
            <div className="lg:sticky lg:top-24 lg:h-fit">
              <SourcesSidebar sources={result.results} />
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground mb-4">No results found. Try different terms.</p>
            <Button variant="outline" onClick={onNewSearch} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              New Search
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
