import {Router} from "express"
import {getAll, getOne, updateOne, createOne, deleteOne} from "../controllers/orderController.js"

const orderRoutes = Router()

orderRoutes.get("/", getAll)
orderRoutes.get("/:id", getOne)
orderRoutes.post("/", createOne)
orderRoutes.put("/:id", updateOne)
orderRoutes.delete("/:id", deleteOne)

export default orderRoutes
