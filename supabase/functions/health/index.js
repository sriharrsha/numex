// @ts-check
// Follow this pattern to import standard ES Modules in Deno:
// import * as mod from "https://deno.land/std@0.170.0/log/mod.ts";

console.log("Health function cold start");

export default async (req) => {
  console.log("Health function invoked");

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*', // Adjust for production
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  if (req.method === 'GET') {
    const data = {
      status: "healthy",
      message: "Business Name Generator API (Supabase Function) is running!",
      timestamp: new Date().toISOString(),
      deno_version: Deno.version.deno,
    };

    return new Response(
      JSON.stringify(data),
      {
        headers: { 
          "Content-Type": "application/json",
          'Access-Control-Allow-Origin': '*' // Adjust for production
        },
        status: 200
      }
    );
  } else {
    return new Response(
      JSON.stringify({ error: `Method ${req.method} Not Allowed` }),
      {
        headers: { 
          "Content-Type": "application/json",
          'Access-Control-Allow-Origin': '*' // Adjust for production
        },
        status: 405
      }
    );
  }
};
