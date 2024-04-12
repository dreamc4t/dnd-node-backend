import { Router } from 'express'
import { login, signup, refreshToken } from '../controllers'
import { requireRefreshToken } from '../middleware/authMiddleware'

const authRouter = Router()

authRouter.post('/signup', signup)
authRouter.post('/login', login)
authRouter.get('/refresh', requireRefreshToken, refreshToken)

export { authRouter }
