import {Router} from "express"
import {getAll, getOne, updateOne, createOne, deleteOne} from "../controllers/modelController.js"

const modelRoutes = Router()

modelRoutes.get("/", getAll)
modelRoutes.get("/:id", getOne)
modelRoutes.post("/", createOne )
modelRoutes.put("/:id", updateOne)
modelRoutes.delete("/:id", deleteOne)

export default  modelRoutes
