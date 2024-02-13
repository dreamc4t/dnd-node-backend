import { Router, Request, Response } from 'express'
import { Item } from '../models'

const router = Router()
let items: Item[]

router.post('/', (req: Request, res: Response) => {
  const { name, description, link, tags, type, prize, weight }: Item = req.body
  const item: Item = {
    name,
    description,
    link,
    tags,
    type,
    prize,
    weight
  }

  items.push(item)
  res.status(201).json(item)
})

router.get('/', (req: Request, res: Response) => {
  res.json(items)
})

export default router
