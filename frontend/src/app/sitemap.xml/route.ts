import { NextResponse } from 'next/server';

export async function GET() {
  const domain = 'https://profptiy-luxury.com'; // Dynamic template domain
  
  // Core pages
  const pages = [
    '',
    '/about',
    '/services',
    '/properties',
    '/featured',
    '/testimonials',
    '/blog',
    '/contact',
    '/book',
    '/privacy',
    '/terms',
    '/faq',
    '/career',
  ];

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages
    .map((page) => {
      return `
  <url>
    <loc>${domain}${page}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page === '' || page === '/properties' || page === '/blog' ? 'daily' : 'weekly'}</changefreq>
    <priority>${page === '' ? '1.0' : page === '/properties' ? '0.9' : '0.8'}</priority>
  </url>`;
    })
    .join('')}
</urlset>`;

  return new NextResponse(sitemapXml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate',
    },
  });
}
