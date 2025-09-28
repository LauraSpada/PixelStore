import {Router} from "express";
import { CategoryController } from "src/controllers/CategoryController";

const router = Router();

router.get('/', CategoryController.getAll)
router.get('/:id', CategoryController.getById)
router.post('/', CategoryController.create)
//router.put('/:id', CategoryController.update)
router.delete('/:id', CategoryController.delete)

export default router