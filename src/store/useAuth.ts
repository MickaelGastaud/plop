import { create } from 'zustand'

export interface User {
  id: number
  email: string
  prenom: string
  nom: string
}

interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => boolean
  register: (email: string, password: string, prenom: string, nom: string) => boolean
  logout: () => void
}

export const useAuth = create<AuthStore>((set) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  isAuthenticated: !!localStorage.getItem('user'),

  login: (email, password) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    const user = users.find((u: any) => u.email === email && u.password === password)
    
    if (user) {
      const { password: _, ...userWithoutPassword } = user
      localStorage.setItem('user', JSON.stringify(userWithoutPassword))
      set({ user: userWithoutPassword, isAuthenticated: true })
      return true
    }
    return false
  },

  register: (email, password, prenom, nom) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    
    if (users.find((u: any) => u.email === email)) {
      return false // Email déjà utilisé
    }

    const newUser = {
      id: Date.now(),
      email,
      password,
      prenom,
      nom,
    }

    users.push(newUser)
    localStorage.setItem('users', JSON.stringify(users))

    const { password: _, ...userWithoutPassword } = newUser
    localStorage.setItem('user', JSON.stringify(userWithoutPassword))
    set({ user: userWithoutPassword, isAuthenticated: true })
    return true
  },

  logout: () => {
    localStorage.removeItem('user')
    set({ user: null, isAuthenticated: false })
  },
}))