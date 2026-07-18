import type { APIRoute } from 'astro';
import * as env from 'astro:env/server';

export const GET: APIRoute = async ({ request }) => {
  const client_id = env.GITHUB_CLIENT_ID;

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

  } catch (error: unknown) {
    const err = error as Error;
    console.error(error);
    return new Response(err.message, {
      status: 500,
    });
  }
}
