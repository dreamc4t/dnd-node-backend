import jwt from 'jsonwebtoken'
import { ObjectId } from 'mongodb'

const createAccessToken = (id: ObjectId) => {
  const secret = process.env.ACCESS_TOKEN_SECRET
  if (!secret) throw new Error('Missing access token secret')

  return jwt.sign({ id }, secret, {
    expiresIn: '1h',
  })
}

// TODO 8 april,kolla på din utkommenterade här under
const createRefreshToken = (id: ObjectId) => {
  const secret = process.env.REFRESH_TOKEN_SECRET
  if (!secret) throw new Error('Missing refresh token secret')

  return jwt.sign({ id }, secret, {
    expiresIn: '7d',
  })
}

export { createAccessToken, createRefreshToken }

// function createRefreshToken(userId: string, refreshTokenId: string) {
//   if (!process.env.REFRESH_TOKEN_SECRET) throw new Error('Missing refresh token secret')

//   return jwt.sign({ userId, tokenId: refreshTokenId }, process.env.REFRESH_TOKEN_SECRET, {
//     expiresIn: '30d',
//   })
// }
