import { Avatar, Box } from '@mui/material'

import type { UserName, Message } from './constants'

export const users: Record<
  UserName,
  {
    name: UserName
    avatar: string
  }
> = {
  host: {
    name: 'host',
    avatar: '/static/avatar-host.png',
  },
  user: {
    name: 'user',
    avatar: '/static/avatar-user.png',
  },
}

export const guide = {
  en: `Welcome to Navistar! I'm Navi, here to help you navigate your way in Navistar. We're thrilled to have you join us!  Please choose your language first.`,
  zh: '在开启Navistar旅途之前，先来玩一下我们的性格小测试吧！完成后，你可以获取自己的Avatar哦。这样我们就能更了解你，帮助你快速找到你感兴趣的项目和帮你找到与你兴趣相同的朋友。',
}

export const gptTip = {
  en: `I will give you a dialogue, you judge the MBTI personality of the respondent based on the content of the dialogue, your answer is limited to four letters, do not say anything redundant`,
  zh: `我将会给你一段对话，你根据对话的内容判断回答者的 MBTI 性格，你的回答仅限四个字母，不要说任何多余的话`,
}

export const questions = {
  en: [
    'Do you prefer socializing with friends or do you tend to enjoy solitary thinking and exploration?',
    'Imagine you discover a hidden treasure map while exploring an old library. What would be your next steps and how would you approach this exciting adventure?',
    `Imagine you're in a bustling marketplace filled with various stalls and vendors. What would you be most drawn to explore or purchase in this lively setting?`,
    'If you could have any superpower, what would it be and how would you use it?',
    'When making decisions, do you often seek input and opinions from others, or do you trust your own judgment and instincts more?',
  ],
  zh: [
    '你喜欢和朋友社交还是喜欢独处？',
    '想象一下，你在一家旧图书馆里发现了一张古老的藏宝图。你会如何开始这次冒险？',
    '想象你在一个热闹的市场里，里面有各种摊位和商贩。你会最想买什么？',
    '如果你可以拥有一种超能力，你会希望他是什么和会如何使用它？',
    '做决策时，你更偏向征求他人的意见还是更相信自己的判断和直觉？',
  ],
}

export const MBTI_ARRAY = [
  'ISTJ',
  'ISFJ',
  'INFJ',
  'INTJ',
  'ISTP',
  'ISFP',
  'INFP',
  'INTP',
  'ESTJ',
  'ESFJ',
  'ENFJ',
  'ENTJ',
  'ESTP',
  'ESFP',
  'ENFP',
  'ENTP',
  'CHAOS',
]

export function getMBTIIndex(s?: string) {
  const tempIndex = MBTI_ARRAY.findIndex((m) => m === s)
  return tempIndex >= 0 ? tempIndex : MBTI_ARRAY.length - 1
}

export function getMBTIStr(i: number) {
  return MBTI_ARRAY[i] ?? MBTI_ARRAY[MBTI_ARRAY.length - 1]
}

export function chatToString(chat: Omit<Message, 'lang'>[], lang: 'zh' | 'en') {
  return chat
    .map((item) => {
      const prefixMap = {
        en: {
          host: 'Q: ',
          user: 'A: ',
        },
        zh: {
          host: '问: ',
          user: '答: ',
        },
      }
      const prefix = prefixMap[lang][item.user.name]
      const content =
        item.message.type === 'text'
          ? item.message.content
          : questions[lang][item.message.content]
      return `${prefix}${content}`
    })
    .join('\n')
}

export function MessageItem({ user, message, footer, lang }: Message) {
  const isMySelf = user.name === 'user'
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isMySelf ? 'flex-end' : 'flex-start',
        letterSpacing: '1px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: isMySelf ? 'row-reverse' : 'row',
          justifyContent: isMySelf ? 'flex-end' : 'flex-start',
          alignItems: 'flex-start',
          pt: '24px',
        }}
      >
        <Avatar
          src={user.avatar}
          sx={{
            transform: 'translateY(-50%)',
          }}
        />
        <Box
          sx={{
            flex: '0 0 12px',
            height: '24px',
          }}
        />
        {/* TODO: 长英文换行 */}
        <Box
          sx={{
            minWidth: '180px',
            maxWidth: '360px',
            p: '12px',
            borderRadius: '4px',
            backgroundColor: isMySelf ? 'primary.main' : '#FAFAFC',
            boxShadow: isMySelf ? '0 0 6px #3d3d3d' : '0 0 6px #3d3d3d',
            color: isMySelf ? 'white' : '#2C2C2E',
          }}
        >
          {message.type === 'text'
            ? message.content
            : questions[lang][message.content]}
          {footer}
        </Box>
      </Box>
    </Box>
  )
}
