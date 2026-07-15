import { SITE_URL } from '../config'; // adjust path as needed


export async function GET() {
    const robotsTxt = `User-agent: *
Disallow:

Sitemap: ${SITE_URL}/sitemap-index.xml`;

    return new Response(robotsTxt, {
        headers: {
            'Content-Type': 'text/plain'
        }
    });
} 