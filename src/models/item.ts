import mongoose from 'mongoose'

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: false },
  prize: { type: String, required: false },
  description: { type: [String], required: false },
  weight: { type: String, required: false },
  tags: { type: [String], required: false },
  link: { type: String, required: false }
})

const Item = mongoose.model('Item', itemSchema)
export { Item }

// interface Item {
//   _id?: string
//   name?: string
//   type: string
//   prize?: string
//   description: string[]
//   weight?: string
//   tags: string[]
//   link: string
// }

// export { Item }

// module.exports = mongoose.model('Item', itemSchema)
