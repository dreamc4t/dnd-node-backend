import { Router } from 'express'
import {
  deleteShop,
  getAllShops,
  getShopById,
  getShopsOfUser,
  newShop,
  updateShop,
} from '../controllers/shop'
import { requireAccessToken } from '../middleware'

const shopRouter = Router()

shopRouter.post('/new', requireAccessToken, newShop)
shopRouter.get('/all', getAllShops)
shopRouter.get('/user', requireAccessToken, getShopsOfUser)
shopRouter.get('/:id', getShopById)
shopRouter.delete('/delete/:id', deleteShop)
shopRouter.patch('/update/:id', updateShop)

export { shopRouter }
