import express from "express"
import dotenv from "dotenv"
import morgan from "morgan"
import cors from "cors"
import brandRoutes from "./routes/brandRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import phoneRoutes from "./routes/phoneRoutes.js"
import customerRoutes from "./routes/customerRoutes.js"
import modelRoutes from "./routes/modelRoutes.js"
import {errorHandler} from "./middleware/errorHandler.js"
import orderDetailRoutes from "./routes/orderDetailRoutes.js"
dotenv.config()
const app = express()
app.use(cors({
    origin: "http://localhost:3000",
    method: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
}))
app.get('/', (req,res)=>{
    res.send({message: `CORS IS RUNNING PROPERLY`})
})
const PORT = process.env.PORT || 3000
app.use(express.json())
app.use(morgan('tiny'))
app.use("/order-details", orderDetailRoutes)
app.use("/phones", phoneRoutes)
app.use("/customers", customerRoutes)
app.use("/orders", orderRoutes)
app.use("/models", modelRoutes)
app.use("/brands", brandRoutes)
app.use(errorHandler)
app.listen(PORT, ()=>{
    console.log(`THE SERVER IS RUNNING PROPERLY ON THE PORT ${PORT}`)
})