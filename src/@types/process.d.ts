declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: string
    NEXT_PUBLIC_APP_ENV: AppEnv
    NEXT_PUBLIC_ORIGIN: string
  }
}
