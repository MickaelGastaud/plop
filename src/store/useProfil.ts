import { create } from 'zustand'

export interface Disponibilite {
  jour: string
  matin: boolean
  apresMidi: boolean
  soir: boolean
  nuit: boolean
}

export interface ProfilUtilisateur {
  // Identité
  prenom: string
  nom: string
  photo: string
  
  // Contact
  telephone: string
  email: string
  adresse: string
  ville: string
  codePostal: string
  
  // Infos administratives
  dateNaissance: string
  numeroSecu: string
  numeroCesu: string
  
  // Expérience & Formation
  experience: string
  diplomes: string[]
  autresDiplomes: string
  
  // Activité
  typeActivite: string[]
  salaireMinimum: number
  
  // Disponibilités
  disponibilites: Disponibilite[]
  
  // Zone & Tarifs (pour le profil public)
  zone: string
  tarifMin: number
  tarifMax: number
  bio: string
  services: string[]
  
  // Légal
  cgvAcceptees: boolean
  rgpdAcceptee: boolean
  dateAcceptation: string
  
  // État
  onboardingComplete: boolean
}

interface ProfilStore {
  profil: ProfilUtilisateur
  updateProfil: (data: Partial<ProfilUtilisateur>) => void
  completeOnboarding: () => void
  resetProfil: () => void
}

const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']

const defaultProfil: ProfilUtilisateur = {
  // Identité
  prenom: '',
  nom: '',
  photo: '',
  
  // Contact
  telephone: '',
  email: '',
  adresse: '',
  ville: '',
  codePostal: '',
  
  // Infos administratives
  dateNaissance: '',
  numeroSecu: '',
  numeroCesu: '',
  
  // Expérience & Formation
  experience: '',
  diplomes: [],
  autresDiplomes: '',
  
  // Activité
  typeActivite: [],
  salaireMinimum: 12,
  
  // Disponibilités
  disponibilites: JOURS.map(jour => ({
    jour,
    matin: false,
    apresMidi: false,
    soir: false,
    nuit: false
  })),
  
  // Zone & Tarifs
  zone: '',
  tarifMin: 0,
  tarifMax: 0,
  bio: '',
  services: [],
  
  // Légal
  cgvAcceptees: false,
  rgpdAcceptee: false,
  dateAcceptation: '',
  
  // État
  onboardingComplete: false,
}

const getInitialProfil = (): ProfilUtilisateur => {
  const stored = localStorage.getItem('cesucare_profil')
  if (stored) {
    try {
      return { ...defaultProfil, ...JSON.parse(stored) }
    } catch {
      return defaultProfil
    }
  }
  return defaultProfil
}

export const useProfil = create<ProfilStore>((set) => ({
  profil: getInitialProfil(),
  
  updateProfil: (data) =>
    set((state) => {
      const updated = { ...state.profil, ...data }
      localStorage.setItem('cesucare_profil', JSON.stringify(updated))
      return { profil: updated }
    }),
    
  completeOnboarding: () =>
    set((state) => {
      const updated = { ...state.profil, onboardingComplete: true }
      localStorage.setItem('cesucare_profil', JSON.stringify(updated))
      return { profil: updated }
    }),
    
  resetProfil: () => {
    localStorage.removeItem('cesucare_profil')
    set({ profil: defaultProfil })
  },
}))