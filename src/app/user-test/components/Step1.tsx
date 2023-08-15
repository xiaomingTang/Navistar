import { users } from '@/app/components/MessageItem'
import { useLoading } from '@/hooks/useLoading'
import { SvgLoading } from '@/svg'
import { sleepMs } from '@/utils/time'

import { Avatar, Box, Button } from '@mui/material'
import Image from 'next/image'
import { useState } from 'react'

export function Step1({ onFinish }: { onFinish: () => void }) {
  const [isRec, setIsRec] = useState(false)
  const [loading, withLoading] = useLoading()

  if (isRec) {
    return (
      <Box
        sx={{
          flex: '1 1 auto',
          overflow: 'auto',
          px: '36px',
          py: '56px',
          fontSize: '34px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}
        >
          <Avatar
            src={users.host.avatar}
            sx={{
              width: '56px',
              height: '56px',
              transform: 'translateY(-50%)',
            }}
          />
          <Box
            sx={{
              p: '24px',
              ml: '12px',
              borderRadius: '16px',
              color: 'white',
              backgroundColor: 'rgba(255,255,255,.1)',
            }}
          >
            <Box sx={{ pb: '1em' }}>
              {`Let me introduce to you the highly popular "friend.tech" that's been making waves in the past few days!`}
            </Box>
            <Box sx={{ pb: '1em' }}>
              {`Since August 11th, the entire crypto community seems to be flooded with invitations from "friend.tech."`}
            </Box>
            <Box sx={{ pb: '1em' }}>{`So, what exactly is "friend.tech"?`}</Box>
            <Box
              sx={{ pb: '1em' }}
            >{`In fact, "friend.tech" is a decentralized social platform that is closely integrated with Twitter (now known as X). By purchasing shares (Share) of any user on "friend.tech" using ETH from the Base chain, you can gain the right to have direct conversations with them and even potentially earn from it.`}</Box>
            <Box sx={{ pb: '1em' }}>{`How to use "friend.tech"?`}</Box>
            <Box sx={{ pb: '1em' }}>
              <Image
                src='/static/steps.png'
                width={1698}
                height={1268}
                alt='to use "friend.tech"?'
              />
            </Box>
            <Box>
              Click{' '}
              <a
                style={{
                  color: 'inherit',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
                onClick={onFinish}
              >
                HERE
              </a>{' '}
              to claim your DID so that we can provide you with better service!
            </Box>
          </Box>
        </Box>
      </Box>
    )
  }

  return (
    <Box sx={{ p: '56px', flex: '1 1 auto', overflow: 'auto' }}>
      <Box
        sx={{
          px: '24px',
          py: '36px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '16px',
          color: 'white',
          backgroundColor: 'rgba(255,255,255,.1)',
        }}
      >
        <Avatar
          src={users.host.avatar}
          sx={{ width: '90px', height: '90px' }}
        />
        <Box sx={{ my: '36px', fontSize: '32px', textAlign: 'center' }}>
          Hi! I’m Navistar, sharing reliable project information with you, you
          can try these options:
        </Box>
        <Button
          variant='contained'
          sx={{
            width: '740px',
            height: '70px',
            fontSize: '28px',
            mb: '40px',
            fontWeight: 'bold',
            color: 'black',
            background: 'linear-gradient(180deg, #D1D3E2 0%, #75629D 100%)',
          }}
          disabled={loading}
          onClick={withLoading(async () => {
            await sleepMs(Math.random() * 1000 + 1000)
            setIsRec(true)
          })}
        >
          {loading ? (
            <SvgLoading className='inline-block animate-spin text-[28px]' />
          ) : (
            'Recommend me some recent hottest project information'
          )}
        </Button>
        <Button
          variant='contained'
          sx={{
            width: '740px',
            height: '70px',
            fontSize: '28px',
            fontWeight: 'bold',
            color: 'black',
            background: 'linear-gradient(180deg, #D1D3E2 0%, #75629D 100%)',
          }}
          onClick={onFinish}
        >
          Take the AI test and get my DID
        </Button>
      </Box>
    </Box>
  )
}
