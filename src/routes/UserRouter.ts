import { Router } from 'express'
import { login, signup } from '../controllers'

const userRouter = Router()

userRouter.post('/signup', signup)
userRouter.post('/login', login)
// userRouter.post('/logout', logout)

export { userRouter }
