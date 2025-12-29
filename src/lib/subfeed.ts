import { supabase } from "@/integrations/supabase/client";

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  domain?: string;
  favicon?: string;
}

export interface SearchResponse {
  answer: string;
  results: SearchResult[];
  session_id: string;
}

let currentSessionId: string | null = null;

export async function search(query: string): Promise<SearchResponse> {
  const { data, error } = await supabase.functions.invoke('subfeed-search', {
    body: { query }
  });

  if (error) {
    throw new Error(error.message || 'Search failed');
  }

  if (data.error) {
    throw new Error(data.error);
  }

  currentSessionId = data.session_id;
  
  return {
    answer: data.answer || '',
    results: (data.results || []).map((r: any) => ({
      title: r.title || 'Untitled',
      url: r.url || r.link || '',
      snippet: r.snippet || r.description || r.content || '',
      domain: extractDomain(r.url || r.link || ''),
      favicon: getFaviconUrl(r.url || r.link || ''),
    })),
    session_id: data.session_id,
  };
}

export async function followUp(message: string, sessionId?: string): Promise<SearchResponse> {
  const activeSessionId = sessionId || currentSessionId;
  
  if (!activeSessionId) {
    throw new Error('No active search session. Please perform a search first.');
  }

  const { data, error } = await supabase.functions.invoke('subfeed-followup', {
    body: { message, session_id: activeSessionId }
  });

  if (error) {
    throw new Error(error.message || 'Follow-up failed');
  }

  if (data.error) {
    throw new Error(data.error);
  }

  currentSessionId = data.session_id || activeSessionId;

  return {
    answer: data.answer || '',
    results: (data.results || []).map((r: any) => ({
      title: r.title || 'Untitled',
      url: r.url || r.link || '',
      snippet: r.snippet || r.description || r.content || '',
      domain: extractDomain(r.url || r.link || ''),
      favicon: getFaviconUrl(r.url || r.link || ''),
    })),
    session_id: data.session_id || activeSessionId,
  };
}

export function clearHistory(): void {
  currentSessionId = null;
}

export function hasActiveSession(): boolean {
  return currentSessionId !== null;
}

function extractDomain(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    return hostname.replace('www.', '');
  } catch {
    return '';
  }
}

function getFaviconUrl(url: string): string {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  } catch {
    return '';
  }
}
