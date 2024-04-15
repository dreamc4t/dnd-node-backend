import { ReqWithUserId } from '../interfaces'
import { Shop } from '../models'
import { Response, Request } from 'express'

const newShop = async (req: ReqWithUserId, res: Response) => {
  const { body, userId } = req

  try {
    if (!userId) return res.status(403).json({ message: 'User data not found' })

    const shopData = {
      ...body,
      userId,
    }
    const newShop = new Shop(shopData)
    const savedShop = await newShop.save()

    res.status(201).json(savedShop)
  } catch (error) {
    const message = (error as Error).message
    res.status(500).json({ message })
  }
}

const getShopsOfUser = async (req: ReqWithUserId, res: Response) => {
  try {
    if (!req.userId) return res.status(403).json({ message: 'User not authenticated' })

    const shops = await Shop.find({ userId: req.userId })

    res.status(200).json(shops)
  } catch (error) {
    const message = (error as Error).message
    res.status(500).json({ message })
  }
}
const getAllShops = async (req: Request, res: Response) => {
  try {
    const shops = await Shop.find({})
    res.status(200).json(shops)
  } catch (error) {
    const message = (error as Error).message
    res.status(500).json({ message })
  }
}

const getShopById = async (req: Request, res: Response) => {
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
}

const deleteShop = async (req: Request, res: Response) => {
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
}

const updateShop = async (req: Request, res: Response) => {
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
}

export { newShop, getAllShops, getShopById, deleteShop, updateShop, getShopsOfUser }
