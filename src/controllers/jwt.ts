import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongodb'
import { maxAge } from '../constants/maxAge'

const createToken = (id: ObjectId) => {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('Missing jwt secret')

  return jwt.sign({ id }, secret, {
    expiresIn: maxAge,
  })
}

export { createToken }

// function createAccessToken(userId: string) {
//   if (!process.env.ACCESS_TOKEN_SECRET) throw new Error('Missing access token secret')

//   return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m' })
// }

// function createRefreshToken(userId: string, refreshTokenId: string) {
//   if (!process.env.REFRESH_TOKEN_SECRET) throw new Error('Missing refresh token secret')

//   return jwt.sign({ userId, tokenId: refreshTokenId }, process.env.REFRESH_TOKEN_SECRET, {
//     expiresIn: '30d',
//   })
// }
