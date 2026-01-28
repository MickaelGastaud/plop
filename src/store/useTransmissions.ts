import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Types pour les évaluations rapides (smileys)
export type Evaluation = 'bien' | 'moyen' | 'mauvais' | null

export interface Transmission {
  id: number
  beneficiaireId: number
  date: string // Format YYYY-MM-DD
  heure: string // Format HH:mm
  
  // Évaluations rapides (smileys)
  humeur: Evaluation
  appetit: Evaluation
  hydratation: Evaluation
  mobilite: Evaluation
  sommeil: Evaluation
  
  // Tâches effectuées (checkboxes)
  taches: string[]
  
  // Notes textuelles
  observations: string
  instructionsSuivantes: string
  changements: string
  
  // Méta
  createdAt: string
}

interface TransmissionsStore {
  transmissions: Transmission[]
  ajouter: (transmission: Omit<Transmission, 'id' | 'createdAt'>) => void
  modifier: (id: number, data: Partial<Transmission>) => void
  supprimer: (id: number) => void
  getByBeneficiaire: (beneficiaireId: number) => Transmission[]
  getByDate: (date: string) => Transmission[]
  getLastByBeneficiaire: (beneficiaireId: number) => Transmission | undefined
}

// Données de démo
const today = new Date().toISOString().split('T')[0]
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

const defaultTransmissions: Transmission[] = [
  {
    id: 1,
    beneficiaireId: 1,
    date: yesterday,
    heure: '12:00',
    humeur: 'bien',
    appetit: 'bien',
    hydratation: 'moyen',
    mobilite: 'bien',
    sommeil: 'bien',
    taches: ['Toilette', 'Repas', 'Ménage'],
    observations: 'Très bonne journée, Marie était de bonne humeur.',
    instructionsSuivantes: 'Penser à lui rappeler son RDV médecin jeudi.',
    changements: '',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 2,
    beneficiaireId: 1,
    date: today,
    heure: '12:30',
    humeur: 'moyen',
    appetit: 'mauvais',
    hydratation: 'moyen',
    mobilite: 'bien',
    sommeil: 'mauvais',
    taches: ['Toilette', 'Repas'],
    observations: 'Marie a peu mangé ce midi, dit ne pas avoir faim.',
    instructionsSuivantes: 'Surveiller l\'appétit, proposer des petites collations.',
    changements: 'A mal dormi cette nuit (dit avoir eu des douleurs).',
    createdAt: new Date().toISOString(),
  },
]

export const useTransmissions = create<TransmissionsStore>()(
  persist(
    (set, get) => ({
      transmissions: defaultTransmissions,

      ajouter: (transmission) =>
        set((state) => ({
          transmissions: [
            ...state.transmissions,
            {
              ...transmission,
              id: Date.now(),
              createdAt: new Date().toISOString(),
            }
          ]
        })),

      modifier: (id, data) =>
        set((state) => ({
          transmissions: state.transmissions.map((t) =>
            t.id === id ? { ...t, ...data } : t
          )
        })),

      supprimer: (id) =>
        set((state) => ({
          transmissions: state.transmissions.filter((t) => t.id !== id)
        })),

      getByBeneficiaire: (beneficiaireId) => {
        return get().transmissions
          .filter((t) => t.beneficiaireId === beneficiaireId)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      },

      getByDate: (date) => {
        return get().transmissions.filter((t) => t.date === date)
      },

      getLastByBeneficiaire: (beneficiaireId) => {
        const transmissions = get().transmissions
          .filter((t) => t.beneficiaireId === beneficiaireId)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        return transmissions[0]
      },
    }),
    {
      name: 'cesucare-transmissions',
    }
  )
)