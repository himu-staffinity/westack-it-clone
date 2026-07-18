import { SITE_URL } from '../config';

export async function GET() {
  const body = `User-agent: *
Disallow:
Sitemap: ${SITE_URL}/sitemap-index.xml`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain' }
  });
}
