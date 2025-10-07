import {Router} from "express"
import {getAll, getOne, updateOne, createOne, deleteOne} from "../controllers/orderDetailController.js"
import { validateOrder } from "../middleware/validator.js"

const orderDetailRoutes = Router()

orderDetailRoutes.get("/", getAll)
orderDetailRoutes.get("/:id", getOne)
orderDetailRoutes.post("/", validateOrder, createOne)
orderDetailRoutes.put("/:id", validateOrder, updateOne)
orderDetailRoutes.delete("/:id", deleteOne)

export default orderDetailRoutes
