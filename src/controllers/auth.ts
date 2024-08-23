import { Response, Request } from 'express'
import { User } from '../models'
import { createAccessToken, createRefreshToken } from './utils'
import { JwtPayload } from 'jsonwebtoken'
import { ACCESS_TOKEN_EXP_TIME_MS } from '../constants'

// TODO potentially
// more user friendly error messages
// https://www.youtube.com/watch?v=nukNITdis9g&list=PL4cUxeGkcC9iqqESP8335DA5cRFp8loyp&index=5&ab_channel=NetNinja

interface RequestWithBody extends Request {
  body: {
    username: string
    password: string
  }
}

interface RequestWithUserId extends Request {
  userId?: string | JwtPayload
}

async function signup(req: RequestWithBody, res: Response) {
  try {
    const { username, password } = req.body

    const user = await User.create({ username, password })

    const accessToken = createAccessToken(user._id)
    const refreshToken = createRefreshToken(user._id)

    res.status(201).json({
      user: {
        id: user._id,
        username: user.username,
        createdAt: user.createdAt,
        accessToken,
        refreshToken,
      },
    })
  } catch (error) {
    const message = (error as Error).message
    console.log(message)
    res.status(400).send('error, user not created')
  }
}

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body
  console.log('Logging in user', username)

  try {
    const user = await User.login(username, password)
    const accessToken = createAccessToken(user._id)
    const refreshToken = createRefreshToken(user._id)

    res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        createdAt: user.createdAt,
      },
      backendTokens: {
        accessToken,
        refreshToken,
        accessTokenExpiryDate: new Date().setTime(new Date().getTime() + ACCESS_TOKEN_EXP_TIME_MS),
      },
    })
  } catch (error) {
    const message = (error as Error).message
    console.log(message)

    res.status(400).json({ message })
  }
}

const refreshToken = async (req: RequestWithUserId, res: Response) => {
  console.log('refreshing tokens')

  try {
    const user = await User.findById(req.userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    const newAccessToken = createAccessToken(user._id)
    const newRefreshToken = createRefreshToken(user._id)

    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      accessTokenExpiryDate: new Date().setTime(new Date().getTime() + ACCESS_TOKEN_EXP_TIME_MS),
    })
  } catch (error) {
    const message = (error as Error).message
    console.log(message)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

export { signup, login, refreshToken }
