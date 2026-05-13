import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { prisma } from '@repo/database'
import { sendAuditEmail } from '../services/email'
import { rateLimitMiddleware } from '../middleware/rateLimit'

const router = Router()

const LeadSchema = z.object({
  email: z.string().email(),
  company: z.string().optional(),
  role: z.string().optional(),
  auditId: z.string(),
  website: z.string().max(0, 'Bot detected').optional(),
})

router.post('/', rateLimitMiddleware, async (req: Request, res: Response) => {
  try {
    const parsed = LeadSchema.safeParse(req.body)
    if (!parsed.success) {
      if (parsed.error.flatten().fieldErrors.website) {
        return res.status(200).json({ ok: true })
      }
      return res.status(400).json({
        error: 'Invalid input',
        details: parsed.error.flatten(),
      })
    }

    const { email, company, role, auditId } = parsed.data

    const audit = await prisma.audit.findUnique({
      where: { id: auditId  },
    })

    if (!audit) {
      return res.status(404).json({ error: 'Audit not found' })
    }

    const isHighValue = audit.totalSaving > 500

    const existing = await prisma.lead.findUnique({
      where: { auditId },
    })

    if (existing) {
      return res.status(200).json({ ok: true, message: 'Already submitted' })
    }

    await prisma.lead.create({
      data: {
        email,
        companyName: company || null,
        role: role || null,
        auditId,
        isHighValue,
      },
    })

    await sendAuditEmail(
      email,
      audit.publicId,
      audit.totalSaving,
      isHighValue
    )

    return res.status(201).json({ ok: true })
  } catch (error) {
    console.error('Lead error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
