import {Router} from "express";
import { CategoryController } from "../controllers/CategoryController";
import { authenticate } from '../middlewares/Auth';

const router = Router();

router.get('/', CategoryController.getAll)
router.get('/:id', CategoryController.getById)
router.get('/:categoryId/products', CategoryController.getProductsByCategory)

router.post('/store/:storeId', authenticate, CategoryController.create)
router.put('/:id', authenticate, CategoryController.update)
router.delete('/:id', authenticate, CategoryController.delete)

export default router