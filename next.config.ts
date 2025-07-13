import type {NextConfig} from 'next';

const isGithubActions = process.env.GITHUB_ACTIONS || false

let assetPrefix = ''
let basePath = ''

if (isGithubActions) {
  // This configuration is for static exports to GitHub Pages.
  // Since we are moving to a dynamic server-based app, this may no longer be applicable
  // depending on your new hosting provider.
  const repo = process.env.GITHUB_REPOSITORY!.replace(/.*?\//, '')
  assetPrefix = `/${repo}/`
  basePath = `/${repo}`
}


const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Removing 'output: export' to enable dynamic server-side rendering
  // and client-side data fetching behavior.
  // output: 'export',
  // trailingSlash: true,
  // The following configs are generally for static exports.
  // You may need to adjust them based on your hosting provider.
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
