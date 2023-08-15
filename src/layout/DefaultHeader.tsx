'use client'

import { useLoading } from '@/hooks/useLoading'
import { getWalletAddress } from '@/web3/utils/getWalletStatus'
import { cat } from '@/errors/catchAndToast'

import { Box, Button, useTheme } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import Link from 'next/link'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export function DefaultHeader() {
  const theme = useTheme()
  const router = useRouter()
  const [connectLoading, withConnectLoading] = useLoading()
  const [userTestLoading, withUserTestLoading] = useLoading()

  return (
    <Box
      sx={{
        boxShadow: 'none',
        zIndex: theme.zIndex.appBar,
        height: '126px',
        backgroundColor: 'black',
        color: 'white',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignContent: 'center',
          height: '100%',
          width: '100%',
          maxWidth: '1400px',
          m: 'auto',
          px: 1,
          alignItems: 'center',
        }}
      >
        <Button
          LinkComponent={Link}
          href='/home'
          sx={{
            fontWeight: 'bold',
            fontSize: '36px',
            color: 'inherit',
            ':hover': {
              opacity: 0.8,
            },
          }}
        >
          Navistar
        </Button>
        <Box
          sx={{
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <LoadingButton
            loading={userTestLoading}
            sx={{
              fontWeight: 'bold',
              fontSize: '24px',
              color: 'inherit',
              '& .MuiLoadingButton-loadingIndicator': {
                color: 'white',
              },
              ':hover': {
                opacity: 0.8,
              },
            }}
            onClick={cat(
              withUserTestLoading(async () => {
                await getWalletAddress()
                router.push('/user-test')
              })
            )}
          >
            Navi.AI
          </LoadingButton>
          <Button
            LinkComponent={Link}
            href='/backstage'
            sx={{
              ml: '118px',
              fontWeight: 'bold',
              fontSize: '24px',
              color: 'inherit',
              ':hover': {
                opacity: 0.8,
              },
            }}
          >
            Backstage
          </Button>
        </Box>
        <LoadingButton
          loading={connectLoading}
          sx={{
            fontWeight: 'bold',
            fontSize: '24px',
            color: 'inherit',
            '& .MuiLoadingButton-loadingIndicator': {
              color: 'white',
            },
            ':hover': {
              opacity: 0.8,
            },
          }}
          onClick={cat(
            withConnectLoading(async () => {
              await getWalletAddress()
              toast.success('Wallet connected.')
            })
          )}
        >
          Connect Wallet
        </LoadingButton>
      </Box>
    </Box>
  )
}
