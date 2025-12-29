import { ChatMessage as ChatMessageType } from "@/lib/chat";
import { cn } from "@/lib/utils";
import { User, Sparkles, Copy, Check, ExternalLink } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple markdown-like rendering for code blocks
  const renderContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const codeContent = part.slice(3, -3);
        const firstNewline = codeContent.indexOf('\n');
        const language = firstNewline > 0 ? codeContent.slice(0, firstNewline).trim() : '';
        const code = firstNewline > 0 ? codeContent.slice(firstNewline + 1) : codeContent;
        
        return (
          <div key={index} className="my-3 rounded-lg overflow-hidden border border-border">
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
      
      // Handle inline code
      const inlineCodeParts = part.split(/(`[^`]+`)/g);
      return (
        <span key={index}>
          {inlineCodeParts.map((inlinePart, inlineIndex) => {
            if (inlinePart.startsWith('`') && inlinePart.endsWith('`')) {
              return (
                <code key={inlineIndex} className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
                  {inlinePart.slice(1, -1)}
                </code>
              );
            }
            // Handle bold text
            const boldParts = inlinePart.split(/(\*\*[^*]+\*\*)/g);
            return boldParts.map((boldPart, boldIndex) => {
              if (boldPart.startsWith('**') && boldPart.endsWith('**')) {
                return <strong key={boldIndex}>{boldPart.slice(2, -2)}</strong>;
              }
              return boldPart;
            });
          })}
        </span>
      );
    });
  };

  return (
    <div className={cn(
      "flex gap-3 p-4 animate-fade-in",
      isUser ? "flex-row-reverse" : "flex-row"
    )}>
      {/* Avatar */}
      <div className={cn(
        "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
        isUser ? "bg-primary text-primary-foreground" : "bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
      )}>
        {isUser ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
      </div>

      {/* Message Content */}
      <div className={cn(
        "flex-1 max-w-[80%] space-y-2",
        isUser ? "items-end" : "items-start"
      )}>
        <div className={cn(
          "rounded-2xl px-4 py-3 text-sm leading-relaxed",
          isUser 
            ? "bg-primary text-primary-foreground rounded-tr-sm" 
            : "bg-muted/50 text-foreground rounded-tl-sm border border-border/50"
        )}>
          <div className="whitespace-pre-wrap">{renderContent(message.content)}</div>
        </div>

        {/* Actions for assistant messages */}
        {!isUser && (
          <div className="flex items-center gap-2 px-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
              onClick={copyToClipboard}
            >
              {copied ? <Check className="h-3 w-3 mr-1" /> : <Copy className="h-3 w-3 mr-1" />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
        )}

        {/* Sources */}
        {message.sources && message.sources.length > 0 && (
          <div className="flex flex-wrap gap-2 px-2">
            {message.sources.slice(0, 3).map((source, index) => (
              <a
                key={index}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors bg-muted/30 px-2 py-1 rounded-full"
              >
                <ExternalLink className="h-3 w-3" />
                {source.title || new URL(source.url).hostname}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
