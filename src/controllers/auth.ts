import { Response, Request } from 'express'
import { User } from '../models'
import { createToken } from './jwt'
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken'
import { getJwtFromReq } from '../utils'

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

const maxAge = 3 * 24 * 60 * 60 // 3 days

async function signup(req: RequestWithBody, res: Response) {
  try {
    const { username, password } = req.body

    const user = await User.create({ username, password })
    const token = createToken(user._id)
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
    res.status(201).json({ user: user._id })

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
    const token = createToken(user._id)
    res.cookie('jwt', token, { httpOnly: true, maxAge })

    res.status(200).json({
      user: { id: user._id, username: user.username, createdAt: user.createdAt },
    })
  } catch (error) {
    const message = (error as Error).message
    console.log(message)

    res.status(400).json({ message })
  }
}

const logout = (req: Request, res: Response) => {
  console.log('Logging out user')
  res.clearCookie('jwt')
  res.status(200).json({ message: 'Logout successful' })
}

const verifyToken = (req: Request, res: Response) => {
  console.log('verifying user')

  try {
    const secret = process.env.JWT_SECRET
    if (!secret) {
      console.error('Missing jwt secret')
      return res.status(500).json({ message: 'Server configuration error, missing jwt secret' })
    }

    const jwtToken = getJwtFromReq(req)

    if (!jwtToken) {
      return res.status(401).json({ message: 'No jwt token provided' })
    }
    // let jwtToken = req.cookies.jwt
    // if (!jwtToken && req.headers.authorization) {
    //   const parts = req.headers.authorization.split(' ')
    //   if (parts.length === 2 && parts[0] === 'Bearer') {
    //     jwtToken = parts[1]
    //   }
    // }

    jwt.verify(
      jwtToken,
      secret,
      async (err: VerifyErrors | null, decodedToken?: string | JwtPayload) => {
        if (err) return res.status(200).json({ isLoggedIn: false })

        if (decodedToken && typeof decodedToken !== 'string') {
          const userId = decodedToken.id

          try {
            const user = await User.findById(userId).select('-password')
            if (!user) {
              return res.status(404).json({ message: 'User not found' })
            }

            return res.status(200).json({ isLoggedIn: true, user })
          } catch (fetchError) {
            return res.status(500).json({ message: 'Error fetching user data' })
          }
        } else {
          return res.status(401).json({ isLoggedIn: false, user: null })
        }
      },
    )
  } catch (error) {
    res.status(500).json({ message: 'Error checking authentication status' })
  }
}

export { signup, login, logout, verifyToken }
