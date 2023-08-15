import { Box } from '@mui/material'
import Image from 'next/image'

export function UserTestLayout({
  title,
  children,
}: {
  title: string
  children: React.ReactNode | React.ReactNode[]
}) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        overflowY: 'auto',
        mt: '24px',
        height: '700px',
        borderRadius: '6px',
        backgroundColor: '#3E41438C',
        backdropFilter: 'blur(4px)',
        fontFamily: '"times new roman"',
      }}
    >
      {/* header */}
      <Box
        sx={{
          height: '72px',
          flex: '0 0 72px',
          backgroundColor: '#E5E5EA',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '24px',
          fontWeight: 'bold',
        }}
      >
        <Image
          src='/static/unicorn.svg'
          width={30}
          height={30}
          alt=''
          className='mr-1'
        />
        {title}
      </Box>
      {/* content */}
      {children}
    </Box>
  )
}
