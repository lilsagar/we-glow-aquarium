const siteUrl = "https://we-glow-aquarium.example.com";

export function GET() {
  const body = `User-agent: *
Allow: /
Sitemap: ${siteUrl}/sitemap.xml
`;
  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
