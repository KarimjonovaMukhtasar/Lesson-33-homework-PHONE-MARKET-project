import {Router} from "express"
import {getAll, getOne, updateOne, createOne, deleteOne, getAllBrandModels} from "../controllers/modelController.js"

const modelRoutes = Router()

modelRoutes.get("/", getAll)
modelRoutes.get("/:id", getOne)
modelRoutes.post("/", createOne )
modelRoutes.put("/:id", updateOne)
modelRoutes.delete("/:id", deleteOne)
modelRoutes.get("/brand/:brand_id", getAllBrandModels)
// GET	/api/models/brand/:brand_id	Brendga tegishli modellarni ko'rish
export default  modelRoutes
