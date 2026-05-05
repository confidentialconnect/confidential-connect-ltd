import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const { token } = await req.json();

        if (!token) {
            return new Response(
                JSON.stringify({ success: false, error: 'No reCAPTCHA token provided' }),
                { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        const secretKey = Deno.env.get('RECAPTCHA_SECRET_KEY');

        if (!secretKey) {
            // If no secret key configured, pass through (allows development without keys)
            console.warn('RECAPTCHA_SECRET_KEY not configured — skipping verification');
            return new Response(
                JSON.stringify({ success: true, warning: 'reCAPTCHA not configured on server' }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;
        const verifyResponse = await fetch(verifyUrl, { method: 'POST' });
        const verifyData = await verifyResponse.json();

        return new Response(
            JSON.stringify({
                success: verifyData.success === true,
                score: verifyData.score,
                error: verifyData['error-codes'] || null
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    } catch (error) {
        console.error('reCAPTCHA verification error:', error);
        return new Response(
            JSON.stringify({ success: false, error: 'Verification failed' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
});
