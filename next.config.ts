import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [420, 640, 828, 1080, 1440, 1920],
    imageSizes: [96, 160, 256, 384],
  },
  // three.js ships ES modules that Next should transpile for the client bundle.
  transpilePackages: ['three'],
};

export default withNextIntl(nextConfig);
