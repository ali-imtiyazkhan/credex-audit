import Anthropic from '@anthropic-ai/sdk'
import { AuditResult } from '@repo/types'
import { config } from '../config'

const client = new Anthropic({ apiKey: config.anthropicApiKey })

export async function generateSummary(
  results: AuditResult
): Promise<string> {
  const { totalMonthlySavings, totalAnnualSavings, tools, useCase, teamSize } = results

  const toolsList = tools
    .map(t => `${t.toolName} (${t.currentPlan}): $${t.currentSpend}/mo → ${t.recommendedAction}`)
    .join('\n')

  const prompt = `You are a financial advisor specializing in SaaS and AI tool spend optimization.

A ${teamSize}-person team primarily using AI for ${useCase} work submitted this audit:

Tools:
${toolsList}

Total monthly savings identified: $${totalMonthlySavings}
Total annual savings: $${totalAnnualSavings}

Write a personalized 80-100 word summary paragraph for this team. Be specific, direct, and encouraging. 
Mention their use case, the biggest savings opportunity, and one concrete next step.
Do not use bullet points. Write in second person ("Your team...").
Do not mention Credex. Keep it factual and helpful.`

  try {
    const message = await client.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 250,
      messages: [{ role: 'user', content: prompt }],
    })

    const content = message.content[0]
    if (content.type === 'text') return content.text

    return fallbackSummary(results)
  } catch (error) {
    console.error('Anthropic API error:', error)
    return fallbackSummary(results)
  }
}

// fallback if API fails or key is missing
function fallbackSummary(results: AuditResult): string {
  const { totalMonthlySavings, totalAnnualSavings, isAlreadyOptimal, useCase, teamSize } = results

  if (isAlreadyOptimal) {
    return `Your ${teamSize}-person team is already spending efficiently on AI tools for ${useCase} work. All your current plans are well-matched to your team size and use case. Keep an eye on usage as your team grows — plan requirements change quickly in fast-growing teams.`
  }

  const topSaving = [...results.tools].sort(
    (a, b) => b.monthlySavings - a.monthlySavings
  )[0]

  return `Your ${teamSize}-person ${useCase} team could save $${totalMonthlySavings}/month ($${totalAnnualSavings}/year) by optimizing your AI tool stack. The biggest opportunity is with ${topSaving.toolName} — ${topSaving.reason} Start there for the fastest impact on your monthly spend.`
}
