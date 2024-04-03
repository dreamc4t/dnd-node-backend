import { Request } from 'express'

function getJwtFromReq(req: Request): string | undefined {
  let jwtToken = req.cookies.jwt

  if (!jwtToken && req.headers.authorization) {
    const parts = req.headers.authorization.split(' ')
    if (parts.length === 2 && parts[0] === 'Bearer') {
      jwtToken = parts[1]
    }
  }
  return jwtToken
}

export { getJwtFromReq }
