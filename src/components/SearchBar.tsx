import { Search, ArrowRight, Loader2 } from "lucide-react";
import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  size?: "large" | "compact";
  autoFocus?: boolean;
  initialValue?: string;
}

export function SearchBar({
  onSearch,
  isLoading = false,
  placeholder = "Ask anything...",
  size = "large",
  autoFocus = false,
  initialValue = "",
}: SearchBarProps) {
  const [query, setQuery] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSubmit = () => {
    const trimmed = query.trim();
    if (trimmed && !isLoading) {
      onSearch(trimmed);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div
      className={cn(
        "relative w-full group",
        size === "large" ? "max-w-2xl" : "max-w-xl"
      )}
    >
      <div
        className={cn(
          "absolute inset-0 rounded-2xl bg-primary/10 blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"
        )}
      />
      <div
        className={cn(
          "relative flex items-center gap-3 bg-card border border-border rounded-2xl shadow-card transition-all duration-200",
          "focus-within:border-primary/50 focus-within:shadow-elevated",
          size === "large" ? "px-5 py-4" : "px-4 py-3"
        )}
      >
        <Search
          className={cn(
            "shrink-0 text-muted-foreground",
            size === "large" ? "h-5 w-5" : "h-4 w-4"
          )}
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={isLoading}
          className={cn(
            "flex-1 bg-transparent border-none outline-none placeholder:text-muted-foreground text-foreground",
            size === "large" ? "text-lg" : "text-base"
          )}
        />
        <div className="flex items-center gap-2">
          <kbd className="hidden sm:inline-flex h-6 items-center gap-1 rounded border border-border bg-muted px-2 font-mono text-xs text-muted-foreground">
            /
          </kbd>
          <button
            onClick={handleSubmit}
            disabled={isLoading || !query.trim()}
            className={cn(
              "flex items-center justify-center rounded-xl bg-primary text-primary-foreground transition-all duration-200",
              "hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed",
              size === "large" ? "h-10 w-10" : "h-8 w-8"
            )}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
