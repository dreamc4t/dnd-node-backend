import mongoose from 'mongoose'

const shopSchema = new mongoose.Schema({
  name: String,
  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
    },
  ],
})

const Shop = mongoose.model('Shop', shopSchema)

export { Shop }
