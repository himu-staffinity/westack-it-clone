import { getSecret } from 'fastedge::secret';

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

const handler = async (request) => {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const body = await request.json();
    const { email, product, recaptchaToken } = body;

    const RECAPTCHA_SECRET_KEY = getSecret('RECAPTCHA_SECRET_KEY');
    if (recaptchaToken && RECAPTCHA_SECRET_KEY) {
      const googleResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`,
      });
      const verification = await googleResponse.json();
      if (!verification.success) {
        return new Response(JSON.stringify({
          success: false,
          message: 'Captcha verification failed',
          debug: verification['error-codes'],
        }), {
          headers: { 'Content-Type': 'application/json' },
          status: 400,
        });
      }
    }

    const BREVO_API_KEY = getSecret('BREVO_API_KEY');
    if (!BREVO_API_KEY) {
      return new Response(JSON.stringify({ success: false, error: 'Missing Brevo API key' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    const subject = `Demo Request for ${product.title} by ${email}`;
    const htmlContent = `
      <h2>Demo Request</h2>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Product:</strong> ${product.title}</p>
      <pre>${JSON.stringify(product, null, 2)}</pre>
    `;

    const res = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: 'WeStack', email: 'noreply@westack-it.eu' },
        to: [{ email: 'leads@westack-it.eu' }],
        subject,
        htmlContent,
        replyTo: { email },
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

addEventListener('fetch', (event) => {
  event.respondWith(handler(event.request));
});
