import { JwtPayload } from 'jsonwebtoken'
import { Request } from 'express'

interface ReqWithUserId extends Request {
  userId?: string | JwtPayload
}

export type { ReqWithUserId }
