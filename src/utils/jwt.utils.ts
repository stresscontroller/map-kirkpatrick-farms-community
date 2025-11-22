import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export interface TokenPayload {
  userId: string
  email?: string
  phoneNumber?: string
}

const SECRET_KEY = process.env.SECRET_KEY || 'secret'

function generateToken(payload: TokenPayload): string {
  const tokenPayload: TokenPayload = {
    userId: payload.userId,
    email: payload.email || '',
  }

  return jwt.sign(tokenPayload, SECRET_KEY, { expiresIn: '1d' }) // Use tokenPayload here
}

function verifyToken(token: string): object | string {
  try {
    return jwt.verify(token, SECRET_KEY)
  } catch (error) {
    throw new Error('Invalid or expired token')
  }
}

export { generateToken, verifyToken }
