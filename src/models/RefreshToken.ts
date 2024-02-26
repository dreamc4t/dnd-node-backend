import { Schema, model } from 'mongoose'

const refreshTokenSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: 'User' },
})

const RefreshToken = model('RefreshToken  ', refreshTokenSchema)

export { RefreshToken }
