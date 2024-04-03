import { Response, Request, NextFunction } from 'express'
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken'
import { User } from '../models'

const requireAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  let jwtToken = req.cookies.jwt

  console.log(req.headers.authorization)

  if (!jwtToken && req.headers.authorization) {
    // Split the Authorization header to remove the 'Bearer' prefix
    const parts = req.headers.authorization.split(' ')

    if (parts.length === 2 && parts[0] === 'Bearer') {
      jwtToken = parts[1]
    }
  }
  if (!jwtToken) {
    return res.status(401).json({ message: 'No token provided' })
  }

  const secret = process.env.JWT_SECRET
  if (!secret) {
    console.error('Missing jwt secret')
    return res.status(500).json({ message: 'Server configuration error' })
  }

  //check jwt exists & is verified
  // check if token exists & is verified
  if (jwtToken) {
    console.log('token exists!')

    jwt.verify(jwtToken, secret, (err: VerifyErrors | null, decodedToken?: string | JwtPayload) => {
      if (err) {
        console.log('error trying to verify jwt', err)
        res.status(401).json({ message: 'Unauthorized: Invalid token' })
      } else {
        console.log('Here is the decoded token:', decodedToken)

        next() //this takes us to next step after middleware
      }
    })
  } else {
    console.log('error, no token to use for requireAuthenticated function')
    res.status(401).json({ message: 'Unauthorized: No token provided' })
  }
}

// DENNA körs på varje verify just nu, spana in

const checkUser = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt
  if (token) {
    jwt.verify(
      token,
      'TODO SUPER SECRET',
      async (err: VerifyErrors | null, decodedToken?: string | JwtPayload) => {
        if (err) {
          console.log(err.message)
          res.locals.user = null
          next()
        } else {
          // console.log(decodedToken)
          //@ts-expect-error fix another time
          const user = await User.findById(decodedToken?.id)
          res.locals.user = user
          next()
        }
      },
    )
  } else {
    res.locals.user = null
    next()
  }
}

// https://www.youtube.com/watch?v=mbsmsi7l3r4&ab_channel=WebDevSimplified

// vi kan köra denna på saved shops för logged in users så att de bara kan se sina egna!
// filtrera shops((shop) => shop.id === user.id) något sånt
// function authenticateToken(req: Request, res: Response, next: NextFunction) {
//   console.log('hey hey ')

//   const authHeader = req.headers['authorization']
//   const token = authHeader && authHeader.split(' ')[1]
//   if (!token) return res.sendStatus(401)
//   if (!process.env.ACCESS_TOKEN_SECRET) throw new Error('Missing access token secret')

//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
//     if (err) return res.sendStatus(403)
//     //@ts-expect-error fix another time
//     req.user = user
//     next()
//   })
// }
export { requireAuthenticated, checkUser }
