import { users } from '@/app/components/MessageItem'

import { Avatar, Box } from '@mui/material'

export function Step3() {
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
            Hi! Welcome back! Now I have selected a project to recommend to you
            according to your characteristics, hope you will like it!
          </Box>
          <Box sx={{ pb: '1em' }}>Sound.xyz</Box>
          <Box>
            Sound.xyz is a pioneering decentralized music platform backed up by
            a16z that operates on the Ethereum blockchain, offering a
            revolutionary approach to the music industry. The platform empowers
            artists by giving them greater control over their music and
            financial earnings through the utilization of blockchain technology.
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
