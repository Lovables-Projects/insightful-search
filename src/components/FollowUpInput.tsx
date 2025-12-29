import { Send, Loader2 } from "lucide-react";
import { useState, KeyboardEvent } from "react";

interface FollowUpInputProps {
  onSubmit: (message: string) => void;
  isLoading?: boolean;
}

export function FollowUpInput({ onSubmit, isLoading = false }: FollowUpInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    const trimmed = message.trim();
    if (trimmed && !isLoading) {
      onSubmit(trimmed);
      setMessage("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="relative flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3 shadow-card">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask a follow-up question..."
        disabled={isLoading}
        className="flex-1 bg-transparent border-none outline-none placeholder:text-muted-foreground text-foreground text-sm"
      />
      <button
        onClick={handleSubmit}
        disabled={isLoading || !message.trim()}
        className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}
