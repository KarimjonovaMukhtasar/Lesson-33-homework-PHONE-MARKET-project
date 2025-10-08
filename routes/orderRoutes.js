import {Router} from "express"
import {getAll, getOne, updateOne, createOne, deleteOne} from "../controllers/orderController.js"

const orderRoutes = Router()

orderRoutes.get("/", getAll)
orderRoutes.get("/:id", getOne)
orderRoutes.get("/customer/:customer_id", getCustomerOrders)
// GET	/api/orders/customer/:customer_id	Mijozning buyurtmalarini ko'rish
orderRoutes.post("/", createOne)
orderRoutes.put("/:id", updateOne)
orderRoutes.patch("/:id/status", updateStatus)
// PATCH	/api/orders/:id/status	Buyurtma statusini o'zgartirish
orderRoutes.delete("/:id", deleteOne)


export default orderRoutes
