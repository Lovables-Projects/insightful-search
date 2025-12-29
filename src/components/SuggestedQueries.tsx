import { Sparkles } from "lucide-react";

interface SuggestedQueriesProps {
  onSelect: (query: string) => void;
}

const suggestions = [
  "What is quantum computing?",
  "Explain blockchain simply",
  "Latest AI breakthroughs",
  "How does GPT work?",
];

export function SuggestedQueries({ onSelect }: SuggestedQueriesProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {suggestions.map((query) => (
        <button
          key={query}
          onClick={() => onSelect(query)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors duration-200 border border-transparent hover:border-border"
        >
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          {query}
        </button>
      ))}
    </div>
  );
}
