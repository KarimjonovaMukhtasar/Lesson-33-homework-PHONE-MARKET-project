import {Router} from "express"
import {getAll, getOne, createOne, updateOne, deleteOne} from "../controllers/customerController.js"
import { validateBrandName, validatePhoneNumber } from "../middleware/validator.js"

const customerRoutes = Router()

customerRoutes.get("/", getAll)
customerRoutes.get("/:id", getOne)
customerRoutes.post("/", validateBrandName, validatePhoneNumber, createOne )
customerRoutes.put("/:id", updateOne)
customerRoutes.delete("/:id", deleteOne)

export default customerRoutes