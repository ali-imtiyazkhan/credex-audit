import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { prisma } from '@repo/database'
import { runAudit } from '@repo/audit-engine'
import { generateSummary } from '../services/anthropic'
import { rateLimitMiddleware } from '../middleware/rateLimit'

const router = Router()

const AuditInputSchema = z.object({
  tools: z.array(z.object({
    toolName: z.enum([
      'cursor', 'github-copilot', 'claude', 'chatgpt',
      'anthropic-api', 'openai-api', 'gemini', 'windsurf'
    ]),
    plan: z.string(),
    monthlySpend: z.number().min(0),
    seats: z.number().min(1),
  })).min(1).max(8),
  teamSize: z.number().min(1),
  useCase: z.enum(['coding', 'writing', 'data', 'research', 'mixed']),
})


router.post('/', rateLimitMiddleware, async (req: Request, res: Response) => {
  try {
    const parsed = AuditInputSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Invalid input',
        details: parsed.error.flatten(),
      })
    }

    const input = parsed.data
    const results = runAudit(input)
    const summary = await generateSummary(results)

    const audit = await prisma.audit.create({
      data: {
        tools: input.tools as any,
        results: results as any,
        totalSaving: results.totalMonthlySavings,
        annualSaving: results.totalAnnualSavings,
        teamSize: input.teamSize,
        useCase: input.useCase,
        summary,
      },
    })

    return res.status(201).json({
      publicId: audit.publicId,
      id: audit.id,
      results,
      summary,
    })
  } catch (error) {
    console.error('Audit error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})


router.get('/:publicId', async (req: Request, res: Response) => {
  try {
    const audit = await prisma.audit.findUnique({
      where: { publicId: req.params.publicId as string },
    })

    if (!audit) {
      return res.status(404).json({ error: 'Audit not found' })
    }

    return res.json({
      id: audit.id,
      publicId: audit.publicId,
      results: audit.results,
      summary: audit.summary,
      totalSaving: audit.totalSaving,
      annualSaving: audit.annualSaving,
      useCase: audit.useCase,
      teamSize: audit.teamSize,
      createdAt: audit.createdAt,
    })
  } catch (error) {
    console.error('Fetch audit error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
