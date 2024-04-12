import { Response, Request } from 'express'
import { User } from '../models'
import { createAccessToken, createRefreshToken } from './jwt'
import { JwtPayload } from 'jsonwebtoken'
// import { maxAge } from '../constants/maxAge'

// TODO BEFORE PUBLISH
// more user friendly error messages
// https://www.youtube.com/watch?v=nukNITdis9g&list=PL4cUxeGkcC9iqqESP8335DA5cRFp8loyp&index=5&ab_channel=NetNinja
// dont think we need. Message is fine. But in case we want

interface RequestWithBody extends Request {
  body: {
    username: string
    password: string
  }
}

interface RequestWithUserId extends Request {
  userId?: string | JwtPayload
}

// const EXPIRE_TIME = 1000 * 20 // 1000 milliseconds

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
    // res.status(201).json({ user: user._id })

    // Denna är deras egna docs  https://mongoosejs.com/docs/typescript.html
    // const userDoc = new User({
    //   username,
    //   password: hashedPassword,
    // })

    // const refreshTokenDoc = new RefreshToken({
    //   owner: userDoc.id,
    // })

    // await userDoc.save()
    // await refreshTokenDoc.save()

    // const refreshToken = createRefreshToken(userDoc.id, refreshTokenDoc.id)
    // const accessToken = createAccessToken(userDoc.id)

    // res.json({
    //   id: userDoc.id,
    //   accessToken,
    //   refreshToken,
    // })
  } catch (error) {
    const message = (error as Error).message
    console.log(message)
    res.status(400).send('error, user not created')
  }
}

const login = async (req: Request, res: Response) => {
  console.log('Logging in user')
  const { username, password } = req.body

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
        // expiresIn: new Date(new Date().getTime() + EXPIRE_TIME),
      },
    })
  } catch (error) {
    const message = (error as Error).message
    console.log(message)

    res.status(400).json({ message })
  }
}

const refreshToken = async (req: RequestWithUserId, res: Response) => {
  try {
    const user = await User.findById(req.userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    const accessToken = createAccessToken(user._id)
    const refreshToken = createRefreshToken(user._id)

    res.status(200).json({
      accessToken,
      refreshToken,
      // expiresIn: new Date(new Date().getTime() + EXPIRE_TIME),
    })
  } catch (error) {
    const message = (error as Error).message
    console.log(message)
    res.status(500).json({ message: 'Internal Server Error' })
  }
}

export { signup, login, refreshToken }
