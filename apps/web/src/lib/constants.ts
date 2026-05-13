import { ToolName, UseCase } from '@repo/types'

export const TOOLS: { value: ToolName; label: string }[] = [
  { value: 'cursor', label: 'Cursor' },
  { value: 'github-copilot', label: 'GitHub Copilot' },
  { value: 'claude', label: 'Claude' },
  { value: 'chatgpt', label: 'ChatGPT' },
  { value: 'anthropic-api', label: 'Anthropic API' },
  { value: 'openai-api', label: 'OpenAI API' },
  { value: 'gemini', label: 'Gemini' },
  { value: 'windsurf', label: 'Windsurf' },
]

export const PLANS: Record<ToolName, { value: string; label: string }[]> = {
  cursor: [
    { value: 'hobby', label: 'Hobby (Free)' },
    { value: 'pro', label: 'Pro ($20/user)' },
    { value: 'business', label: 'Business ($40/user)' },
    { value: 'enterprise', label: 'Enterprise' },
  ],
  'github-copilot': [
    { value: 'individual', label: 'Individual ($10/user)' },
    { value: 'business', label: 'Business ($19/user)' },
    { value: 'enterprise', label: 'Enterprise ($39/user)' },
  ],
  claude: [
    { value: 'free', label: 'Free' },
    { value: 'pro', label: 'Pro ($20/user)' },
    { value: 'max', label: 'Max ($100/user)' },
    { value: 'team', label: 'Team ($30/user)' },
    { value: 'enterprise', label: 'Enterprise' },
  ],
  chatgpt: [
    { value: 'free', label: 'Free' },
    { value: 'plus', label: 'Plus ($20/user)' },
    { value: 'team', label: 'Team ($30/user)' },
    { value: 'enterprise', label: 'Enterprise' },
  ],
  'anthropic-api': [
    { value: 'direct', label: 'API Direct' },
  ],
  'openai-api': [
    { value: 'direct', label: 'API Direct' },
  ],
  gemini: [
    { value: 'free', label: 'Free' },
    { value: 'pro', label: 'Pro ($20/user)' },
    { value: 'ultra', label: 'Ultra ($30/user)' },
  ],
  windsurf: [
    { value: 'free', label: 'Free' },
    { value: 'pro', label: 'Pro ($15/user)' },
    { value: 'team', label: 'Team ($30/user)' },
  ],
}

export const USE_CASES: { value: UseCase; label: string }[] = [
  { value: 'coding', label: '💻 Coding' },
  { value: 'writing', label: '✍️ Writing' },
  { value: 'data', label: '📊 Data Analysis' },
  { value: 'research', label: '🔍 Research' },
  { value: 'mixed', label: '🔀 Mixed' },
]
