'use client'

import { SvgHomeDescTitle } from '@/svg'

import { Box } from '@mui/material'

export function HomeDesc() {
  return (
    <Box
      sx={{
        color: 'white',
        pt: '220px',
      }}
    >
      <SvgHomeDescTitle className='w-[1067px] h-[130px] m-auto' />
      <Box
        sx={{
          width: '723px',
          fontWeight: '400',
          letterSpacing: '1px',
          m: 'auto',
          textAlign: 'center',
          fontSize: '22px',
        }}
      >
        Our platform can help Web3 applications find their target users to
        achieve rapid launch, and provides an artificial intelligence-based user
        tag system.
      </Box>
    </Box>
  )
}
