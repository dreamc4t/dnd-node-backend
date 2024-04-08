import { User } from '../models'
import { Response, Request } from 'express'

const userInfo = async (req: Request, res: Response) => {
  const { id } = req.params

  try {
    const user = await User.findById(id).select('-password')

    if (user) {
      res.status(200).json(user)
    } else {
      res.status(404).json({ message: 'User not found' })
    }
  } catch (e) {
    const error = e as Error
    res.status(500).json({ message: 'Error retrieving user information', error: error.message })
  }
}

export { userInfo }
