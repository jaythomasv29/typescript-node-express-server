import express, { Request, Response, Application, NextFunction, ErrorRequestHandler } from 'express'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import cors from 'cors'
const app: Application = express()
import { CustomError } from './types/error.types.js'


const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!)
    console.log('connected')
  } catch (err) {
    console.log("error connecting to db")
    throw err
  }
}

dotenv.config()
app.use(cors())
app.use(cookieParser())
app.use(express.json())

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.get("/", (req: Request, res: Response) => {
  res.send("Hello TS with Node")
})

app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
  const errorStatus: number = err.status || 500
  const errorMessage = err.message || "Something went wrong"
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack
  })
})


app.listen(process.env.PORT, (): void => {
  connect()
  console.log(`Server running on PORT ${process.env.PORT}`)
})


