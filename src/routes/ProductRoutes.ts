import {Router} from "express";
import { ProductController } from "src/controllers/ProductController";
import { authenticate } from '../middlewares/Auth';

const router = Router();

router.get('/', ProductController.getAll)
router.get('/:id', ProductController.getById)
router.post('/', ProductController.create)
router.put('/:id', ProductController.update)
router.delete('/:id', ProductController.delete)

export default router