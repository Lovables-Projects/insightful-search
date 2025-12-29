import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();

    if (!query || typeof query !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Query is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('SUBFEED_API_KEY');
    const entityId = Deno.env.get('SUBFEED_ENTITY_ID');

    if (!apiKey || !entityId) {
      console.error('Missing SUBFEED_API_KEY or SUBFEED_ENTITY_ID');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiUrl = `https://api.subfeed.app/v1/entity/${entityId}/actions/web_search`;
    
    console.log(`Searching for: "${query}"`);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        params: { 
          query, 
          max_results: 6, 
          include_answer: true 
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Subfeed API error: ${response.status} - ${errorText}`);
      return new Response(
        JSON.stringify({ error: `Search API error: ${response.status}` }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('Search completed successfully');

    return new Response(
      JSON.stringify({
        answer: data.data?.answer || '',
        results: data.data?.results || [],
        session_id: data.session_id,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in subfeed-search function:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
