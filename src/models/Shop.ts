import mongoose from 'mongoose'
import { itemSchema } from './Item'
import { IShop } from '../interfaces'

const shopSchema = new mongoose.Schema<IShop>({
  name: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [itemSchema],
  createdAt: {
    type: Date,
    immutable: false,
    default: () => Date.now(),
  },
  updatedAt: {
    type: Date,
    default: () => Date.now(),
  },
})

const Shop = mongoose.model('Shop', shopSchema)

export { Shop }
