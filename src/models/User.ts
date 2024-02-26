import { Schema, model } from 'mongoose'

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  // email: {
  //   type: String,
  //   lowercase: true,
  //   required: true,
  //   unique: true,
  // },
  password: {
    type: String,
    required: true,
  },
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

const User = model('User', userSchema)
export { User }
