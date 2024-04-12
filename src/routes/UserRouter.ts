import { Router } from 'express'
import { login, signup,  userInfo, refreshToken } from '../controllers'
import { requireAccessToken } from '../middleware'
import { requireRefreshToken } from '../middleware/authMiddleware'

const userRouter = Router()

userRouter.post('/signup', signup)
userRouter.post('/login', login)
userRouter.get('/refresh', requireRefreshToken, refreshToken)
userRouter.get('/:id', requireAccessToken, userInfo)

export { userRouter }
