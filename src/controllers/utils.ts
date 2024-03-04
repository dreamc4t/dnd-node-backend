import bcrypt from 'bcrypt'

const verifyPassword = async (incomingPassword: string, hashedPassword: string) => {
  const match = await bcrypt.compare(incomingPassword, hashedPassword)
  if (!match) throw new Error('Wrong password')
  return match
}

export { verifyPassword }
