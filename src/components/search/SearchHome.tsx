import { useState, useEffect } from "react";
import { Search, Sparkles, TrendingUp, Lightbulb, Code, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ThemeToggle";

interface SearchHomeProps {
  onSearch: (query: string) => void;
}

const suggestedQueries = [
  { icon: TrendingUp, text: "Latest AI developments in 2024" },
  { icon: Lightbulb, text: "How does quantum computing work?" },
  { icon: Code, text: "Best practices for React performance" },
  { icon: Globe, text: "Climate change solutions being implemented" },
];

export function SearchHome({ onSearch }: SearchHomeProps) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    // Auto-focus on mount
    document.querySelector<HTMLInputElement>('[data-search-input]')?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="flex justify-end p-4 sm:p-6">
        <ThemeToggle />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 -mt-16">
        <div className="w-full max-w-2xl mx-auto space-y-8">
          {/* Logo & Title */}
          <div className="text-center space-y-4 animate-fade-in">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/25">
              <Sparkles className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
              Search AI
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              AI-powered search with real-time answers and citations
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSubmit} className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <div className={`relative flex items-center rounded-2xl border-2 transition-all duration-200 bg-background ${
              isFocused 
                ? 'border-primary shadow-lg shadow-primary/10' 
                : 'border-border hover:border-primary/50'
            }`}>
              <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
              <Input
                data-search-input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Ask anything..."
                className="h-14 pl-12 pr-4 text-lg border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent"
              />
              <Button 
                type="submit" 
                disabled={!query.trim()}
                className="absolute right-2 h-10 px-6 rounded-xl"
              >
                Search
              </Button>
            </div>
          </form>

          {/* Suggested Queries */}
          <div className="space-y-3 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <p className="text-sm text-muted-foreground text-center">Try these searches</p>
            <div className="flex flex-wrap justify-center gap-2">
              {suggestedQueries.map((item, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="gap-2 rounded-full hover:bg-primary/10 hover:border-primary/50 transition-all"
                  onClick={() => onSearch(item.text)}
                >
                  <item.icon className="h-4 w-4 text-primary" />
                  <span className="text-sm">{item.text}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center">
        <p className="text-sm text-muted-foreground">
          Press <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted text-xs font-mono">/</kbd> to search
        </p>
      </footer>
    </div>
  );
}
