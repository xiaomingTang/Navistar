export type Func<Args extends unknown[], Ret> = (...args: Args) => Ret

export interface PlainError {
  code: number
  message: string
}

export type ServerResponse<T> =
  | {
      data: T
      error: undefined
    }
  | {
      data: undefined
      error: PlainError
    }

interface Web3Error extends Error {
  info: {
    error:
      | string
      | {
          code: number
          message: string
        }
  }
}

function isWeb3Error(err: unknown): err is Web3Error {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return !!(err as any)?.info?.error
}

export function toError(err: unknown): Error {
  if (isWeb3Error(err)) {
    const web3Error = err.info.error
    if (typeof web3Error === 'string') {
      return new Error(web3Error)
    }
    const finalWeb3Error = new Error(web3Error.message ?? 'Unknown web3 error')
    if (web3Error.code) {
      finalWeb3Error.code = web3Error.code
    }
    return finalWeb3Error
  }
  if (err instanceof Error) {
    return err
  }
  const message =
    (err as PlainError)?.message ??
    (err as PlainError)?.toString() ??
    'Unknown error'
  const retError = new Error(message)
  retError.code = (err as PlainError)?.code ?? 500
  return retError
}
