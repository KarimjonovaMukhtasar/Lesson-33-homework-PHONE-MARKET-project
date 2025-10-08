import {Router} from "express"
import {getAll, getOne, updateOne, createOne, deleteOne, getModelPhones} from "../controllers/phoneController.js"
import { validatePhoneNumber, validatePhonePrice } from "../middleware/validator.js"

const phoneRoutes = Router()

phoneRoutes.get("/", getAll)
phoneRoutes.get("/:id", getOne)
phoneRoutes.get("/model/:model_id", getModelPhones)
// GET	/api/phones/model/:model_id	Modelga tegishli telefonlarni ko'rish
phoneRoutes.post("/",  createOne)
phoneRoutes.put("/:id", updateOne)
phoneRoutes.delete("/:id", deleteOne)

export default phoneRoutes
