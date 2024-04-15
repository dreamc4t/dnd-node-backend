import { Response, NextFunction } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
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
