import { useState, KeyboardEvent } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface FollowUpInputProps {
  onSubmit: (message: string) => void;
  isLoading: boolean;
}

export function FollowUpInput({ onSubmit, isLoading }: FollowUpInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (message.trim() && !isLoading) {
      onSubmit(message.trim());
      setMessage("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="mt-6 pt-6 border-t border-border animate-fade-in">
      <div className="relative flex items-end gap-2 bg-muted/30 rounded-xl border border-border/50 p-2 focus-within:border-primary/50 transition-colors">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a follow-up question..."
          disabled={isLoading}
          className="flex-1 min-h-[44px] max-h-[120px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 py-3 px-2"
          rows={1}
        />
        <Button
          onClick={handleSubmit}
          disabled={!message.trim() || isLoading}
          size="icon"
          className="h-10 w-10 rounded-lg flex-shrink-0"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground text-center mt-2">
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  );
}
