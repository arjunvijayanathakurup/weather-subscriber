// declaring interface and types for environment variables for typescript
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_NOMINATEIM_URL: string
      NEXT_PUBLIC_OPENWEATHER_URL: string
      NEXT_PUBLIC_OPENWEATHER_API_KEY: string
      NEXT_NODE_ENV: 'development' | 'production'
    }
  }
}
export {}
