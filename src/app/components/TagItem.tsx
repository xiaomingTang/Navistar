import { colors } from './constants'
import { getMBTIIndex, getMBTIStr } from './MessageItem'

import { Box, Typography } from '@mui/material'

import type { Tag } from './constants'

export function decodeTagArray(arr: [number, number, number]): Tag[] {
  const tags: Tag[] = []
  if (arr[0] === 1) {
    tags.push({
      color: 'green',
      content: 'Rich',
    })
  }
  if (arr[1] === 1) {
    tags.push({
      color: 'red',
      content: 'Active',
    })
  }
  tags.push({
    color: 'yellow',
    content: getMBTIStr(arr[2]),
  })
  return tags
}

export function encodeTagArray(tags: Tag[]): [number, number, number] {
  return [
    tags[0]?.content === 'Rich' ? 1 : 0,
    tags[0]?.content === 'Active' || tags[1]?.content === 'Active' ? 1 : 0,
    getMBTIIndex(tags[tags.length - 1]?.content ?? ''),
  ]
}

export function TagItem(tag: Tag) {
  return (
    <Box
      key={tag.content}
      sx={{
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        fontSize: '20px',
        height: '36px',
        px: '12px',
        borderRadius: '4px',
        backgroundColor: `rgb(${colors[tag.color].bgColor.join(',')})`,
        color: `rgb(${colors[tag.color].feColor.join(',')})`,
      }}
    >
      <Box
        sx={{
          width: '10px',
          height: '10px',
          flex: '0 0 10px',
          borderRadius: '99px',
          mr: '4px',
          backgroundColor: `rgb(${colors[tag.color].feColor.join(',')})`,
        }}
      />
      <Typography noWrap>{tag.content}</Typography>
    </Box>
  )
}
