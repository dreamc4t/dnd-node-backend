// https://www.youtube.com/watch?v=mbsmsi7l3r4&ab_channel=WebDevSimplified

// vi kan köra denna på saved shops för logged in users så att de bara kan se sina egna!
// filtrera shops((shop) => shop.id === user.id) något sånt
import { Response, Request, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
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
export { authenticateToken }
