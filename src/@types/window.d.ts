import type { Eip1193Provider } from 'ethers'
import type { User } from '@prisma/client'

declare global {
  type AppEnv = 'production' | 'preprod'

  type SimpleUser = Omit<User, 'password' | 'email'> &
    Pick<Partial<User>, 'password' | 'email'>

  interface Document {
    mozFullScreenElement?: Element
    webkitFullscreenElement?: Element
    msFullscreenElement?: Element

    mozFullScreenEnabled?: Document['fullscreenEnabled']
    webkitFullScreenEnabled?: Document['fullscreenEnabled']
    webkitFullscreenEnabled?: Document['fullscreenEnabled']
    msFullscreenEnabled?: Document['fullscreenEnabled']

    mozCancelFullScreen?: Document['exitFullscreen']
    webkitExitFullscreen?: Document['exitFullscreen']
    webkitExitFullScreen?: Document['exitFullscreen']
    msExitFullscreen?: Document['exitFullscreen']
  }

  interface Element {
    mozRequestFullScreen?: Element['requestFullscreen']
    webkitRequestFullscreen?: Element['requestFullscreen']
    webkitRequestFullScreen?: Element['requestFullscreen']
    msRequestFullscreen?: Element['requestFullscreen']
  }

  interface Error {
    cause?: Error
    code?: number
    message: string
  }

  interface Window {
    ethereum?: Eip1193Provider
  }
}

export {}
