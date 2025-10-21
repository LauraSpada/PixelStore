import {Router} from "express";
import { ProductController } from "../controllers/ProductController";
import { authenticate } from '../middlewares/Auth';

const router = Router();

router.get('/', ProductController.getAll)
router.get('/:id', ProductController.getById)

router.get("/store/:storeId", ProductController.getProductsByStore);
router.get("/category/:categoryId", ProductController.getProductsByCategory);
router.get("/store-name/:storeName", ProductController.getProductsByStoreName);
router.get("/category-name/:categoryName", ProductController.getProductsByCategoryName);

router.post('/store/:storeId/category/:categoryId', authenticate, ProductController.create)
router.put('/:id', authenticate, ProductController.update)
router.delete('/:id', authenticate, ProductController.delete)

export default router