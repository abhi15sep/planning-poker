import { useCallback } from 'react'
import { useLocalStorage } from './useLocalStorage'
import type { User } from '../types'
import { STORAGE_KEYS, getRandomAvatarColor, generateUserId } from '../utils/constants'

const createDefaultUser = (): User => ({
  id: generateUserId(),
  name: '',
  avatarColor: getRandomAvatarColor(),
})

export function useUser() {
  const [user, setUser] = useLocalStorage<User>(
    STORAGE_KEYS.USER,
    createDefaultUser()
  )

  const updateName = useCallback(
    (name: string) => {
      setUser((prev) => ({ ...prev, name }))
    },
    [setUser]
  )

  const updateAvatarColor = useCallback(
    (avatarColor: string) => {
      setUser((prev) => ({ ...prev, avatarColor }))
    },
    [setUser]
  )

  const ensureUserId = useCallback(() => {
    if (!user.id) {
      setUser((prev) => ({ ...prev, id: generateUserId() }))
    }
  }, [user.id, setUser])

  const isNameSet = Boolean(user.name && user.name.trim())

  return {
    user,
    updateName,
    updateAvatarColor,
    ensureUserId,
    isNameSet,
  }
}
