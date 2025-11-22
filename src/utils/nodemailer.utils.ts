//nodemailer.utils.ts
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USERNAME, 
    pass: process.env.GMAIL_PASSWORD, 
  },
})

async function sendVerificationEmail(
  email: string,
  verificationCode: number,
): Promise<void> {
  try {
    // Send mail with defined transport object
    await transporter.sendMail({
      from: '"OneCo Team" <moyotecky@gmail.com>', // Replace with your app name and your Gmail email address
      to: email,
      subject: 'Email Verification Code',
      text: `Your Oneco verification code is: ${verificationCode}`,
    })
    console.log('Verification email sent successfully OK')
  } catch (error) {
    console.error('Error sending verification email:', error)
  }
}

export { sendVerificationEmail }
