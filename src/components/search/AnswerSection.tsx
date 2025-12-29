import { Sparkles, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SearchResult } from "@/lib/subfeed";

interface AnswerSectionProps {
  answer: string;
  sources: SearchResult[];
  query: string;
}

export function AnswerSection({ answer, sources, query }: AnswerSectionProps) {
  const [copied, setCopied] = useState(false);

  const copyAnswer = async () => {
    await navigator.clipboard.writeText(answer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Add citation links to answer
  const renderAnswerWithCitations = (text: string) => {
    // Match [1], [2], etc. patterns
    const parts = text.split(/(\[\d+\])/g);
    
    return parts.map((part, index) => {
      const match = part.match(/\[(\d+)\]/);
      if (match) {
        const citationIndex = parseInt(match[1]) - 1;
        const source = sources[citationIndex];
        if (source) {
          return (
            <a
              key={index}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center h-5 w-5 text-xs font-medium bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors mx-0.5 align-super"
              title={source.title}
            >
              {match[1]}
            </a>
          );
        }
      }
      
      // Handle code blocks
      if (part.includes('```')) {
        const codeBlocks = part.split(/(```[\s\S]*?```)/g);
        return codeBlocks.map((block, i) => {
          if (block.startsWith('```') && block.endsWith('```')) {
            const content = block.slice(3, -3);
            const firstNewline = content.indexOf('\n');
            const language = firstNewline > 0 ? content.slice(0, firstNewline).trim() : '';
            const code = firstNewline > 0 ? content.slice(firstNewline + 1) : content;
            
            return (
              <div key={`${index}-${i}`} className="my-4 rounded-lg overflow-hidden border border-border">
                <div className="flex items-center justify-between bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
                  <span>{language || 'code'}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2"
                    onClick={() => navigator.clipboard.writeText(code)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <pre className="bg-muted/30 p-3 overflow-x-auto">
                  <code className="text-sm font-mono">{code}</code>
                </pre>
              </div>
            );
          }
          return block;
        });
      }
      
      // Handle inline code
      if (part.includes('`')) {
        const inlineParts = part.split(/(`[^`]+`)/g);
        return inlineParts.map((inline, i) => {
          if (inline.startsWith('`') && inline.endsWith('`')) {
            return (
              <code key={`${index}-${i}`} className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
                {inline.slice(1, -1)}
              </code>
            );
          }
          // Handle bold
          if (inline.includes('**')) {
            const boldParts = inline.split(/(\*\*[^*]+\*\*)/g);
            return boldParts.map((bold, j) => {
              if (bold.startsWith('**') && bold.endsWith('**')) {
                return <strong key={`${index}-${i}-${j}`}>{bold.slice(2, -2)}</strong>;
              }
              return bold;
            });
          }
          return inline;
        });
      }
      
      return part;
    });
  };

  if (!answer) {
    return (
      <div className="p-6 rounded-xl border border-border bg-muted/20">
        <p className="text-muted-foreground text-center">
          No answer available for this query.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="font-medium text-foreground">AI Answer</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={copyAnswer}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>

      {/* Answer Content */}
      <div className="prose prose-sm dark:prose-invert max-w-none">
        <div className="text-foreground leading-relaxed whitespace-pre-wrap">
          {renderAnswerWithCitations(answer)}
        </div>
      </div>
    </div>
  );
}
