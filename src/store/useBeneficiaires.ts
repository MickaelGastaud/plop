import { create } from 'zustand'

export interface ContactUrgence {
  nom: string
  telephone: string
  lien: string // "Fils", "Fille", "Voisin", etc.
}

export interface CreneauHabituel {
  id: number
  jour: string
  heureDebut: string
  heureFin: string
}

export interface Beneficiaire {
  id: number
  
  // Identité
  nom: string
  prenom: string
  dateNaissance: string
  photo: string // URL ou base64
  
  // Contact
  telephone: string
  email: string
  
  // Localisation
  adresse: string
  codePostal: string
  ville: string
  etage: string
  codeAcces: string // Digicode, interphone
  notesAcces: string // Boîte à clef, parking, etc.
  
  // Contact urgence
  contactUrgence: ContactUrgence
  
  // Contrat & Tarification
  numeroCesu: string
  dateDebutContrat: string
  tauxHoraireNet: number // Ce que l'auxiliaire touche
  fraisKm: number // Remboursement km si applicable
  kmAllerRetour: number // Distance domicile auxiliaire <-> bénéficiaire
  
  // Santé (optionnel)
  pathologies: string // Alzheimer, diabète, etc.
  allergies: string
  niveauGir: string // GIR 1 à 6 ou vide
  notesImportantes: string
  
  // Horaires habituels (plusieurs créneaux possibles par jour)
  creneauxHabituels: CreneauHabituel[]
  
  // Statut
  statut: 'actif' | 'pause' | 'termine'
  
  // Méta
  createdAt: string
  updatedAt: string
}

interface BeneficiairesStore {
  beneficiaires: Beneficiaire[]
  ajouter: (b: Omit<Beneficiaire, 'id' | 'createdAt' | 'updatedAt'>) => void
  modifier: (id: number, b: Partial<Beneficiaire>) => void
  supprimer: (id: number) => void
  getById: (id: number) => Beneficiaire | undefined
  getActifs: () => Beneficiaire[]
}

const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']

const defaultBeneficiaires: Beneficiaire[] = [
  {
    id: 1,
    nom: 'Dupont',
    prenom: 'Marie',
    dateNaissance: '1945-03-15',
    photo: '',
    telephone: '06 12 34 56 78',
    email: 'famille.dupont@email.fr',
    adresse: '12 rue des Lilas',
    codePostal: '75012',
    ville: 'Paris',
    etage: '3ème étage droite',
    codeAcces: '1234A',
    notesAcces: 'Boîte à clef sous le pot de fleurs',
    contactUrgence: {
      nom: 'Pierre Dupont',
      telephone: '06 11 22 33 44',
      lien: 'Fils',
    },
    numeroCesu: 'CESU123456',
    dateDebutContrat: '2025-01-15',
    tauxHoraireNet: 12.50,
    fraisKm: 0.52,
    kmAllerRetour: 8,
    pathologies: 'Alzheimer stade léger',
    allergies: '',
    niveauGir: 'GIR 4',
    notesImportantes: 'Aime parler de ses petits-enfants. Éviter les sujets politiques.',
    creneauxHabituels: [
      { id: 1, jour: 'Lundi', heureDebut: '09:00', heureFin: '12:00' },
      { id: 2, jour: 'Lundi', heureDebut: '14:00', heureFin: '17:00' },
      { id: 3, jour: 'Mercredi', heureDebut: '09:00', heureFin: '12:00' },
      { id: 4, jour: 'Vendredi', heureDebut: '14:00', heureFin: '17:00' },
    ],
    statut: 'actif',
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
  },
  {
    id: 2,
    nom: 'Martin',
    prenom: 'Jean',
    dateNaissance: '1938-08-22',
    photo: '',
    telephone: '06 98 76 54 32',
    email: '',
    adresse: '5 avenue Victor Hugo',
    codePostal: '69002',
    ville: 'Lyon',
    etage: 'RDC',
    codeAcces: '',
    notesAcces: 'Sonner 2 fois',
    contactUrgence: {
      nom: 'Anne Martin',
      telephone: '06 55 66 77 88',
      lien: 'Fille',
    },
    numeroCesu: 'CESU789012',
    dateDebutContrat: '2024-09-01',
    tauxHoraireNet: 11.50,
    fraisKm: 0,
    kmAllerRetour: 0,
    pathologies: 'Diabète type 2',
    allergies: 'Pénicilline',
    niveauGir: 'GIR 5',
    notesImportantes: 'Vérifier glycémie avant le repas.',
    creneauxHabituels: [
      { id: 1, jour: 'Lundi', heureDebut: '10:00', heureFin: '12:00' },
      { id: 2, jour: 'Mardi', heureDebut: '10:00', heureFin: '12:00' },
      { id: 3, jour: 'Jeudi', heureDebut: '10:00', heureFin: '12:00' },
    ],
    statut: 'actif',
    createdAt: '2024-09-01T10:00:00Z',
    updatedAt: '2024-09-01T10:00:00Z',
  },
]

