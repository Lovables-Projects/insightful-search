import { Sparkles, Lightbulb, Code, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WelcomeScreenProps {
  onPromptClick: (prompt: string) => void;
}

const suggestedPrompts = [
  {
    icon: Lightbulb,
    title: "Explain a concept",
    prompt: "Explain quantum computing in simple terms",
  },
  {
    icon: Code,
    title: "Help with code",
    prompt: "How do I create a responsive navbar in React?",
  },
  {
    icon: BookOpen,
    title: "Learn something new",
    prompt: "What are the best practices for API design?",
  },
];

export function WelcomeScreen({ onPromptClick }: WelcomeScreenProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 animate-fade-in">
      <div className="text-center space-y-6 max-w-2xl">
        {/* Logo */}
        <div className="inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25 mb-4">
          <Sparkles className="h-10 w-10 text-white" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Welcome to Chat AI
          </h1>
          <p className="text-muted-foreground text-lg">
            Your intelligent assistant powered by Subfeed AI. Ask me anything!
          </p>
        </div>

        {/* Suggested Prompts */}
        <div className="grid gap-3 sm:grid-cols-3 mt-8">
          {suggestedPrompts.map((item, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto flex-col items-start gap-2 p-4 text-left hover:bg-muted/50 hover:border-primary/50 transition-all"
              onClick={() => onPromptClick(item.prompt)}
            >
              <item.icon className="h-5 w-5 text-primary" />
              <div>
                <div className="font-medium text-sm">{item.title}</div>
                <div className="text-xs text-muted-foreground line-clamp-2">
                  {item.prompt}
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
