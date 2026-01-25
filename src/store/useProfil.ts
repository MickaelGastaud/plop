import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Disponibilite {
  jour: string
  matin: boolean
  apresMidi: boolean
  soir: boolean
  nuit: boolean
}

interface ProfilUtilisateur {
  // Identité
  prenom: string
  nom: string
  nomUsage: string
  photo: string
  
  // Coordonnées
  telephone: string
  email: string
  adresse: string
  ville: string
  codePostal: string
  
  // Infos administratives
  numeroSecu: string
  numeroCesu: string
  dateNaissance: string
  
  // Diplômes & formations
  diplomes: string[]
  autresDiplomes: string
  
  // Profil pro
  experience: string
  typeActivite: string[]
  salaireMinimum: number
  
  // Disponibilités
  disponibilites: Disponibilite[]
  
  // Légal
  cgvAcceptees: boolean
  rgpdAcceptee: boolean
  dateAcceptation: string
  
  // Onboarding
  onboardingComplete: boolean
}

interface ProfilStore {
  profil: ProfilUtilisateur
  updateProfil: (data: Partial<ProfilUtilisateur>) => void
  completeOnboarding: () => void
  resetProfil: () => void
}

const defaultProfil: ProfilUtilisateur = {
  prenom: '',
  nom: '',
  nomUsage: '',
  photo: '',
  telephone: '',
  email: '',
  adresse: '',
  ville: '',
  codePostal: '',
  numeroSecu: '',
  numeroCesu: '',
  dateNaissance: '',
  diplomes: [],
  autresDiplomes: '',
  experience: '',
  typeActivite: [],
  salaireMinimum: 12,
  disponibilites: [
    { jour: 'Lundi', matin: false, apresMidi: false, soir: false, nuit: false },
    { jour: 'Mardi', matin: false, apresMidi: false, soir: false, nuit: false },
    { jour: 'Mercredi', matin: false, apresMidi: false, soir: false, nuit: false },
    { jour: 'Jeudi', matin: false, apresMidi: false, soir: false, nuit: false },
    { jour: 'Vendredi', matin: false, apresMidi: false, soir: false, nuit: false },
    { jour: 'Samedi', matin: false, apresMidi: false, soir: false, nuit: false },
    { jour: 'Dimanche', matin: false, apresMidi: false, soir: false, nuit: false },
  ],
  cgvAcceptees: false,
  rgpdAcceptee: false,
  dateAcceptation: '',
  onboardingComplete: false,
}

export const useProfil = create<ProfilStore>()(
  persist(
    (set) => ({
      profil: defaultProfil,
      updateProfil: (data) =>
        set((state) => ({
          profil: { ...state.profil, ...data },
        })),
      completeOnboarding: () =>
        set((state) => ({
          profil: { ...state.profil, onboardingComplete: true },
        })),
      resetProfil: () => set({ profil: defaultProfil }),
    }),
    {
      name: 'cesucare-profil',
    }
  )
)