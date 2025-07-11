import type {NextConfig} from 'next';

const repo = 'tamil-lexicon';
const assetPrefix = `/${repo}/`;
const basePath = `/${repo}`;

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  output: 'export',
  trailingSlash: true,
  assetPrefix: assetPrefix,
  basePath: basePath,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
