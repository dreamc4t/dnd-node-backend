import { Request } from 'express'

function extractTokenFromHeader(req: Request): string | undefined {
  const [type, token] = req?.headers?.authorization?.split(' ') ?? []
  return type === 'Bearer' ? token : undefined

}

export { extractTokenFromHeader }
