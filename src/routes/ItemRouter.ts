import { Router } from 'express'
import { getAllItems } from '../controllers'

const itemRouter = Router()

itemRouter.get('/all', getAllItems)

export { itemRouter }
