import { Response, Request, NextFunction } from 'express'
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken'
import { User } from '../models'
import { extractRefreshTokenFromHeader, extractTokenFromHeader } from '../utils'
import { ReqWithUserId } from '../interfaces'

interface TokenPayload extends JwtPayload {
  id: string
}

const requireRefreshToken = async (req: ReqWithUserId, res: Response, next: NextFunction) => {
  const refreshToken = extractRefreshTokenFromHeader(req)
  if (!refreshToken) return res.status(401).json({ message: 'No refresh token provided' })

  const secret = process.env.REFRESH_TOKEN_SECRET
  if (!secret) return res.status(500).json({ message: 'No refresh token secret found' })

  try {
    const decodedToken = jwt.verify(refreshToken, secret) as TokenPayload

    if (!decodedToken?.id) throw new Error('Invalid token: ID not found')

    req.userId = decodedToken.id
    next()
  } catch (error) {
    console.log('error trying to verify jwt in requireRefreshToken', error)
    res.status(401).json({ message: 'Unauthorized: Invalid token' })
  }
}

const requireAccessToken = (req: ReqWithUserId, res: Response, next: NextFunction) => {
  const jwtToken = extractTokenFromHeader(req)
  if (!jwtToken) {
    console.log('No access token found in headers, requireAccessToken')
    return res.status(401).json({ message: 'No access token provided' })
  }

  const secret = process.env.ACCESS_TOKEN_SECRET
  if (!secret) return res.status(500).json({ message: 'No Access token secret found' })

  try {
    const decodedToken = jwt.verify(jwtToken, secret) as TokenPayload
    if (!decodedToken?.id) throw new Error('Invalid token: ID not found')
    req.userId = decodedToken.id
    next()
  } catch (error) {
    console.log('error trying to verify jwt in requireAccessToken', error)
    res.status(401).json({ message: 'Unauthorized: Invalid token' })
  }
}

export { requireAccessToken, requireRefreshToken }

// const requireAuthenticated = (req: Request, res: Response, next: NextFunction) => {
//   let jwtToken = req.cookies.jwt

//   if (!jwtToken && req.headers.authorization) {
//     // Split the Authorization header to remove the 'Bearer' prefix
//     const parts = req.headers.authorization.split(' ')

//     if (parts.length === 2 && parts[0] === 'Bearer') {
//       jwtToken = parts[1]
//     }
//   }
//   if (!jwtToken) {
//     return res.status(401).json({ message: 'No token provided' })
//   }

//   const secret = process.env.ACCESS_TOKEN_SECRET
//   if (!secret) {
//     console.error('Missing jwt secret')
//     return res.status(500).json({ message: 'Server configuration error' })
//   }

//   //check jwt exists & is verified
//   // check if token exists & is verified
//   if (jwtToken) {
//     console.log('token exists!')

//     jwt.verify(jwtToken, secret, (err: VerifyErrors | null, decodedToken?: string | JwtPayload) => {
//       if (err) {
//         console.log('error trying to verify jwt in requireAuthenticated', err)
//         res.status(401).json({ message: 'Unauthorized: Invalid token' })
//       } else {
//         console.log('Here is the decoded token:', decodedToken)

//         next() //this takes us to next step after middleware
//       }
//     })
//   } else {
//     console.log('error, no token to use for requireAuthenticated function')
//     res.status(401).json({ message: 'Unauthorized: No token provided' })
//   }
// }
