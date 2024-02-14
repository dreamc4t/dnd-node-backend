import { Router } from 'express'
import { Item } from '../models'

const itemRouter = Router()
// let items: Item[]

itemRouter.get('/', async (req, res) => {
  try {
    const items = await Item.find({})
    res.status(200).json(items)
  } catch (error) {
    const message = (error as Error).message
    res.status(500).json({ message })
  }
})

// router.post('/', (req: Request, res: Response) => {
//   const { name, description, link, tags, type, prize, weight }: Item = req.body
//   const item: Item = {
//     name,
//     description,
//     link,
//     tags,
//     type,
//     prize,
//     weight
//   }

//   items.push(item)
//   res.status(201).json(item)
// })

// router.get('/', (req: Request, res: Response) => {
//   res.json(items)
// })

export { itemRouter }
