import { Resend } from 'resend'
import { config } from '../config'

const resend = new Resend(config.resendApiKey)

export async function sendAuditEmail(
  email: string,
  publicId: string,
  monthlySavings: number,
  isHighValue: boolean
): Promise<void> {
  const auditUrl = `${config.frontendUrl}/results/${publicId}`

  try {
    await resend.emails.send({
      from: 'SpendSmart AI <audit@yourdomain.com>',
      to: email,
      subject: monthlySavings > 0
        ? `Your audit: $${monthlySavings}/mo in potential savings found`
        : 'Your AI spend audit is ready',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h1 style="color: #1e293b; font-size: 24px; margin-bottom: 8px;">
            Your AI Spend Audit
          </h1>

          ${monthlySavings > 0 ? `
            <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 12px; padding: 20px; margin: 20px 0;">
              <p style="color: #166534; font-size: 32px; font-weight: bold; margin: 0;">
                $${monthlySavings}/mo
              </p>
              <p style="color: #166534; margin: 4px 0 0;">
                in potential monthly savings identified
              </p>
            </div>
          ` : `
            <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 12px; padding: 20px; margin: 20px 0;">
              <p style="color: #166534; font-size: 18px; font-weight: bold; margin: 0;">
                ✅ You're already spending optimally!
              </p>
            </div>
          `}

          <a href="${auditUrl}"
            style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 16px 0;">
            View Full Audit →
          </a>

          ${isHighValue ? `
            <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 20px; margin: 20px 0;">
              <p style="color: #1e40af; font-weight: 600; margin: 0 0 8px;">
                💡 Save even more with Credex
              </p>
              <p style="color: #3b82f6; margin: 0; font-size: 14px;">
                Credex sells discounted AI credits — Cursor, Claude, ChatGPT Enterprise and more. 
                Our team will reach out to show you how much more you could save.
              </p>
            </div>
          ` : ''}

          <p style="color: #94a3b8; font-size: 12px; margin-top: 32px;">
            You received this because you ran an audit at SpendSmart AI.
          </p>
        </div>
      `,
    })
  } catch (error) {
    console.error('Email send error:', error)
  }
}
