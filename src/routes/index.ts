import { Router } from "express"
import storeRouter from "./StoreRoutes"
import productRouter from "./ProductRoutes"
import categoryRouter from "./CategoryRoutes"

const router = Router()

router.use('/store', storeRouter)
router.use('/product', productRouter)
router.use('/category', categoryRouter)
 
export default router
