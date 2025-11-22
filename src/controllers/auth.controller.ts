// auth.controller.ts
import { Request, Response } from 'express'
import User from '../models/user.model'
import Joi from 'joi'
import { hashPassword, comparePassword } from '../utils/bycrpt.utils'
import { generateToken } from '../utils/jwt.utils'
import { sendVerificationEmail } from '../utils/nodemailer.utils'
import { addHours } from '../utils/date.utils'

async function register(
  req: Request,
  res: Response,
): Promise<Response> {
  const userValidate = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  })

  const result = userValidate.validate(req.body)
  if (result.error) {
    return res.status(400).json({ message: result.error.details[0].message })
  }

  try {
    const { name, email, password} = req.body

    // if (password !== confirmPassword) {
    //   return res.status(400).json({ message: "Passwords don't match" })
    // }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' })
    }

    const emailVerificationCode = parseInt(
      Math.floor(1000 + Math.random() * 9000).toString(),
      10,
    )
    const emailVerificationCodeExpires = new Date()
    emailVerificationCodeExpires.setMinutes(
      emailVerificationCodeExpires.getMinutes() + 15,
    )
    // Generate email verification code

    const hashedPassword = await hashPassword(password)

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      emailVerificationCode, // Save email verification code to the user document
      emailVerificationCodeExpires, // Save email verification code expiration date to the user document
    })

    await newUser.save()

    // Send verification email to the user with the email verification code
    await sendVerificationEmail(email, emailVerificationCode)

    return res.status(201).json({
      message:
        'User registered successfully. Please verify your email address.',
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

// Verify email by code
async function verifyEmail(req: Request, res: Response): Promise<Response> {
  try {
    const { email, code } = req.body

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: 'User email not found' })
    }

    // Check if email is already verified
    if (user.isEmailVerified) {
      return res.status(400).json({ message: 'Email already verified' })
    }

    if (new Date() > user.emailVerificationCodeExpires) {
      return res.status(400).json({ message: 'Verification code has expired' })
    }

    // Verify code
    const emailVerificationCode = user.emailVerificationCode
    if (!emailVerificationCode) {
      return res
        .status(400)
        .json({ message: 'Email verification code is undefined' })
    }

    // Log codes for debugging
    console.log(
      `Submitted code: ${code}, Stored code: ${emailVerificationCode}`,
    )

    if (emailVerificationCode !== parseInt(code.trim(), 10)) {
      return res.status(400).json({ message: 'Invalid verification code' })
    }

    // Update user's isEmailVerified status to true
    user.isEmailVerified = true
    await user.save()

    return res.status(200).json({ message: 'Email verified successfully' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

//resend verification code
export async function resendVerificationCode(
  req: Request,
  res: Response,
): Promise<Response> {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Check if the user's email is already verified
    if (user.isEmailVerified) {
      return res.status(400).json({ message: 'Email is already verified.' })
    }

    // Generate a new verification code and expiry time
    const newCode = parseInt(
      Math.floor(1000 + Math.random() * 9000).toString(),
      10,
    )
    const newExpiry = addHours(new Date(), 1) // Set new code to expire in 1 hour

    // Update user with new code and expiry
    user.emailVerificationCode = newCode
    user.emailVerificationCodeExpires = newExpiry
    await user.save()

    // Resend verification email
    await sendVerificationEmail(email, newCode)

    return res
      .status(200)
      .json({ message: 'Verification email resent successfully' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

//login a user
async function login(req: Request, res: Response): Promise<Response> {
  const loginValidate = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  })
  const result = loginValidate.validate(req.body)
  if (result.error) {
    return res.status(400).json({ message: result.error.details[0].message })
  }

  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    const isPasswordValid = await comparePassword(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' })
    }

    // Ensure that 'user.email' is not undefined
    if (!user.email) {
      return res.status(500).json({ message: 'User email is missing' })
    }

    // Generate JWT token for authenticated user
    const token = generateToken({
      userId: user._id, 
      email: user.email,
    })

    return res.status(200).json({ message: 'Login successful', token })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

//forgot password logic
// async function forgotPassword(req: Request, res: Response) {
//   //validating the user login details
//   const userValidate = Joi.object({
//     email: Joi.number()
//       .integer()
//       .min(10000000)
//       .max(999999999999999)
//       .required(),
//   })
//   const result = userValidate.validate(req.body)

//   if (result.error) {
//     res.status(401).send(result.error.details[0].message)
//     return
//   }
//   //main logic for forgot password
//   try {
//     const { email } = req.body

//     const user = await User.findOne({ email })
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' })
//     }

//     // Generate 4-digit OTP
//     const otp = Math.floor(1000 + Math.random() * 9000)

//     // Send OTP to user's phone number using Twilio (or your chosen SMS provider)
//     await sendVerificationEmail(email, otp)

//     // Store the OTP somewhere (like in the user document) for later verification

//     res.status(200).json({ message: 'Verification code sent successfully' })
//   } catch (error) {
//     console.error(error)
//     res.status(500).json({ message: 'Internal server error' })
//   }
// }
//reset password logic
async function resetPassword(req: Request, res: Response) {
  //validating the user login details
  const userValidate = Joi.object({
    phoneNumber: Joi.number()
      .integer()
      .min(10000000)
      .max(999999999999999)
      .required(),
  })
  const result = userValidate.validate(req.body)

  if (result.error) {
    res.status(401).send(result.error.details[0].message)
    return
  }
  //main logic for resetPassword
  try {
    const { email, otp, newPassword } = req.body

    // Verify OTP (compare with the stored OTP)

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Update user's password with the new password
    user.password = await hashPassword(newPassword)
    await user.save()

    res.status(200).json({ message: 'Password reset successfully' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Internal server error' })
  }
}

export {
  register,
  login,
  verifyEmail,
}

