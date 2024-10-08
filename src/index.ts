import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { authRouter, itemRouter, shopRouter, userRouter } from './routes'
import cors from 'cors'
import cookieParser from 'cookie-parser'

dotenv.config()

const app: Express = express()
const port = process.env.PORT || 3005

const mongoURI = process.env.MONGO_URI as string
if (!mongoURI) {
  console.error('Missing mongo uri')
  process.exit(1) // Exit if there is no mongo URI
}

const allowedOrigins = ['http://localhost:3000', 'https://dnd-shop-generator.vercel.app']
const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
}

//middleware
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())

async function startServer() {
  try {
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 30000, // Optionally adjust the timeout settings
      socketTimeoutMS: 45000,
    })
    console.log('Connected to MongoDB')

    app.get('/', (req: Request, res: Response) => {
      res.send('Express + TypeScript Server')
    })

    app.use('/api/item', itemRouter)
    app.use('/api/shop', shopRouter)
    app.use('/api/user', userRouter)
    app.use('/api/auth', authRouter)

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`)
    })
  } catch (error) {}
}

startServer()
