import { Bot } from "lucide-react";
import type { SearchResult } from "@/lib/subfeed";

interface AnswerCardProps {
  answer: string;
  sources: SearchResult[];
}

export function AnswerCard({ answer, sources }: AnswerCardProps) {
  // Parse citations like [1], [2] and make them clickable
  const renderAnswerWithCitations = (text: string) => {
    const citationRegex = /\[(\d+)\]/g;
    const parts = text.split(citationRegex);
    
    return parts.map((part, index) => {
      // Check if this part is a citation number
      if (index % 2 === 1) {
        const citationNum = parseInt(part) - 1;
        const source = sources[citationNum];
        if (source) {
          return (
            <a
              key={index}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-5 min-w-5 px-1.5 mx-0.5 text-xs font-medium rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              {parseInt(part)}
            </a>
          );
        }
        return null;
      }
      
      // Render paragraphs with proper line breaks
      const paragraphs = part.split('\n\n');
      return paragraphs.map((paragraph, pIndex) => {
        const lines = paragraph.split('\n');
        return (
          <span key={`${index}-${pIndex}`}>
            {pIndex > 0 && <><br /><br /></>}
            {lines.map((line, lIndex) => (
              <span key={`${index}-${pIndex}-${lIndex}`}>
                {lIndex > 0 && <br />}
                {line}
              </span>
            ))}
          </span>
        );
      });
    });
  };

  return (
    <div className="rounded-2xl bg-card border border-border p-6 shadow-card animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center h-8 w-8 rounded-lg gradient-primary">
          <Bot className="h-4 w-4 text-primary-foreground" />
        </div>
        <h2 className="text-sm font-medium text-muted-foreground">AI Answer</h2>
      </div>
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <p className="text-foreground leading-relaxed text-base">
          {renderAnswerWithCitations(answer)}
        </p>
      </div>
    </div>
  );
}
