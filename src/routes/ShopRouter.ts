import express, { Request, Response } from 'express'
import { Shop } from '../models'

const shopRouter = express.Router()

shopRouter.get('/', async (req: Request, res: Response) => {
  try {
    const shops = await Shop.find({})
    res.status(200).json(shops)
  } catch (error) {
    const message = (error as Error).message
    res.status(500).json({ message })
  }
})

export { shopRouter }
