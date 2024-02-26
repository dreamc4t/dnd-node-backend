import { Router } from 'express'
import { signup } from '../controllers'

const userRouter = Router()

userRouter.post('/signup', signup)
// userRouter.post('/login', tmp)
// userRouter.post('/logout', tmp)
// userRouter.post('/accessToken', tmp)
// userRouter.post('/refreshToken', tmp)

// userRouter.post('/register', async (req: Request, res: Response) => {
//     try {

//     } catch (error) {

//     }
// })

export { userRouter }
