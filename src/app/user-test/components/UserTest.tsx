'use client'

import { UserTestLayout } from './UserTestLayout'
import { Step1 } from './Step1'
import { Step3 } from './Step3'

import {
  MessageItem,
  chatToString,
  getMBTIIndex,
  gptTip,
  guide,
  questions,
  users,
} from '@/app/components/MessageItem'
import { ClaimRewards } from '@/app/user-test/components/ClaimRewards'
import {
  OPENAI_API_KEY,
  type Message,
  type Tag,
} from '@/app/components/constants'
import { decodeTagArray } from '@/app/components/TagItem'
import { getWalletStatus } from '@/web3/utils/getWalletStatus'
import { SvgLoading, SvgSubmit } from '@/svg'
import { useListen } from '@/hooks/useListen'
import { useLoading } from '@/hooks/useLoading'

import { Box, Button, ButtonBase, InputBase, Stack } from '@mui/material'
import { useMemo, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'

import type { FormEvent } from 'react'

export function UserTest() {
  const [step, setStep] = useState(1)
  const [selectedLang, setSelectedLang] = useState<'en' | 'zh'>('en')
  const [inputText, setInputText] = useState('')
  const [messageList, setMessageList] = useState<Omit<Message, 'lang'>[]>([])
  const curQuestionIdxRef = useRef(-1)
  const contentBottomRef = useRef<HTMLDivElement>(null)
  const availableMessageList = useMemo(() => {
    const firstSystemQuestionIdx = messageList.findIndex(
      ({ user }) => user.name === 'host'
    )
    if (firstSystemQuestionIdx < 0) {
      return []
    }
    return messageList.slice(firstSystemQuestionIdx)
  }, [messageList])
  const isChatFinished = availableMessageList.length >= questions.en.length * 2
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, withLoading] = useLoading()

  const askNext = () => {
    if (curQuestionIdxRef.current >= questions.en.length - 1) {
      // 问题够了
      return
    }
    curQuestionIdxRef.current += 1
    setMessageList((prev) => [
      ...prev,
      {
        id: `host-question-${curQuestionIdxRef.current}`,
        user: users.host,
        message: {
          type: 'question',
          content: curQuestionIdxRef.current,
        },
      },
    ])
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!inputText) {
      return
    }
    if (isChatFinished) {
      toast.error('Waiting for chatgpt responding...')
      return
    }
    setMessageList((prev) => {
      const lastMessage = prev[prev.length - 1]
      if (lastMessage?.user.name === 'user') {
        window.setTimeout(() => {
          toast.error('Waiting for system responding...')
        }, 0)
        return prev
      }
      return [
        ...prev,
        {
          id: `user-response-${Date.now()}`,
          user: users.user,
          message: {
            type: 'text',
            content: inputText.trim(),
          },
        },
      ]
    })
    setInputText('')
    askNext()
  }

  // 滚动到聊天的底部
  useListen(messageList.length, () => {
    contentBottomRef.current?.scrollIntoView({
      behavior: 'smooth',
    })
  })

  // 监听聊天是否完毕
  useListen(
    isChatFinished,
    withLoading(async () => {
      if (!isChatFinished) {
        return
      }
      const headers = new Headers()
      headers.set('content-type', 'application/json')
      headers.set('Authorization', `Bearer ${OPENAI_API_KEY}`)
      try {
        const walletStatus = await getWalletStatus()
        const fetchRes = await fetch(
          'https://api.openai.com/v1/chat/completions',
          {
            method: 'post',
            headers,
            body: JSON.stringify({
              model: 'gpt-4',
              messages: [
                {
                  role: 'system',
                  content: gptTip[selectedLang],
                },
                {
                  role: 'user',
                  content: chatToString(availableMessageList, selectedLang),
                },
              ],
            }),
          }
        )
        const res = await fetchRes.json()
        /**
         * {
         *   "id": "chatcmpl-123",
         *   "object": "chat.completion",
         *   "created": 1677652288,
         *   "choices": [{
         *     "index": 0,
         *     "message": {
         *       "role": "assistant",
         *       "content": "ISTP",
         *     },
         *     "finish_reason": "stop"
         *   }],
         *   "usage": {
         *     "prompt_tokens": 9,
         *     "completion_tokens": 12,
         *     "total_tokens": 21
         *   }
         * }
         */

        const gptMessage: string = res?.choices[0]?.message?.content ?? ''
        setTags(
          decodeTagArray([
            walletStatus.isRich ? 1 : 0,
            walletStatus.isActive ? 1 : 0,
            getMBTIIndex(gptMessage),
          ])
        )
      } catch (error) {
        toast.error('Network error')
      }
    })
  )

  const firstTip = (
    <MessageItem
      user={users.host}
      id='guide'
      lang={selectedLang}
      message={{
        type: 'text',
        content: guide[selectedLang],
      }}
      footer={
        <Stack spacing={4} direction='row' sx={{ mt: 2 }}>
          <Button
            variant={selectedLang === 'en' ? 'contained' : 'outlined'}
            onClick={() => {
              setSelectedLang('en')
              if (messageList.length === 0) {
                askNext()
              }
            }}
          >
            English
          </Button>
          <Button
            variant={selectedLang === 'zh' ? 'contained' : 'outlined'}
            onClick={() => {
              setSelectedLang('zh')
              if (messageList.length === 0) {
                askNext()
              }
            }}
          >
            简体中文
          </Button>
        </Stack>
      }
    />
  )

  if (step === 1) {
    return (
      <UserTestLayout title='Navi.AI'>
        <Step1 onFinish={() => setStep(2)} />
      </UserTestLayout>
    )
  }

  if (step === 3) {
    return (
      <UserTestLayout title='Navi.AI'>
        <Step3 />
      </UserTestLayout>
    )
  }

  if (tags.length > 0) {
    return <ClaimRewards tags={tags} onFinish={() => setStep(3)} />
  }

  return (
    <UserTestLayout title='User Test'>
      {/* 对话 */}
      <Box
        sx={{
          flex: '1 1 auto',
          p: '36px',
          overflow: 'auto',
        }}
      >
        {firstTip}
        {messageList.map((item) => (
          <MessageItem key={item.id} lang={selectedLang} {...item} />
        ))}
        <Box ref={contentBottomRef} />
      </Box>
      {/* footer (input) */}
      <Box
        component='form'
        onSubmit={onSubmit}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#E5E5EA',
        }}
      >
        <InputBase
          value={inputText}
          disabled={isChatFinished}
          onChange={(e) => {
            setInputText(e.target.value ?? '')
          }}
          placeholder='Start typing...'
          sx={{
            flex: '1 1 auto',
            height: '56px',
            py: '12px',
            px: '24px',
          }}
        />
        <ButtonBase
          type='submit'
          disabled={!inputText || isChatFinished}
          sx={{
            mr: '24px',
            p: '8px',
            color: 'primary.main',
            ':disabled': {
              color: '#8E8E93',
            },
          }}
        >
          {loading ? (
            <SvgLoading
              className='fill-current animate-spin'
              width='42'
              height='36'
            />
          ) : (
            <SvgSubmit className='fill-current' width='42' height='36' />
          )}
        </ButtonBase>
      </Box>
    </UserTestLayout>
  )
}
