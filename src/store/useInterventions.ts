import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Intervention {
  id: number
  beneficiaireId: number
  date: string // Format YYYY-MM-DD
  heureDebut: string // Format HH:mm
  heureFin: string // Format HH:mm
  type: string
  notes?: string
  statut: 'planifie' | 'effectue' | 'annule'
}

interface InterventionsStore {
  interventions: Intervention[]
  ajouter: (intervention: Omit<Intervention, 'id'>) => void
  modifier: (id: number, data: Partial<Intervention>) => void
  supprimer: (id: number) => void
  getByBeneficiaire: (beneficiaireId: number) => Intervention[]
  getByDate: (date: string) => Intervention[]
}

// Données de démo
const today = new Date().toISOString().split('T')[0]
const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]

const defaultInterventions: Intervention[] = [
  { id: 1, beneficiaireId: 1, date: today, heureDebut: '09:00', heureFin: '12:00', type: 'Aide à domicile', statut: 'planifie' },
  { id: 2, beneficiaireId: 2, date: today, heureDebut: '14:00', heureFin: '16:00', type: 'Compagnie', statut: 'planifie' },
  { id: 3, beneficiaireId: 1, date: tomorrow, heureDebut: '10:00', heureFin: '12:00', type: 'Courses', statut: 'planifie' },
]

export const useInterventions = create<InterventionsStore>()(
  persist(
    (set, get) => ({
      interventions: defaultInterventions,

      ajouter: (intervention) =>
        set((state) => ({
          interventions: [
            ...state.interventions,
            { ...intervention, id: Date.now() }
          ]
        })),

      modifier: (id, data) =>
        set((state) => ({
          interventions: state.interventions.map((i) =>
            i.id === id ? { ...i, ...data } : i
          )
        })),

      supprimer: (id) =>
        set((state) => ({
          interventions: state.interventions.filter((i) => i.id !== id)
        })),

      getByBeneficiaire: (beneficiaireId) => {
        return get().interventions.filter((i) => i.beneficiaireId === beneficiaireId)
      },

      getByDate: (date) => {
        return get().interventions.filter((i) => i.date === date)
      },
    }),
    {
      name: 'cesucare-interventions',
    }
  )
)