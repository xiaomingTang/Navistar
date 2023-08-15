/* eslint-disable @next/next/no-sync-scripts */
import './globals.css'

import Contexts from '@/common/contexts'
import Polyfills from '@/common/polyfills'
import Providers from '@/common/providers'
import { seo } from '@/utils/seo'

import clsx from 'clsx'
import localFont from 'next/font/local'

import type { Metadata } from 'next'

const inter = localFont({
  src: 'mondia.otf',
  display: 'swap',
})

export const metadata: Metadata = seo.defaults({})

function serverErrorHandler() {
  if (typeof process === 'undefined') {
    return
  }
  process.on('uncaughtException', (e, origin) => {
    // pass
    console.log(e, origin)
  })
  process.on('unhandledRejection', (reason, promise) => {
    // pass
    console.log(reason, promise)
  })
}

serverErrorHandler()

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='zh-cn' suppressHydrationWarning>
      <body className={clsx(inter.className, 'h-screen overflow-y-hidden')}>
        {/* TODO: 这个 ENV_CONFIG 的实现可能有问题 */}
        <script src='/__ENV_CONFIG__.js' />
        <Providers>
          <Polyfills />
          <Contexts />
          {children}
        </Providers>
      </body>
    </html>
  )
}
