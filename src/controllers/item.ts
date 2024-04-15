import { Item } from '../models'
import { Response, Request } from 'express'

const getAllItems = async (req: Request, res: Response) => {
  try {
    const items = await Item.find({})
    res.status(200).json(items)
  } catch (error) {
    const message = (error as Error).message
    res.status(500).json({ message })
  }
}

export { getAllItems }
