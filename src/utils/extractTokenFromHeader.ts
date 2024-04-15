import { Request } from 'express'

type Variant = 'Bearer' | 'Refresh'

function extractTokenFromHeader(req: Request, variant: Variant): string | undefined {
  const [type, token] = req?.headers?.authorization?.split(' ') ?? []
  return type === variant ? token : undefined
}

export { extractTokenFromHeader }
