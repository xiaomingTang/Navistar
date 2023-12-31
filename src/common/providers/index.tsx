'use client'

import EmotionProvider from './EmotionProvider'

import {
  Experimental_CssVarsProvider as ThemeProvider,
  experimental_extendTheme as createTheme,
} from '@mui/material'
import NiceModal from '@ebay/nice-modal-react'
import { SWRConfig } from 'swr'

const muiTheme = createTheme({
  v: {
    screens: {
      desktop: 1100,
    },
  },
  components: {
    MuiButtonBase: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: 'inherit',
          whiteSpace: 'nowrap',
          textTransform: 'none',
        },
      },
    },
    MuiIconButton: {
      defaultProps: {
        color: 'inherit',
      },
      styleOverrides: {
        root: {
          fontSize: 'inherit',
        },
      },
    },
    MuiTooltip: {
      defaultProps: {
        placement: 'bottom-start',
      },
    },
    MuiChip: {
      defaultProps: {
        size: 'small',
        color: 'default',
      },
      styleOverrides: {
        root: {
          fontFamily: 'inherit',
          fontSize: '0.75rem',
        },
      },
    },
    MuiTypography: {
      defaultProps: {
        fontSize: 'inherit',
      },
    },
    MuiSvgIcon: {
      defaultProps: {
        // 这个鬼东西 fontSize 不能 inherit,
        // 它应该需要 1.5em, 但是 mui 不允许设置这个值...
        // fontSize: 'inherit',
        color: 'inherit',
      },
    },
  },
})

export default function Providers({
  children,
}: {
  children: React.ReactNode | React.ReactNode[]
}) {
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
      }}
    >
      <EmotionProvider>
        <ThemeProvider theme={muiTheme}>
          <NiceModal.Provider>{children}</NiceModal.Provider>
        </ThemeProvider>
      </EmotionProvider>
    </SWRConfig>
  )
}
