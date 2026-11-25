import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Allow LAN & Cloud Run preview access during dev (avoids blocked /_next/* chunk requests).
  allowedDevOrigins: [
    '192.168.1.199',
    'localhost',
    '127.0.0.1',
    '*.run.app',
    '*.us-east1.run.app',
  ],
  // Smaller responses; Cloudflare already strips some fingerprint headers.
  poweredByHeader: false,
  // Workers Free has no Next.js Image Optimization runtime — serve as-is.
  // (Cloudflare Images / Polish would be a paid add-on.)
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Tree-shake heavy icon/chart barrels for smaller client + worker graphs.
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts'],
  },
  async headers() {
    // Cloud Run / AI Studio previews load the app from https://*.run.app and
    // fetch /_next/* chunks from that same host family. Explicit run.app hosts
    // keep script/style/connect working when the document is framed or proxied.
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.run.app https://*.us-east1.run.app",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.run.app https://*.us-east1.run.app",
      "font-src 'self' https://fonts.gstatic.com data: https://*.run.app https://*.us-east1.run.app",
      "img-src 'self' data: blob: https://picsum.photos https://*.run.app https://*.us-east1.run.app",
      "connect-src 'self' https: wss: https://*.run.app https://*.us-east1.run.app wss://*.run.app wss://*.us-east1.run.app",
      "worker-src 'self' blob: https://*.run.app https://*.us-east1.run.app",
      "frame-ancestors 'self' https://*.google.com https://*.googleapis.com https://*.run.app https://*.us-east1.run.app",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; ');

    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: csp,
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
    ];
  },
  webpack: (config, { dev }) => {
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = {
        ignored: /.*/,
      };
    }
    return config;
  },
};

export default nextConfig;
