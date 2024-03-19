import { Router } from 'express'
import { login, signup, logout, verifyToken } from '../controllers'

const userRouter = Router()

userRouter.post('/signup', signup)
userRouter.post('/login', login)
userRouter.get('/logout', logout)
userRouter.get('/verify', verifyToken)

export { userRouter }
