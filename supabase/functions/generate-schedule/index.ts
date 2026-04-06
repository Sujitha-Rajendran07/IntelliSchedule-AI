import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are an expert productivity planner and schedule optimizer.

When the user describes their day, commitments, goals, and deadlines, create a realistic, optimized daily schedule.

Rules:
- Prioritize important and urgent tasks
- Allocate proper time slots with specific times (e.g., 6:00 AM – 7:00 AM)
- Avoid overloading — keep it realistic
- Include short breaks (5-15 min) between intensive blocks
- Add meals if not mentioned
- If multiple days are relevant, create a multi-day plan
- Format output clearly with "Day X:" headers and time slots using "→" arrows
- End with 2-3 practical productivity tips prefixed with "💡"

Keep the output clean and easy to read. No markdown formatting — use plain text with clear structure.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Please provide a valid prompt." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

const response = await fetch(
  `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: `${SYSTEM_PROMPT}\n\nUser Input:\n${prompt}`,
            },
          ],
        },
      ],
    }),
  }
);

const data = await response.json();

// Extract response
const result = data.candidates[0].content.parts[0].text;  can i replace this only in that file or add anything extra

    // Save to database
    try {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseKey);
      await supabase.from("schedules").insert({ prompt: prompt.trim(), schedule });
    } catch (dbErr) {
      console.error("Failed to save schedule:", dbErr);
    }

    return new Response(
      JSON.stringify({ schedule }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("generate-schedule error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
