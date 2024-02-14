import { Router } from 'express'
import { Item } from '../models'

const itemRouter = Router()

itemRouter.get('/all', async (req, res) => {
  try {
    const items = await Item.find({})
    res.status(200).json(items)
  } catch (error) {
    const message = (error as Error).message
    res.status(500).json({ message })
  }
})

export { itemRouter }
