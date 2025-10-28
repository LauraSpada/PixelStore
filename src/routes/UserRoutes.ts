import {Router} from "express";
import { UserController } from "../controllers/UserController";
import { authenticate } from '../middlewares/Auth';

const router = Router();

router.post('/', UserController.create)
router.get('/', UserController.getAll)

router.delete('/:id', authenticate, UserController.delete)

export default router