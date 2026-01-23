import { create } from 'zustand'

export interface Badge {
  id: string
  nom: string
  icon: string
  description: string
  condition: string
  debloque: boolean
}

interface BadgesStore {
  badges: Badge[]
  debloquerBadge: (id: string) => void
}

export const useBadges = create<BadgesStore>((set) => ({
  badges: [
    { id: 'premier-pas', nom: 'Premier pas', icon: '🌟', description: 'Profil complété à 100%', condition: 'Compléter son profil', debloque: true },
    { id: 'organisee', nom: 'Organisée', icon: '📅', description: '10 RDV planifiés', condition: '10 créneaux', debloque: false },
    { id: 'communicante', nom: 'Communicante', icon: '📝', description: '20 notes carnet liaison', condition: '20 notes', debloque: false },
    { id: 'solidaire', nom: 'Solidaire', icon: '🤝', description: '1ère mise en relation', condition: '1 binômage', debloque: false },
    { id: 'pro', nom: 'Pro', icon: '💼', description: '5 devis envoyés', condition: '5 devis', debloque: true },
    { id: 'experte', nom: 'Experte', icon: '🏆', description: '1 an d\'utilisation', condition: '1 an actif', debloque: false },
    { id: 'super-auxiliaire', nom: 'Super Auxiliaire', icon: '⭐', description: '5 témoignages positifs', condition: '5 avis', debloque: false },
  ],
  debloquerBadge: (id) =>
    set((state) => ({
      badges: state.badges.map((b) =>
        b.id === id ? { ...b, debloque: true } : b
      ),
    })),
}))