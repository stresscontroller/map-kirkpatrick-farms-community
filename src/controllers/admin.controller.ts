import { Request, Response } from "express";
import { Admin } from "../models/admin.model";
import { generateToken } from "../utils/jwt.utils";
import { hashPassword, comparePassword } from "../utils/bycrpt.utils";

export const adminSignup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await hashPassword(password);
    const newAdmin = new Admin({ name, email, password: hashedPassword });
    await newAdmin.save();

    res.status(201).send("Admin created successfully.");
  } catch (error) {
    res.status(500).send("Error creating admin.");
  }
};

export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).send("Invalid email or password.");
    }

    const isPasswordValid = await comparePassword(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).send("Invalid email or password.");
    }

    const token = generateToken({ userId: admin.id, email: admin.email });
    res.send({ token });
  } catch (error) {
    res.status(500).send("Error logging in.");
  }
};