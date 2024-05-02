import { hash } from 'bcrypt'
import UsersRepository from '@/server/repositories/users.repository'

export default defineEventHandler(async (event) => {
  const { username, password } = await readBody(event)

  if (!username || !password) {
    throw new Error('Invalid data provided')
  }

  const hashedPassword = await hash(password, 7)

  const user = await UsersRepository.create({
    username,
    password: hashedPassword
  })

  return { id: user.id, username: user.username }
})
