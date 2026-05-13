export const config = {
  port: process.env.PORT || 3001,
  anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
  resendApiKey: process.env.RESEND_API_KEY || '',
  frontendUrl: process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000',
  nodeEnv: process.env.NODE_ENV || 'development',
}
