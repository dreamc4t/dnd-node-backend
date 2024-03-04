import { Router } from 'express'
import { login, signup, loginGet, signupGet } from '../controllers'

const userRouter = Router()

userRouter.post('/signup', signup)
userRouter.post('/login', login)
userRouter.get('/signup', signupGet)
userRouter.get('/login', loginGet)
// userRouter.post('/logout', logout)

export { userRouter }