const getInitialBeneficiaires = (): Beneficiaire[] => {
  try {
    const stored = localStorage.getItem('cesucare_beneficiaires')
    if (stored) {
      const parsed = JSON.parse(stored)
      // Migration: ajouter les nouveaux champs si manquants
      return parsed.map((b: Partial<Beneficiaire>) => ({
        ...createEmptyBeneficiaire(),
        ...b,
      }))
    }
  } catch (e) {
    console.error('Erreur lecture localStorage:', e)
  }
  return defaultBeneficiaires
}

// Helper pour créer un bénéficiaire vide
export const createEmptyBeneficiaire = (): Omit<Beneficiaire, 'id' | 'createdAt' | 'updatedAt'> => ({
  nom: '',
  prenom: '',
  dateNaissance: '',
  photo: '',
  telephone: '',
  email: '',
  adresse: '',
  codePostal: '',
  ville: '',
  etage: '',
  codeAcces: '',
  notesAcces: '',
  contactUrgence: { nom: '', telephone: '', lien: '' },
  numeroCesu: '',
  dateDebutContrat: new Date().toISOString().split('T')[0],
  tauxHoraireNet: 11.50,
  fraisKm: 0.52,
  kmAllerRetour: 0,
  pathologies: '',
  allergies: '',
  niveauGir: '',
  notesImportantes: '',
  creneauxHabituels: [],
  statut: 'actif',
})

export { JOURS }

export const useBeneficiaires = create<BeneficiairesStore>((set, get) => ({
  beneficiaires: getInitialBeneficiaires(),

  ajouter: (nouveau) =>
    set((state) => {
      const now = new Date().toISOString()
      const newBenef: Beneficiaire = {
        ...nouveau,
        id: Date.now(),
        createdAt: now,
        updatedAt: now,
      }
      const updated = [...state.beneficiaires, newBenef]
      localStorage.setItem('cesucare_beneficiaires', JSON.stringify(updated))
      return { beneficiaires: updated }
    }),

  modifier: (id, modifications) =>
    set((state) => {
      const updated = state.beneficiaires.map((b) =>
        b.id === id
          ? { ...b, ...modifications, updatedAt: new Date().toISOString() }
          : b
      )
      localStorage.setItem('cesucare_beneficiaires', JSON.stringify(updated))
      return { beneficiaires: updated }
    }),

  supprimer: (id) =>
    set((state) => {
      const updated = state.beneficiaires.filter((b) => b.id !== id)
      localStorage.setItem('cesucare_beneficiaires', JSON.stringify(updated))
      return { beneficiaires: updated }
    }),

  getById: (id) => {
    return get().beneficiaires.find((b) => b.id === id)
  },

  getActifs: () => {
    return get().beneficiaires.filter((b) => b.statut === 'actif')
  },
}))