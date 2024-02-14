import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { Item } from './models'
import { itemRouter, shopRouter } from './routes'

dotenv.config()

const app: Express = express()
const port = process.env.PORT || 3005

app.use(express.json())

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

// app.get('/items', async (req, res) => {
//   try {
//     const items = await Item.find({})
//     res.status(200).json(items)
//   } catch (error) {
//     const message = (error as Error).message
//     res.status(500).json({ message })
//   }
// })

app.use('/items', itemRouter)

app.use('/shops', shopRouter)

// async function testAddUser() {
//   try {
//     const user = await User.create({
//       name: 'Erik',
//       email: 'erik@mail.com'
//     })
//     console.log(user)
//   } catch (e) {
//     const message = (e as Error).message
//     console.log(message)
//   }
// }
