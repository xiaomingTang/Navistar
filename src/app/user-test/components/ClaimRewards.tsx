import { TagItem } from '@/app/components/TagItem'
import {
  claimDID,
  getWalletAddress,
  getWalletStatus,
} from '@/web3/utils/getWalletStatus'
import { cat } from '@/errors/catchAndToast'
import { useLoading } from '@/hooks/useLoading'
import { SvgLoading } from '@/svg'
import { formatWallet } from '@/web3/utils/formatWallet'

import { Orbitron } from 'next/font/google'
import { Box, Stack } from '@mui/material'
import Image from 'next/image'
import useSWR from 'swr'

import type { Tag } from '@/app/components/constants'

const orbitron = Orbitron({
  weight: '700',
  display: 'swap',
  subsets: ['latin'],
})

export function ClaimRewards({
  tags,
  onFinish,
}: {
  tags: Tag[]
  onFinish: () => void
}) {
  const [loading, withLoading] = useLoading()
  const { data: wallet } = useSWR('getWalletAddress', cat(getWalletAddress))
  return (
    <Box
      sx={{
        display: 'flex',
        m: 'auto',
        width: 'min-content',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        px: '36px',
        pt: '54px',
        pb: '48px',
        color: 'white',
        backgroundImage: `url("/static/rewards-bg.jpg")`,
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
        fontFamily: '"times new roman"',
      }}
    >
      <Image src='/static/doll.png' width={194} height={360} alt='avatar' />
      <Box
        sx={{
          py: '32px',
        }}
        className={orbitron.className}
      >
        {wallet ? formatWallet(wallet) : 'UNKNOWN WALLET ADDRESS'}
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          px: '24px',
          pt: '48px',
          pb: '24px',
          backgroundImage: `url("/static/claim-bg.jpg")`,
          backgroundSize: '100% 100%',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <Stack
          direction='row'
          spacing='12px'
          sx={{
            justifyContent: 'center',
          }}
        >
          {tags.map((tag) => (
            <TagItem key={tag.content} {...tag} />
          ))}
        </Stack>
        <Box
          className={orbitron.className}
          sx={{
            mt: '36px',
            width: '248px',
            height: '56px',
            lineHeight: '56px',
            fontSize: '18px',
            textAlign: 'center',
            backgroundImage: `url("/static/claim-btn.svg")`,
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
            transition: 'all .3s',
            cursor: 'pointer',
            userSelect: 'none',
            ':hover': {
              transform: 'scale(1.02)',
            },
            ':active': {
              transform: 'scale(1)',
            },
          }}
          onClick={withLoading(
            cat(async () => {
              if (loading) {
                return
              }
              await claimDID(tags, await getWalletStatus())
              onFinish()
            })
          )}
        >
          {loading ? (
            <SvgLoading className='inline-block animate-spin text-[18px]' />
          ) : (
            'Claim'
          )}
        </Box>
      </Box>
    </Box>
  )
}
