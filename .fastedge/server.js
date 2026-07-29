/*
 * Combined FastEdge entry point
 * Static site serving + Edge API functions in one WASM
 *
 * Routes:
 *   /request-demo            → Demo request form handler (POST)
 *   /api/auth         → GitHub OAuth login initiation
 *   /api/callback → GitHub OAuth callback
 *   /*                       → Static asset server (with 404 fallback)
 */
import { createStaticServer } from "@gcoredev/fastedge-sdk-js";
import { staticAssetManifest } from "../.fastedge/build/static-asset-manifest.js";
import { serverConfig } from "../.fastedge/build-config.js";
import { getEnv } from 'fastedge::env';
import { getSecret } from 'fastedge::secret';

const staticServer = createStaticServer(staticAssetManifest, serverConfig);

// ═══════════════════════════════════════════════════════════════
// Demo Request Handler (from edge/request-demo.js)
// ═══════════════════════════════════════════════════════════════

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

async function handleRequestDemo(request) {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const body = await request.json();
    const { email, product } = body;

    const BREVO_API_KEY = getSecret('BREVO_API_KEY');
    if (!BREVO_API_KEY) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing Brevo API key' }),
        {
          headers: { 'Content-Type': 'application/json' },
          status: 500,
        },
      );
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
    return new Response(
      JSON.stringify({
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error',
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
}

// ═══════════════════════════════════════════════════════════════
// GitHub OAuth Handler (from edge/github.js)
// ═══════════════════════════════════════════════════════════════

function renderGithubBody(status, content) {
  const html = `
    <script>
      const receiveMessage = (message) => {
        window.opener.postMessage(
          'authorization:github:${status}:${JSON.stringify(content)}',
          message.origin
        );
        window.removeEventListener("message", receiveMessage, false);
      }
      window.addEventListener("message", receiveMessage, false);
      window.opener.postMessage("authorizing:github", "*");
    </script>
    `;
  return new Blob([html]);
}

async function handleGithubCallback(request) {
  const client_id = getEnv('GITHUB_CLIENT_ID');
  const client_secret = getSecret('GITHUB_CLIENT_SECRET');

  try {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const response = await fetch(
      'https://github.com/login/oauth/access_token',
      {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'user-agent': 'cloudflare-functions-github-oauth-login-demo',
          'accept': 'application/json',
        },
        body: JSON.stringify({ client_id, client_secret, code }),
      },
    );
    const result = await response.json();
    if (result.error) {
      return new Response(renderGithubBody('error', result), {
        headers: {
          'content-type': 'text/html;charset=UTF-8',
        },
        status: 401,
      });
    }
    const token = result.access_token;
    const provider = 'github';
    const responseBody = renderGithubBody('success', {
      token,
      provider,
    });
    return new Response(responseBody, {
      headers: {
        'content-type': 'text/html;charset=UTF-8',
      },
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return new Response(error.message, {
      headers: {
        'content-type': 'text/html;charset=UTF-8',
      },
      status: 500,
    });
  }
}

async function handleGithubAuth(request) {
  const client_id = getEnv('GITHUB_CLIENT_ID');
  try {
    const url = new URL(request.url);
    const redirectUrl = new URL('https://github.com/login/oauth/authorize');
    redirectUrl.searchParams.set('client_id', client_id);
    redirectUrl.searchParams.set(
      'redirect_uri',
      url.origin + '/api/callback',
    );
    redirectUrl.searchParams.set('scope', 'repo user');
    redirectUrl.searchParams.set(
      'state',
      crypto.getRandomValues(new Uint8Array(12)).join(''),
    );
    return Response.redirect(redirectUrl.href, 301);
  } catch (error) {
    return new Response(error.message, {
      status: 500,
    });
  }
}

// ═══════════════════════════════════════════════════════════════
// Main Router
// ═══════════════════════════════════════════════════════════════

async function handleRequest(event) {
  const url = new URL(event.request.url);
  const path = url.pathname;

  // Route: Demo request form submission (POST)
  if (path === '/request-demo') {
    return handleRequestDemo(event.request);
  }

  // Route: GitHub OAuth — initiate login
  if (path === '/api/auth') {
    return handleGithubAuth(event.request);
  }

  // Route: GitHub OAuth — callback from GitHub
  if (path === '/api/callback') {
    return handleGithubCallback(event.request);
  }

  // Default: Serve static assets from the dist/ build
  const response = await staticServer.serveRequest(event.request);
  if (response != null) {
    return response;
  }

  return new Response('Not found', { status: 404 });
}

addEventListener('fetch', (event) => event.respondWith(handleRequest(event)));
