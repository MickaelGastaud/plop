import { create } from 'zustand'

export interface Beneficiaire {
  id: number
  nom: string
  prenom: string
  telephone: string
  adresse: string
  numeroCesu: string
}

interface BeneficiairesStore {
  beneficiaires: Beneficiaire[]
  ajouter: (b: Omit<Beneficiaire, 'id'>) => void
  supprimer: (id: number) => void
}

const defaultBeneficiaires: Beneficiaire[] = [
  { id: 1, nom: 'Dupont', prenom: 'Marie', telephone: '06 12 34 56 78', adresse: '12 rue des Lilas, Paris', numeroCesu: 'CESU123456' },
  { id: 2, nom: 'Martin', prenom: 'Jean', telephone: '06 98 76 54 32', adresse: '5 avenue Victor Hugo, Lyon', numeroCesu: 'CESU789012' },
]

const getInitialBeneficiaires = (): Beneficiaire[] => {
  const stored = localStorage.getItem('beneficiaires')
  return stored ? JSON.parse(stored) : defaultBeneficiaires
}

export const useBeneficiaires = create<BeneficiairesStore>((set) => ({
  beneficiaires: getInitialBeneficiaires(),
  
  ajouter: (nouveau) =>
    set((state) => {
      const updated = [...state.beneficiaires, { ...nouveau, id: Date.now() }]
      localStorage.setItem('beneficiaires', JSON.stringify(updated))
      return { beneficiaires: updated }
    }),
    
  supprimer: (id) =>
    set((state) => {
      const updated = state.beneficiaires.filter((b) => b.id !== id)
      localStorage.setItem('beneficiaires', JSON.stringify(updated))
      return { beneficiaires: updated }
    }),
}))