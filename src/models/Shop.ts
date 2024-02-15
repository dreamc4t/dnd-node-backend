import mongoose from 'mongoose'
import { itemSchema } from './Item'

const shopSchema = new mongoose.Schema({
  name: String,
  items: [itemSchema],
  isActive: { type: Boolean, default: false },
})

const Shop = mongoose.model('Shop', shopSchema)

export { Shop }
