import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Allow LAN access during local/dev (host IP / hostname).
  allowedDevOrigins: ['192.168.1.199', 'localhost', '127.0.0.1'],
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
  transpilePackages: ['motion', '@excalidraw/excalidraw'],
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https://picsum.photos; connect-src 'self' https:; frame-ancestors 'self' https://*.google.com https://*.googleapis.com https://*.run.app; base-uri 'self'; form-action 'self'",
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
    if (dev) {
      config.cache = false;
    }
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = {
        ignored: /.*/,
      };
    }
    return config;
  },
};

export default nextConfig;
