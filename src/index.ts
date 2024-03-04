import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { itemRouter, shopRouter, userRouter } from './routes'
import cors from 'cors'
import cookieParser from 'cookie-parser'

// import jwt from 'jsonwebtoken'

dotenv.config()

const app: Express = express()
const port = process.env.PORT || 3005

const allowedOrigins = ['http://localhost:3000', 'https://dnd-shop-generator.vercel.app']
const corsOptions = {
  origin: allowedOrigins,
}

//middleware
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookieParser())

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server')
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})

mongoose
  .connect(
    'mongodb+srv://dndAdmin:BgRwNY7752SFu8XR@dndcluster.onhzdy9.mongodb.net/dnd-db?retryWrites=true&w=majority',
  )
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB ' + error)
  })

app.use('/api/item', itemRouter)

app.use('/api/shop', shopRouter)

app.use('/api/user', userRouter)
