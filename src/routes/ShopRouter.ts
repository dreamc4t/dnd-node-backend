import express, { Request, Response } from 'express'
import { Shop } from '../models'

const shopRouter = express.Router()

async function setActiveShop(shopId: string) {
  try {
    // Set all shops to inactive
    await Shop.updateMany({}, { isActive: false })

    // Set the specified shop as active
    await Shop.findByIdAndUpdate(shopId, { isActive: true })

    console.log(`Shop ${shopId} is now the active shop.`)
  } catch (error) {
    console.error('Failed to set active shop:', error)
  }
}

shopRouter.get('/active', async (req: Request, res: Response) => {
  try {
    const activeShop = await Shop.findOne({ isActive: true })
    if (!activeShop) {
      return res.status(404).json({ message: 'No active shop found.' })
    }
    res.status(200).json(activeShop)
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
})

shopRouter.post('/activate/:id', async (req: Request, res: Response) => {
  const { id } = req.params
  try {
    await setActiveShop(id)
    res.status(200).json({ message: `Shop ${id} is now the active shop.` })
  } catch (error) {
    res.status(500).json({ message: (error as Error).message })
  }
})

shopRouter.get('/all', async (req: Request, res: Response) => {
  try {
    const shops = await Shop.find({})
    res.status(200).json(shops)
  } catch (error) {
    const message = (error as Error).message
    res.status(500).json({ message })
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

shopRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const shop = await Shop.findById(req.params.id)
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' })
    }
    res.status(200).json(shop)
  } catch (error) {
    const message = (error as Error).message
    res.status(500).json({ message })
  }
})
shopRouter.patch('/update/:id', async (req: Request, res: Response) => {
  try {
    const shop = await Shop.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' })
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
