import { Response, Request } from 'express'
import { RefreshToken, User } from '../models'
import bcrypt from 'bcrypt'
import { createRefreshToken, createAccessToken } from './jwt'
import { verifyPassword } from './utils'

interface RequestWithBody extends Request {
  body: {
    username: string
    password: string
  }
}

async function signup(req: RequestWithBody, res: Response) {
  try {
    const { username, password } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    const userDoc = new User({
      username,
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
    const { username } = req.body
    const userDoc = await User.findOne({ username }).select('+password').exec()
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

export { signup, login }
