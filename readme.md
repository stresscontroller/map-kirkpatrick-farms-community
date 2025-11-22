# ----Dependencies------

@types/chalk
@types/cookie-parser
@types/cors
@types/express
@types/uuid
bcrypt
cookie-parser
cors
dotenv
express
joi
jsonwebtoken
mongoose
nodemailer
nodemon
typescript
uuid

# @types/chalk @types/cookie-parser @types/cors @types/express @types/uuid bcrypt cookie-parser cors dotenv express joi jsonwebtoken mongoose nodemailer nodemon typescript uuid

## Use consistent folder naming structure to name files

### file contained in a particular sub-folder should be named after that folder i.e files contained in controllers

### should be named _filename.controller.[ext]_

## Run _npm run build_ to compile to from Typescript to Javascript

## Run _npm start_ to start the server

//

**Admin Model (`admin.model.ts`):**

```typescript
import mongoose, { Document, Schema, Model } from "mongoose";
import { IUser } from "./user.model"; // Assuming you have a user.model file

export interface IAdmin extends IUser {
  // You can add more admin-specific properties here
}

const adminSchema: Schema<IAdmin> = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  // Add other fields if necessary
});

export const Admin: Model<IAdmin> = mongoose.model<IAdmin>(
  "Admin",
  adminSchema
);
```

**JWT Utility Functions (`jwtUtils.ts`):** (You've already provided this, so I won't repeat it here.)

**Bcrypt Logic (`bcryptUtils.ts`):** (You've already provided this, so I won't repeat it here.)

**Middleware for Admin Route Protection (`adminAuth.middleware.ts`):**

```typescript
import { Request, Response, NextFunction } from "express";
import { verifyToken } from "./jwtUtils";

export const adminAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer Token
  if (!token) {
    return res.status(401).send("Access denied. No token provided.");
  }

  try {
    const decoded = verifyToken(token);
    if (decoded && typeof decoded === "object" && "userId" in decoded) {
      req.user = decoded; // Add user info to the request object
      next();
    } else {
      return res.status(403).send("Access denied. Not an admin.");
    }
  } catch (error) {
    res.status(400).send("Invalid token.");
  }
};
```

**Admin Controllers (`admin.controller.ts`):**

```typescript
import { Request, Response } from "express";
import { Admin } from "./admin.model";
import { generateToken } from "./jwtUtils";
import { hashPassword, comparePassword } from "./bcryptUtils";

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
```

**Admin Routes (`admin.routes.ts`):**

```typescript
import express from "express";
import { adminSignup, adminLogin } from "./admin.controller";
import { adminAuthMiddleware } from "./adminAuth.middleware";

const router = express.Router();

router.post("/signup", adminSignup);
router.post("/login", adminLogin);

// Protect all routes after this middleware
router.use(adminAuthMiddleware);

// Add other protected admin routes here

export default router;
```

Make sure to integrate these files properly into your application, and don't forget to handle errors and edge cases according to your needs. This setup should give you a solid foundation for managing admin users in your application. Always ensure to test thoroughly and secure your application's authentication flow.
