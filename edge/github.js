import { getEnv } from 'fastedge::env';
import { getSecret } from 'fastedge::secret';

function renderBody(status, content) {
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
  const blob = new Blob([html]);
  return blob;
}

async function handleCallback(request) {
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
      return new Response(renderBody('error', result), {
        headers: {
          'content-type': 'text/html;charset=UTF-8',
        },
        status: 401
      });
    }
    const token = result.access_token;
    const provider = 'github';
    const responseBody = renderBody('success', {
      token,
      provider,
    });
    return new Response(responseBody, {
      headers: {
        'content-type': 'text/html;charset=UTF-8',
      },
      status: 200
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

async function handleAuth(request) {
  const client_id = getEnv('GITHUB_CLIENT_ID');
  try {
    const url = new URL(request.url);
    const redirectUrl = new URL('https://github.com/login/oauth/authorize');
    redirectUrl.searchParams.set('client_id', client_id);
    redirectUrl.searchParams.set('redirect_uri', url.origin + '/api/callback');
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

addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (url.pathname.includes('/callback')) {
    event.respondWith(handleCallback(event.request));
  } else {
    event.respondWith(handleAuth(event.request));
  }
});
