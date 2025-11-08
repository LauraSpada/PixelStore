import {Router} from "express";
import { StoreController } from "../controllers/StoreController";
import { authenticate } from '../middlewares/Auth';

const router = Router();

router.get('/', StoreController.getAll)
router.get('/:id', StoreController.getById)
router.get('/:storeId/users', StoreController.getUsersByStore)
router.get('/:storeId/products', StoreController.getProductsByStore)

router.post('/', StoreController.create)
router.put('/:id', authenticate, StoreController.update)
router.delete('/:id', authenticate, StoreController.delete)

export default router