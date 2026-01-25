import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              connect-src
                'self'
                https://momentum-ai-production.up.railway.app
                https://*.supabase.co
                https://api.supabase.com;
              img-src 'self' data: https:;
              script-src 'self' 'unsafe-inline' 'unsafe-eval';
              style-src 'self' 'unsafe-inline';
            `
              .replace(/\s{2,}/g, " ")
              .trim(),
          },
        ],
      },
    ]
  },
}

export default nextConfig
