import { NextResponse } from 'next/server';

export async function GET() {
  const domain = 'https://profptiy-luxury.com';
  
  const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/*

Sitemap: ${domain}/sitemap.xml
`;

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate',
    },
  });
}
