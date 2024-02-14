import express, { Request, Response } from 'express'
import { Shop } from '../models'

const shopRouter = express.Router()

shopRouter.get('/all', async (req: Request, res: Response) => {
  try {
    const shops = await Shop.find({}).populate('items')
    res.status(200).json(shops)
  } catch (error) {
    const message = (error as Error).message
    res.status(500).json({ message })
  }
})

//Post Method
shopRouter.post('/post', (req, res) => {
  res.send('Post API')
})

//Get by ID Method
shopRouter.get('/get/:id', (req, res) => {
  res.send('Get by ID API')
})

//Update by ID Method
shopRouter.patch('/update/:id', (req, res) => {
  res.send('Update by ID API')
})

//Delete by ID Method
shopRouter.delete('/delete/:id', (req, res) => {
  res.send('Delete by ID API')
})

export { shopRouter }
