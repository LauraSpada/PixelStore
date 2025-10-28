import { Router } from "express"
import { router as authRoutes } from "./AuthRoutes";
import storeRouter from "./StoreRoutes"
import productRouter from "./ProductRoutes"
import categoryRouter from "./CategoryRoutes"
import userRouter from "./UserRoutes"

const router = Router()

router.use('/auth', authRoutes)
router.use('/user', userRouter)
router.use('/store', storeRouter)
router.use('/product', productRouter)
router.use('/category', categoryRouter)
 
export default router
