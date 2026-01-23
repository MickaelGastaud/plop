import { create } from 'zustand'

export interface Note {
  id: number
  beneficiaireId: number
  date: string
  categorie: 'Observation' | 'Incident' | 'Information' | 'Rappel'
  contenu: string
  importance: 'Normal' | 'Important' | 'Urgent'
}

interface NotesStore {
  notes: Note[]
  ajouter: (n: Omit<Note, 'id'>) => void
  supprimer: (id: number) => void
}

const defaultNotes: Note[] = [
  { id: 1, beneficiaireId: 1, date: '2025-01-23', categorie: 'Observation', contenu: 'Bon appétit ce midi.', importance: 'Normal' },
  { id: 2, beneficiaireId: 1, date: '2025-01-22', categorie: 'Rappel', contenu: 'RDV médecin le 25/01 à 10h.', importance: 'Important' },
  { id: 3, beneficiaireId: 2, date: '2025-01-23', categorie: 'Incident', contenu: 'Petite chute sans gravité.', importance: 'Urgent' },
]

const getInitialNotes = (): Note[] => {
  const stored = localStorage.getItem('notes')
  return stored ? JSON.parse(stored) : defaultNotes
}

export const useNotes = create<NotesStore>((set) => ({
  notes: getInitialNotes(),
  
  ajouter: (nouveau) =>
    set((state) => {
      const updated = [{ ...nouveau, id: Date.now() }, ...state.notes]
      localStorage.setItem('notes', JSON.stringify(updated))
      return { notes: updated }
    }),
    
  supprimer: (id) =>
    set((state) => {
      const updated = state.notes.filter((n) => n.id !== id)
      localStorage.setItem('notes', JSON.stringify(updated))
      return { notes: updated }
    }),
}))