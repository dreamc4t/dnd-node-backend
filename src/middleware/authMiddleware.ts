import { Response, Request, NextFunction } from 'express'
import jwt, { JwtPayload, VerifyErrors } from 'jsonwebtoken'
import { User } from '../models'

const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt

  //check jwt exists & is verified

  if (token) {
    jwt.verify(
      token,
      'TODO SUPER SECRET',
      (err: VerifyErrors | null, decodedToken?: string | JwtPayload) => {
        if (err) {
          console.log(err.message)
          res.redirect('/')
        } else {
          console.log(decodedToken)
          next()
        }
      },
    )
  } else {
    res.redirect('/player')
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
function authenticateToken(req: Request, res: Response, next: NextFunction) {
  console.log('hey hey ')

  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (!token) return res.sendStatus(401)
  if (!process.env.ACCESS_TOKEN_SECRET) throw new Error('Missing access token secret')

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    //@ts-expect-error fix another time
    req.user = user
    next()
  })
}
export { authenticateToken, requireAuth, checkUser }
