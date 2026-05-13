import { Request, Response, NextFunction } from 'express'
import { prisma } from '@repo/database'

export async function rateLimitMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const ip =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
    req.socket.remoteAddress ||
    'unknown'

  const endpoint = req.path
  const maxRequests = 10
  const windowMs = 60 * 60 * 1000 // 1 hour

  try {
    const now = new Date()
    const resetAt = new Date(now.getTime() + windowMs)

    // Using composite unique key defined in prisma schema
    const record = await prisma.rateLimit.findUnique({
      where: { ip_endpoint: { ip, endpoint } },
    })

    if (!record) {
      await prisma.rateLimit.create({
        data: { ip, endpoint, count: 1, resetAt },
      })
      return next()
    }

    // reset window if expired
    if (record.resetAt < now) {
      await prisma.rateLimit.update({
        where: { ip_endpoint: { ip, endpoint } },
        data: { count: 1, resetAt },
      })
      return next()
    }

    // block if over limit
    if (record.count >= maxRequests) {
      return res.status(429).json({
        error: 'Too many requests. Please try again later.',
      })
    }

    // increment count
    await prisma.rateLimit.update({
      where: { ip_endpoint: { ip, endpoint } },
      data: { count: record.count + 1 },
    })

    next()
  } catch (error) {
    console.error('Rate limit error:', error)
    // don't block user if rate limit check fails due to DB issue
    next()
  }
}
