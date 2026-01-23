import { create } from 'zustand'

export interface Creneau {
  id: number
  beneficiaireId: number
  date: string
  heureDebut: string
  heureFin: string
  type: string
  notes: string
}

interface CreneauxStore {
  creneaux: Creneau[]
  ajouter: (c: Omit<Creneau, 'id'>) => void
  supprimer: (id: number) => void
}

const defaultCreneaux: Creneau[] = [
  { id: 1, beneficiaireId: 1, date: '2025-01-24', heureDebut: '09:00', heureFin: '12:00', type: 'Aide à la toilette', notes: '' },
  { id: 2, beneficiaireId: 1, date: '2025-01-24', heureDebut: '14:00', heureFin: '16:00', type: 'Courses', notes: 'Marché' },
  { id: 3, beneficiaireId: 2, date: '2025-01-25', heureDebut: '10:00', heureFin: '12:00', type: 'Compagnie', notes: '' },
]

const getInitialCreneaux = (): Creneau[] => {
  const stored = localStorage.getItem('creneaux')
  return stored ? JSON.parse(stored) : defaultCreneaux
}

export const useCreneaux = create<CreneauxStore>((set) => ({
  creneaux: getInitialCreneaux(),
  
  ajouter: (nouveau) =>
    set((state) => {
      const updated = [...state.creneaux, { ...nouveau, id: Date.now() }]
      localStorage.setItem('creneaux', JSON.stringify(updated))
      return { creneaux: updated }
    }),
    
  supprimer: (id) =>
    set((state) => {
      const updated = state.creneaux.filter((c) => c.id !== id)
      localStorage.setItem('creneaux', JSON.stringify(updated))
      return { creneaux: updated }
    }),
}))