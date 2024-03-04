import { Response, Request } from 'express'
import jwt from 'jsonwebtoken'
import { RefreshToken, User } from '../models'
import bcrypt from 'bcrypt'

interface RequestWithBody extends Request {
  body: {
    username: string
    password: string
  }
}

async function signup(req: RequestWithBody, res: Response) {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    const userDoc = new User({
      username: req.body.username,
      password: hashedPassword,
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
  } catch (error) {
    const message = (error as Error).message
    res.status(500).json({ message })
  }
}

const login = async (req: Request, res: Response) => {
  try {
    const userDoc = await User.findOne({ username: req.body.username }).select('+password').exec()
    if (!userDoc) throw new Error('Wrong username or password')

    await verifyPassword(req.body.password, userDoc.password)

    const refreshTokenDoc = new RefreshToken({
      owner: userDoc.id,
    })

    await refreshTokenDoc.save()

    const refreshToken = createRefreshToken(userDoc.id, refreshTokenDoc.id)
    const accessToken = createAccessToken(userDoc.id)

    res.json({
      id: userDoc.id,
      accessToken,
      refreshToken,
    })
  } catch (error) {
    const message = (error as Error).message
    res.status(500).json({ message })
  }
}

function createAccessToken(userId: string) {
  if (!process.env.ACCESS_TOKEN_SECRET) throw new Error('Missing access token secret')

  return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m' })
}

function createRefreshToken(userId: string, refreshTokenId: string) {
  if (!process.env.REFRESH_TOKEN_SECRET) throw new Error('Missing refresh token secret')

  return jwt.sign({ userId, tokenId: refreshTokenId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '30d',
  })
}

const verifyPassword = async (incomingPassword: string, hashedPassword: string) => {
  const match = await bcrypt.compare(incomingPassword, hashedPassword)
  if (!match) throw new Error('Wrong password')
  return match
}

export { signup, login }
