import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongodb'
import { ACCESS_TOKEN_EXP_TIME_MS, REFRESH_TOKEN_EXP_TIME_MS } from '../../constants'

const createAccessToken = (id: ObjectId) => {
  const secret = process.env.ACCESS_TOKEN_SECRET
  if (!secret) throw new Error('Missing access token secret')

  return jwt.sign({ id }, secret, {
    expiresIn: ACCESS_TOKEN_EXP_TIME_MS / 1000,
  })
}

const createRefreshToken = (id: ObjectId) => {
  const secret = process.env.REFRESH_TOKEN_SECRET
  if (!secret) throw new Error('Missing refresh token secret')

  return jwt.sign({ id }, secret, {
    expiresIn: REFRESH_TOKEN_EXP_TIME_MS / 1000,
  })
}

export { createAccessToken, createRefreshToken }
