import { webpackConfig } from './utils/index.mjs'
import imageConfig from './next-image.config.js'
import NextBundleAnalyzer from '@next/bundle-analyzer'
const withBundleAnalyzer = NextBundleAnalyzer({
  enabled:
    process.env.ANALYZE === 'true' && process.env.NODE_ENV === 'production',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
  images: imageConfig.images,
  webpack: webpackConfig,
  async headers() {
    return [
      {
        source: '/(pwa|scripts|static)/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, must-revalidate',
          },
        ],
      },
      {
        source: '/(__ENV_CONFIG__\\.js|manifest\\.json|favicon.ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, must-revalidate',
          },
        ],
      },
    ]
  },
}

export default withBundleAnalyzer(nextConfig)
