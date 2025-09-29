import express from "express"
import router from "./routes/index"
import cors from "cors"

const app = express()

app.use(cors())
app.use(express.json())

app.get('/healthcheck',(req, res) => res.status(200).send("API funcionando!"))

app.use('/api/v1', router)

export default app;