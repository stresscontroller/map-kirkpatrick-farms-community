import mongoose, { Document, Schema, Model } from 'mongoose';
import { IUser } from './user.model'; 

export interface IAdmin extends IUser {
    //.....
}

const adminSchema: Schema<IAdmin> = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  
},{ collection: 'admins' },);

export const Admin: Model<IAdmin> = mongoose.model<IAdmin>('Admin', adminSchema);
