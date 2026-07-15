import type { APIRoute } from 'astro'
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

export const onRequestPost = async (context: any) => {
    try {
        const body = await context.request.json();
        const { email, product } = body;

        console.log(`Email: ${email}\nProduct data:\n${JSON.stringify(product, null, 2)}`);

        // Read API key from Cloudflare Pages secret
        const BREVO_API_KEY = context.env.BREVO_API_KEY;
        if (!BREVO_API_KEY) {
            return new Response(JSON.stringify({ success: false, error: 'Missing Brevo API key' }), {
                headers: { 'Content-Type': 'application/json' },
                status: 500,
            });
        }

        // Compose the email content
        const subject = `Demo Request for ${product.title} by ${email}`;
        const htmlContent = `
      <h2>Demo Request</h2>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Product:</strong> ${product.title}</p>
      <pre>${JSON.stringify(product, null, 2)}</pre>
    `;

        // Send email via Brevo API
        const res = await fetch(BREVO_API_URL, {
            method: 'POST',
            headers: {
                'api-key': BREVO_API_KEY,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                sender: { name: 'WeStack', email: 'noreply@westack-it.eu' }, // Use a sender verified in Brevo
                to: [{ email: 'leads@westack-it.eu' }], // Change to your recipient
                subject,
                htmlContent,
                replyTo: { email }
            }),
        });

        if (!res.ok) {
            const error = await res.text();
            return new Response(JSON.stringify({ success: false, error }), {
                headers: { 'Content-Type': 'application/json' },
                status: 500,
            });
        }

        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
        });
    } catch (err) {
        return new Response(JSON.stringify({ success: false, error: err instanceof Error ? err.message : 'Unknown error' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500,
        });
    }
};
//bnkk
export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const { recaptchaToken } = body;

    const env = (locals as any).runtime?.env || {};
    const secretKey = env.RECAPTCHA_SECRET_KEY || import.meta.env.RECAPTCHA_SECRET_KEY;

    
    if (!secretKey) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: "Server Configuration Error: Secret Key missing" 
      }), { status: 500 });
    }

   
    const googleResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${secretKey}&response=${recaptchaToken}`,
    });

    const verification = await googleResponse.json();

    
    if (!verification.success) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Captcha verification failed',
        debug: verification['error-codes'] 
      }), { status: 400 });
    }

  
    return new Response(JSON.stringify({
      success: true,
      message: 'Captcha verified successfully!'
    }), { status: 200 });

  } catch (error: any) {
    return new Response(JSON.stringify({
      success: false,
      message: 'Internal Server Error',
      error: error.message
    }), { status: 500 });
  }
};
