import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { Search, ArrowLeft, RefreshCw } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AnswerCard } from "@/components/AnswerCard";
import { SourceCard } from "@/components/SourceCard";
import { FollowUpInput } from "@/components/FollowUpInput";
import { LoadingSkeleton, SourcesSkeleton } from "@/components/LoadingSkeleton";
import { search, followUp, clearHistory, type SearchResult } from "@/lib/subfeed";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get("q") || "";

  const [isLoading, setIsLoading] = useState(false);
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState<SearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    setIsLoading(true);
    setHasSearched(true);
    clearHistory();
    
    try {
      const result = await search(searchQuery);
      setAnswer(result.answer);
      setSources(result.results);
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Search failed. Please try again.");
      setAnswer("");
      setSources([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewSearch = (newQuery: string) => {
    navigate(`/search?q=${encodeURIComponent(newQuery)}`);
  };

  const handleFollowUp = async (message: string) => {
    setIsLoading(true);
    
    try {
      const result = await followUp(message);
      setAnswer(result.answer);
      if (result.results.length > 0) {
        setSources(result.results);
      }
    } catch (error) {
      console.error("Follow-up error:", error);
      toast.error("Failed to get response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (query) {
      performSearch(query);
    }
  };

  const isEmpty = hasSearched && !isLoading && !answer && sources.length === 0;

  return (
    <div className="min-h-screen gradient-surface">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline text-sm font-medium">New Search</span>
          </Link>
          <div className="flex-1 max-w-xl">
            <SearchBar
              onSearch={handleNewSearch}
              isLoading={isLoading}
              placeholder="Search or ask a question..."
              size="compact"
              initialValue={query}
            />
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Answer section - Left column */}
          <div className="flex-1 lg:max-w-[65%] space-y-4">
            {isLoading && !answer ? (
              <LoadingSkeleton />
            ) : isEmpty ? (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  No results found
                </h2>
                <p className="text-muted-foreground mb-4">
                  Try different search terms or rephrase your question.
                </p>
                <button
                  onClick={handleRetry}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try again
                </button>
              </div>
            ) : answer ? (
              <>
                <AnswerCard answer={answer} sources={sources} />
                <FollowUpInput onSubmit={handleFollowUp} isLoading={isLoading} />
              </>
            ) : null}

            {/* Mobile sources */}
            {sources.length > 0 && !isLoading && (
              <div className="lg:hidden space-y-3 mt-6">
                <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <span>Sources</span>
                  <span className="px-1.5 py-0.5 rounded-md bg-muted text-xs">
                    {sources.length}
                  </span>
                </h3>
                {sources.map((source, index) => (
                  <SourceCard key={source.url || index} source={source} index={index} />
                ))}
              </div>
            )}
          </div>

          {/* Sources section - Right column (desktop only) */}
          <aside className="hidden lg:block w-[35%] space-y-3">
            <div className="sticky top-24">
              <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-3">
                <span>Sources</span>
                {sources.length > 0 && (
                  <span className="px-1.5 py-0.5 rounded-md bg-muted text-xs">
                    {sources.length}
                  </span>
                )}
              </h3>
              {isLoading && sources.length === 0 ? (
                <SourcesSkeleton />
              ) : sources.length > 0 ? (
                <div className="space-y-3">
                  {sources.map((source, index) => (
                    <SourceCard key={source.url || index} source={source} index={index} />
                  ))}
                </div>
              ) : hasSearched && !isLoading ? (
                <p className="text-sm text-muted-foreground">No sources found</p>
              ) : null}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default SearchPage;
