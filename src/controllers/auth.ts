import { Response, Request } from 'express'
import jwt from 'jsonwebtoken'
import { RefreshToken, User } from '../models'

interface RequestWithBody extends Request {
  body: {
    username: string
    password: string // Ensure this is hashed before saving.
    // email: string
  }
}

async function signup(req: RequestWithBody, res: Response) {
  const userDoc = new User({
    // do I need new here?
    username: req.body.username,
    password: req.body.password, //GLÖM EJ HASHA!
    // email: req.body.email,
  })

  const refreshTokenDoc = new RefreshToken({
    owner: userDoc.id,
  })

  await userDoc.save()
  await refreshTokenDoc.save()

  const refreshToken = createRefreshToken(userDoc.id, refreshTokenDoc.id)
  const accessToken = createAccessToken(userDoc.id)

  res.json({
    id: userDoc.id,
    accessToken,
    refreshToken,
  })
}

function createAccessToken(userId: string) {
  if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error('Missing access token secret')
  }

  return jwt.sign(
    {
      userId: userId,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: '10m',
    },
  )
}

function createRefreshToken(userId: string, refreshTokenId: string) {
  if (!process.env.REFRESH_TOKEN_SECRET) {
    throw new Error('Missing refresh token secret')
  }

  return jwt.sign(
    {
      userId: userId,
      tokenId: refreshTokenId,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: '30d',
    },
  )
}

export { signup }
