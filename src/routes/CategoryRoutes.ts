import {Router} from "express";
import { CategoryController } from "../controllers/CategoryController";
import { authenticate } from '../middlewares/Auth';

const router = Router();

router.get('/', CategoryController.getAll)
router.get('/:id', CategoryController.getById)

router.post('/', authenticate, CategoryController.create)
//router.put('/:id', CategoryController.update)
router.delete('/:id', authenticate, CategoryController.delete)

export default router