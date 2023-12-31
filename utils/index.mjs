import * as path from 'path'
import { getHashDigest } from 'loader-utils'

const ROOT = process.cwd()

export function resolveRoot(...p) {
  return path.resolve(ROOT, ...p)
}

export function hashOnlyIdent(context, _, exportName) {
  return getHashDigest(
    Buffer.from(
      `filePath:${path
        .relative(context.rootContext, context.resourcePath)
        .replace(/\\+/g, '/')}#className:${exportName}`
    ),
    // 使用base64编码会出现 / 在字符当中，在cssnano进行压缩的时候，会把其当作没有闭合的「注释」。
    'md5',
    'base62', // [a - z A - Z 0 - 9]
    6
  ).replace(/^(-?\d|--)/, '_$1')
}

/** @type {import('next').NextConfig['webpack']} */
export const webpackConfig = (config, { dev }) => {
  // svg loader
  // https://react-svgr.com/docs/webpack/#use-svgr-and-asset-svg-in-the-same-project
  config.module.rules.push({
    test: /\.svg$/,
    include: resolveRoot('src/svg'),
    issuer: /\.(js|ts)x?$/,
    use: [
      {
        loader: '@svgr/webpack',
        options: {
          ref: true,
          // https://react-svgr.com/docs/options/#dimensions
          dimensions: false,
          svgProps: {
            width: '1em',
            height: '1em',
            display: 'inline-block',
            fill: 'currentColor',
            focusable: 'false',
            color: 'inherit',
            fontSize: 'inherit',
            'data-generated-svg': '',
            'aria-hidden': 'true',
          },
        },
      },
    ],
  })
  config.resolve.alias['@ROOT'] = resolveRoot()
  config.resolve.alias['@'] = resolveRoot('src')
  if (!dev) {
    // https://stackoverflow.com/a/69166434
    config.module.rules
      .find((rule) => typeof rule.oneOf === 'object')
      .oneOf.filter((rule) => Array.isArray(rule.use))
      .forEach((rule) => {
        rule.use.forEach((moduleLoader) => {
          if (
            moduleLoader.loader &&
            moduleLoader.loader.includes('css-loader') &&
            !moduleLoader.loader.includes('postcss-loader') &&
            moduleLoader.options &&
            typeof moduleLoader.options.modules === 'object'
          ) {
            moduleLoader.options.modules.getLocalIdent = hashOnlyIdent
          }
        })
      })
  }
  return config
}
