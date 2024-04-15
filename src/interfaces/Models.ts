import { ObjectId } from 'mongodb'

interface IItem {
  _id: ObjectId
  name: string
  type: string
  prize: string
  description: string[]
  weight: string
  tags: string[]
  link: string
}

interface IShop {
  _id: ObjectId
  userId: ObjectId
  name: string
  items: IItem[]
  createdAt: Date
  updatedAt: Date
}

interface IUser {
  _id: ObjectId
  username: string
  password: string
  createdAt: Date
  updatedAt: Date
}

export { IItem, IShop, IUser }
