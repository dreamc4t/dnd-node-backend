import { Response, Request } from 'express'
import { RefreshToken, User } from '../models'
import { createRefreshToken, createAccessToken } from './jwt'
import { verifyPassword } from './utils'

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

async function signup(req: RequestWithBody, res: Response) {
  try {
    const { username, password } = req.body
    // const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({ username, password })
    res.status(201).json(user)

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

    // res.status(500).json({ message })
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

const signupGet = async (req: Request, res: Response) => {
  console.log('signup GET')

  res.status(200).send('Signup getter yeahhh')
}
const loginGet = async (req: Request, res: Response) => {
  console.log('login GET')

  res.status(200).send('login getter yeahhh')
}

export { signup, login, signupGet, loginGet }
