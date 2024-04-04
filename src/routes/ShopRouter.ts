import { Request, Response, Router } from 'express'
import { Shop } from '../models'
// import { requireAuthenticated } from '../middleware'

const shopRouter = Router()

shopRouter.get('/all', async (req: Request, res: Response) => {
  try {
    const shops = await Shop.find({})
    res.status(200).json(shops)
  } catch (error) {
    const message = (error as Error).message
    res.status(500).json({ message })
  }
})

shopRouter.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    const shop = await Shop.findById(id)
    if (!shop) {
      return res.status(204).json({ message: 'No shop found with that ID' })
    }
    res.status(200).json(shop)
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
})

shopRouter.post('/new', async (req, res) => {
  try {
    const newShop = new Shop(req.body)
    const savedShop = await newShop.save()
    res.status(201).json(savedShop)
  } catch (error) {
    const message = (error as Error).message
    res.status(500).json({ message })
  }
})

shopRouter.patch('/update/:id', async (req: Request, res: Response) => {
  try {
    const shop = await Shop.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!shop) {
      return res.status(404).json({ message: 'No shop found with that ID' })
    }
    res.status(200).json(shop)
  } catch (error) {
    const message = (error as Error).message
    res.status(500).json({ message })
  }
})

shopRouter.delete('/delete/:id', async (req: Request, res: Response) => {
  try {
    const shop = await Shop.findByIdAndDelete(req.params.id)
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' })
    }
    res.status(200).json({ message: 'Shop successfully deleted' })
  } catch (error) {
    const message = (error as Error).message
    res.status(500).json({ message })
  }
})

export { shopRouter }
