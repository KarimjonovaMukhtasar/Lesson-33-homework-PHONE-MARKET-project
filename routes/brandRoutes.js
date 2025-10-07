import {Router} from "express"
import {getAll, getOne, updateOne, createOne, deleteOne} from "../controllers/brandController.js"
import { validateBrandName} from "../middleware/validator.js"

const brandRoutes = Router()

brandRoutes.get("/", getAll)
brandRoutes.get("/:id", getOne)
brandRoutes.put("/:id", validateBrandName, updateOne)
brandRoutes.post("/", validateBrandName, createOne)
brandRoutes.delete("/:id", deleteOne)

export default brandRoutes