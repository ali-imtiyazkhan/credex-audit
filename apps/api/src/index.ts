import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Anthropic from '@anthropic-ai/sdk';
import { Resend } from 'resend';
import { prisma } from '@repo/database';
import { runAudit } from '@repo/audit-engine';
import { AuditInput } from '@repo/types';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const resend = new Resend(process.env.RESEND_API_KEY);

app.use(cors());
app.use(express.json());

// ─── AI Summary Helper ────────────────────────────────────────────────────────

async function generateAISummary(input: AuditInput, results: any) {
  if (!process.env.ANTHROPIC_API_KEY) return null;

  try {
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 300,
      system: "You are a cost-optimization expert for AI software. Analyze the user's spend and give a concise, punchy 2-3 sentence summary of their biggest saving opportunity.",
      messages: [{ 
        role: "user", 
        content: `Audit Data: ${JSON.stringify({ input, results })}` 
      }],
    });
    
    // Extract text safely from content array
    const content = response.content[0];
    return content.type === 'text' ? content.text : null;
  } catch (err) {
    console.error('AI Summary Error:', err);
    return null;
  }
}

// ─── API Routes ───────────────────────────────────────────────────────────────

app.post('/audit', async (req, res) => {
  try {
    const input: AuditInput = req.body;
    const result = runAudit(input);
    
    // Generate AI Summary in parallel (or after)
    const summary = await generateAISummary(input, result);

    const audit = await prisma.audit.create({
      data: {
        tools: input.tools as any,
        results: result as any,
        totalSaving: result.totalMonthlySavings,
        annualSaving: result.totalAnnualSavings,
        teamSize: input.teamSize,
        useCase: input.useCase,
        summary: summary,
      },
    });

    res.json({
      publicId: audit.publicId,
      id: audit.id,
      results: result,
      summary: summary
    });
  } catch (err) {
    res.status(500).json({ error: 'Audit failed' });
  }
});

app.get('/audit/:publicId', async (req, res) => {
  const audit = await prisma.audit.findUnique({
    where: { publicId: req.params.publicId },
  });
  if (!audit) return res.status(404).json({ error: 'Not found' });
  res.json(audit);
});

app.post('/leads', async (req, res) => {
  const { email, company, role, auditId } = req.body;
  
  try {
    const audit = await prisma.audit.findUnique({ where: { id: auditId } });
    if (!audit) return res.status(404).json({ error: 'Audit not found' });

    const lead = await prisma.lead.create({
      data: {
        email,
        companyName: company,
        role,
        isHighValue: audit.totalSaving > 500,
        auditId,
      },
    });

    // Send Confirmation Email via Resend
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: 'SpendSmart AI <onboarding@resend.dev>',
        to: email,
        subject: 'Your AI Spend Audit Report',
        html: `<p>Thanks for using SpendSmart! Your potential annual savings: <strong>$${audit.annualSaving}</strong>.</p>`,
      });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Lead capture failed' });
  }
});

app.listen(port, () => console.log(`API running on port ${port}`));
