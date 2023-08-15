'use client'

import { DefaultHeader } from './DefaultHeader'

import { Box } from '@mui/material'

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode | React.ReactNode[]
}) {
  return (
    <>
      <Box
        sx={{
          minWidth: '1500px',
          width: '100%',
          height: '100%',
          overflow: 'auto',
          backgroundColor: 'black',
          backgroundImage: `url("/static/bg.svg")`,
          backgroundSize: '100% auto',
          backgroundPosition: 'bottom',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <DefaultHeader />
        {children}
      </Box>
    </>
  )
}
