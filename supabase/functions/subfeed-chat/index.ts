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
    const { message, session_id } = await req.json();

    if (!message || typeof message !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Message is required and must be a string' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('SUBFEED_API_KEY');
    const entityId = Deno.env.get('SUBFEED_ENTITY_ID');

    if (!apiKey || !entityId) {
      console.error('Missing API key or entity ID');
      return new Response(
        JSON.stringify({ error: 'API configuration missing' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiUrl = `https://api.subfeed.app/v1/entity/${entityId}/chat`;
    console.log('Calling Subfeed Chat API:', apiUrl);

    const requestBody: { message: string; session_id?: string } = { message };
    if (session_id) {
      requestBody.session_id = session_id;
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Subfeed API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: `Chat API error: ${response.status}` }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('Subfeed API response:', JSON.stringify(data));

    return new Response(
      JSON.stringify({
        answer: data.answer || data.response || data.message || '',
        session_id: data.session_id || session_id,
        sources: data.sources || data.results || [],
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error in subfeed-chat function:', error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
