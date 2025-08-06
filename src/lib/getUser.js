import { cookies } from 'next/headers'
import { verifyToken, getUserById } from './auth'

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return null
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return null
    }

    const user = await getUserById(decoded.userId)
    return user
  } catch (error) {
    console.error('Erro ao obter usuário atual:', error)
    return null
  }
} 