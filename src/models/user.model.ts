import mongoose, { Document, Schema, Model } from 'mongoose'

//interface for the users
export interface IUser extends Document {
  name?: string
  email: string
  password: string  
  dateCreated?: Date
  isEmailVerified?: boolean
  emailVerificationCode?: number
  emailVerificationCodeExpires: Date
}

//Model and schemas for the users
const userSchema: Schema<IUser> = new Schema(
  {
    name: { type: String },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    dateCreated: { type: Date, default: Date.now },
    emailVerificationCode: { type: Number },
    emailVerificationCodeExpires: { type: Date },
    isEmailVerified: { type: Boolean, default: false }, // Default isEmailVerified to false
  },
  { collection: 'users' },
)

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema)

export default User
