import { Request, Response } from 'express';
import User from '../models/user.model'; 
import Joi from 'joi';

// Get all users
export async function getAllUsers(req: Request, res: Response): Promise<void> {
  try {
    const users = await User.find({}, '-password'); // Excluding password field from the result
    res.status(200).json(users);
  } catch (error: unknown) {
    const e = error as Error; // Type assertion
    console.log(e.message);
    res.status(500).json({ message: e.message });
  }
}

// Get a single user by his ID
export async function getUserById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      res.status(404).send('User with the given ID was not found');
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    res.status(500).send('Internal server error');
  }
}

// Deleting a user by ID
export async function deleteUser(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      res.status(404).send('User with the given ID does not exist, Check the ID and try again');
    } else {
      res.status(200).send('User deleted successfully');
    }
  } catch (error) {
    res.status(500).send('Internal server error');
  }
}

