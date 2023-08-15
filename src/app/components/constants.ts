export type Color = [number, number, number]

export type ColorName = 'green' | 'red' | 'yellow'

export const colors: Record<ColorName, { feColor: Color; bgColor: Color }> = {
  green: {
    feColor: [0, 127, 0],
    bgColor: [205, 255, 205],
  },
  red: { feColor: [211, 0, 0], bgColor: [255, 224, 224] },
  yellow: {
    feColor: [206, 133, 0],
    bgColor: [255, 236, 204],
  },
}

export type UserName = 'user' | 'host'

export interface User {
  name: UserName
  avatar: string
}

export interface Message {
  user: User
  id: string
  lang: 'zh' | 'en'
  message:
    | {
        type: 'text'
        content: string
      }
    | {
        type: 'question'
        /**
         * 问题的序号
         */
        content: number
      }
  footer?: React.ReactNode | React.ReactNode[]
}

export const OPENAI_API_KEY =
  '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'

export interface Tag {
  color: ColorName
  content: string
}

export interface UserData {
  wallet: string
  claimDate: Date
  email: string
  tags: Tag[]
}
