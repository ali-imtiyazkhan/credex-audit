export const PRICING = {
  cursor: {
    hobby: { price: 0, perSeat: false, name: 'Hobby' },
    pro: { price: 20, perSeat: true, name: 'Pro' },
    business: { price: 40, perSeat: true, name: 'Business' },
    enterprise: { price: 100, perSeat: true, name: 'Enterprise' },
  },
  'github-copilot': {
    individual: { price: 10, perSeat: true, name: 'Individual' },
    business: { price: 19, perSeat: true, name: 'Business' },
    enterprise: { price: 39, perSeat: true, name: 'Enterprise' },
  },
  claude: {
    free: { price: 0, perSeat: false, name: 'Free' },
    pro: { price: 20, perSeat: true, name: 'Pro' },
    max: { price: 100, perSeat: true, name: 'Max' },
    team: { price: 30, perSeat: true, name: 'Team' },
    enterprise: { price: 60, perSeat: true, name: 'Enterprise' },
  },
  chatgpt: {
    free: { price: 0, perSeat: false, name: 'Free' },
    plus: { price: 20, perSeat: true, name: 'Plus' },
    team: { price: 30, perSeat: true, name: 'Team' },
    enterprise: { price: 60, perSeat: true, name: 'Enterprise' },
  },
  'anthropic-api': {
    direct: { price: 0, perSeat: false, name: 'API Direct' },
  },
  'openai-api': {
    direct: { price: 0, perSeat: false, name: 'API Direct' },
  },
  gemini: {
    free: { price: 0, perSeat: false, name: 'Free' },
    pro: { price: 20, perSeat: true, name: 'Pro' },
    ultra: { price: 30, perSeat: true, name: 'Ultra' },
  },
  windsurf: {
    free: { price: 0, perSeat: false, name: 'Free' },
    pro: { price: 15, perSeat: true, name: 'Pro' },
    team: { price: 30, perSeat: true, name: 'Team' },
  },
} as const
