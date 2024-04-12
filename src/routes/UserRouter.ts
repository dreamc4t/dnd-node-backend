import { Router } from 'express'
import { userInfo } from '../controllers'
import { requireAccessToken } from '../middleware'

const userRouter = Router()

userRouter.get('/:id', requireAccessToken, userInfo)

export { userRouter }
