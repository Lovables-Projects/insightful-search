import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { SearchResults } from "@/components/search/SearchResults";
import { SearchHome } from "@/components/search/SearchHome";
import { useToast } from "@/hooks/use-toast";
import { search, followUp, clearHistory, SearchResponse } from "@/lib/subfeed";

export default function SearchAI() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<SearchResponse | null>(null);
  const [followUpLoading, setFollowUpLoading] = useState(false);
  const { toast } = useToast();
  const hasSearched = useRef(false);

  // Keyboard shortcut: "/" to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        document.querySelector<HTMLInputElement>('[data-search-input]')?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Perform search when query changes
  useEffect(() => {
    if (query && !hasSearched.current) {
      performSearch(query);
      hasSearched.current = true;
    } else if (!query) {
      hasSearched.current = false;
      setSearchResult(null);
    }
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    setIsLoading(true);
    setSearchResult(null);
    
    try {
      const result = await search(searchQuery);
      setSearchResult(result);
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (newQuery: string) => {
    hasSearched.current = false;
    clearHistory();
    navigate(`/search-ai?q=${encodeURIComponent(newQuery)}`);
  };

  const handleFollowUp = async (message: string) => {
    setFollowUpLoading(true);
    
    try {
      const result = await followUp(message);
      setSearchResult(result);
    } catch (error) {
      console.error('Follow-up error:', error);
      toast({
        title: "Follow-up failed",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setFollowUpLoading(false);
    }
  };

  const handleNewSearch = () => {
    clearHistory();
    navigate('/search-ai');
  };

  if (!query) {
    return <SearchHome onSearch={handleSearch} />;
  }

  return (
    <SearchResults
      query={query}
      result={searchResult}
      isLoading={isLoading}
      followUpLoading={followUpLoading}
      onSearch={handleSearch}
      onFollowUp={handleFollowUp}
      onNewSearch={handleNewSearch}
    />
  );
}
