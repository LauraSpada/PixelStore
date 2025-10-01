import {Router} from "express";
import { StoreController } from "../controllers/StoreController";
import { authenticate } from '../middlewares/Auth';

const router = Router();

router.get('/', StoreController.getAll)
router.get('/:id', StoreController.getById)

router.post('/', authenticate, StoreController.create)
router.put('/:id', authenticate, StoreController.update)
router.delete('/:id', authenticate, StoreController.delete)

export default router