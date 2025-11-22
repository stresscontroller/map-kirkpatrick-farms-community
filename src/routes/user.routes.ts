import express from 'express';
import * as userController from '../controllers/user.controller';
import { adminAuthMiddleware } from '../middlewares/auth.middleware';

const app = express()
const router = express.Router();

app.use(adminAuthMiddleware)
// Update the route to use the type for its parameters
router.get('/all', adminAuthMiddleware, userController.getAllUsers);
router.get('/:id', userController.getUserById)
router.delete('/:id', userController.deleteUser)

export default router;
