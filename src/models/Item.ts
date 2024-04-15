import { Schema, model } from 'mongoose'
import { IItem } from '../interfaces'

const itemSchema = new Schema<IItem>({
  name: { type: String, required: true },
  type: { type: String, required: false },
  prize: { type: String, required: false },
  description: { type: [String], required: false },
  weight: { type: String, required: false },
  tags: { type: [String], required: false },
  link: { type: String, required: false },
})

const Item = model('Item', itemSchema)
export { Item, itemSchema }
