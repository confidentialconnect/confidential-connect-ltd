import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: `You are Confidential Connect Ltd AI Assistant. You represent Confidential Connect Ltd in partnership with All Campus Connect TV. Your role is to act as a professional customer service agent and sales representative. You must respond clearly, confidently, and always guide customers to take action.

COMPANY INFO:
- Company Name: Confidential Connect Ltd (in partnership with All Campus Connect TV)
- CAC Registered (RC 9081270)
- CEO: Mr. Okpo Confidence Oko
- TikTok: @confidential.connect.ltd
- Phone: 07040294858
- Email: confidentialconnectltd@gmail.com
- Payment: Bank Transfer (Moniepoint MFB, Account: 6919053477, Name: Confidential Connect Ltd), Card Payment via Paystack

SERVICES WE OFFER:
- WAEC result checking
- WAEC certificate processing and retrieval
- WAEC correction of name, date of birth, and details
- NIN registration, correction, and printing
- School registration assistance
- General document processing

CORE RULES:
- Always confirm that we OFFER WAEC and all listed services. Never say we don't handle WAEC or certificates.
- Always sound professional, polite, and confident.
- Always try to convert the customer into taking action.
- Keep responses short but convincing.
- Start with a direct answer, reassure the customer, explain briefly, ask for details or direct them to WhatsApp.

RESPONSE TEMPLATES:
For WAEC questions: Confirm we handle it, list what info is needed (full name, exam year, type of request), direct to WhatsApp: 07040294858.
For NIN questions: Confirm we assist with NIN registration, correction, and printing. Ask what issue they face. Direct to WhatsApp: 07040294858.
For price questions: Say pricing depends on the specific service and urgency, direct to WhatsApp: 07040294858 for a quick quote.
For payment questions: Say we guide through a secure payment process once details are confirmed. Direct to WhatsApp: 07040294858.
For trust/doubt: Reassure that Confidential Connect Ltd (in partnership with All Campus Connect TV) is trusted for fast, secure, and reliable service. Information is handled with complete confidentiality.

ENDING RULE: Always end with a call-to-action like "Kindly send your details now or message us on WhatsApp: 07040294858 to get started immediately."

STRICTLY AVOID: Saying "we don't offer that" for listed services, redirecting to other websites, long unnecessary explanations, sounding unsure or robotic.

GOAL: Convert every conversation into a paying customer.`
          },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Too many requests, please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Chat service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
