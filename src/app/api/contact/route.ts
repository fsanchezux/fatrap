import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email and message are required.' }, { status: 400 })
    }

    const { error } = await resend.emails.send({
      from: 'Fatrap Contact <onboarding@resend.dev>',
      to: 'gfxmadnessinc@gmail.com',
      replyTo: email,
      subject: subject ? `[Fatrap] ${subject}` : `[Fatrap] New message from ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #111; border-bottom: 2px solid #eee; padding-bottom: 12px;">
            New message from Fatrap Brand website
          </h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #666; width: 80px;"><strong>Name</strong></td>
              <td style="padding: 8px 0; color: #111;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;"><strong>Email</strong></td>
              <td style="padding: 8px 0; color: #111;">${email}</td>
            </tr>
            ${subject ? `<tr>
              <td style="padding: 8px 0; color: #666;"><strong>Subject</strong></td>
              <td style="padding: 8px 0; color: #111;">${subject}</td>
            </tr>` : ''}
          </table>
          <div style="margin-top: 20px; padding: 16px; background: #f9f9f9; border-radius: 8px;">
            <p style="color: #333; white-space: pre-wrap; margin: 0;">${message}</p>
          </div>
          <p style="margin-top: 24px; color: #aaa; font-size: 12px;">
            Sent from fatrap.vercel.app · Reply directly to this email to respond to ${name}
          </p>
        </div>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ error: 'Failed to send email.' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Contact API error:', err)
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 })
  }
}
