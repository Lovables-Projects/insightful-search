import { supabase } from "@/integrations/supabase/client";

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: Source[];
}

export interface Source {
  title: string;
  url: string;
  snippet?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

let currentSessionId: string | null = null;

export async function sendMessage(message: string): Promise<{
  answer: string;
  session_id: string;
  sources: Source[];
}> {
  const { data, error } = await supabase.functions.invoke('subfeed-chat', {
    body: { message, session_id: currentSessionId }
  });

  if (error) {
    throw new Error(error.message || 'Chat failed');
  }

  if (data.error) {
    throw new Error(data.error);
  }

  if (data.session_id) {
    currentSessionId = data.session_id;
  }

  return {
    answer: data.answer || '',
    session_id: data.session_id || currentSessionId || '',
    sources: (data.sources || []).map((s: any) => ({
      title: s.title || 'Source',
      url: s.url || s.link || '',
      snippet: s.snippet || s.description || '',
    })),
  };
}

export function clearSession(): void {
  currentSessionId = null;
}

export function getCurrentSessionId(): string | null {
  return currentSessionId;
}

export function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
