import { useNavigate } from "react-router-dom";
import { SearchBar } from "@/components/SearchBar";
import { SuggestedQueries } from "@/components/SuggestedQueries";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Sparkles } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen gradient-surface flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-end p-4 sm:p-6">
        <ThemeToggle />
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 -mt-20">
        <div className="w-full max-w-2xl mx-auto space-y-8">
          {/* Logo and title */}
          <div className="text-center space-y-4 animate-fade-up">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl gradient-primary shadow-glow mb-4">
              <Sparkles className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
              Search AI
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Get instant answers with AI-powered search and real-time citations
            </p>
          </div>

          {/* Search bar */}
          <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <SearchBar
              onSearch={handleSearch}
              placeholder="Ask anything..."
              size="large"
              autoFocus
            />
          </div>

          {/* Suggested queries */}
          <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <SuggestedQueries onSelect={handleSearch} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 sm:p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Powered by Subfeed AI • Press{" "}
          <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted text-xs font-mono">
            /
          </kbd>{" "}
          to search
        </p>
      </footer>
    </div>
  );
};

export default Index;
