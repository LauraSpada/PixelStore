import {Router} from "express";
import { UserController } from "../controllers/UserController";
import { authenticate } from '../middlewares/Auth';

const router = Router();

router.get('/', UserController.getAll)
router.post('/', UserController.create)

router.put('/:id', authenticate, UserController.update)
router.delete('/:id', authenticate, UserController.delete)

export default router