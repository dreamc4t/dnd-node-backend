import { Request } from 'express'

function extractRefreshTokenFromHeader(req: Request): string | undefined {
  const [type, token] = req?.headers?.authorization?.split(' ') ?? []
  return type === 'Refresh' ? token : undefined
}

export { extractRefreshTokenFromHeader }
