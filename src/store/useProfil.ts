import { create } from 'zustand'

export interface Profil {
  prenom: string
  nom: string
  photo: string
  bio: string
  telephone: string
  email: string
  zone: string
  services: string[]
  tarifMin: number
  tarifMax: number
  experience: number
  diplomes: string
}

interface ProfilStore {
  profil: Profil
  updateProfil: (data: Partial<Profil>) => void
}

const defaultProfil: Profil = {
  prenom: 'Marie',
  nom: 'Durand',
  photo: '',
  bio: 'Auxiliaire de vie passionnée avec 5 ans d\'expérience. Je propose un accompagnement bienveillant et personnalisé.',
  telephone: '06 12 34 56 78',
  email: 'marie.durand@email.com',
  zone: 'Paris et proche banlieue (20km)',
  services: ['Aide à la toilette', 'Préparation des repas', 'Compagnie'],
  tarifMin: 14,
  tarifMax: 18,
  experience: 5,
  diplomes: 'DEAES (Diplôme d\'État d\'Accompagnant Éducatif et Social)',
}

const getInitialProfil = (): Profil => {
  const stored = localStorage.getItem('profil')
  return stored ? JSON.parse(stored) : defaultProfil
}

export const useProfil = create<ProfilStore>((set) => ({
  profil: getInitialProfil(),
  
  updateProfil: (data) =>
    set((state) => {
      const updated = { ...state.profil, ...data }
      localStorage.setItem('profil', JSON.stringify(updated))
      return { profil: updated }
    }),
}))