import { getCollection } from 'astro:content';
import { SITE_URL } from '../config'; // adjust path as needed


// Function to escape XML special characters
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const products = await getCollection('products');
  const items = products.map(product => {
    // Combine title and tags for keywords
    const keywords = [
      product.data.title,
      ...(product.data.tags || [])
    ].join(', ');

    return `
    <url>
      <loc>${SITE_URL}/products/${product.slug}</loc>
      <news:news>
        <news:publication>
          <news:name>WeStack</news:name>
          <news:language>de</news:language>
        </news:publication>
        <news:publication_date>${new Date().toISOString().split('T')[0]}</news:publication_date>
        <news:title>${escapeXml(product.data.title)}</news:title>
        <news:keywords>${escapeXml(keywords)}</news:keywords>
      </news:news>
    </url>
  `;
  }).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
  ${items}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml'
    }
  });
} 