import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useBeneficiaires } from '../store/useBeneficiaires'
import { useNotes, type Note } from '../store/useNotes'

export default function CarnetPage() {
  const { id } = useParams()
  const beneficiaireId = Number(id)
  const { beneficiaires } = useBeneficiaires()
  const { notes, ajouter } = useNotes()
  
  const beneficiaire = beneficiaires.find((b) => b.id === beneficiaireId)
  const notesBeneficiaire = notes.filter((n) => n.beneficiaireId === beneficiaireId)

  const [showForm, setShowForm] = useState(false)
  const [newNote, setNewNote] = useState({
    categorie: 'Observation' as Note['categorie'],
    contenu: '',
    importance: 'Normal' as Note['importance'],
  })

  if (!beneficiaire) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Bénéficiaire introuvable</p>
      </div>
    )
  }

  const handleAjouter = (e: React.FormEvent) => {
    e.preventDefault()
    const today = new Date().toISOString().split('T')[0]
    ajouter({ ...newNote, beneficiaireId, date: today })
    setNewNote({ categorie: 'Observation', contenu: '', importance: 'Normal' })
    setShowForm(false)
  }

  const getBadgeColor = (importance: Note['importance']) => {
    switch (importance) {
      case 'Urgent': return 'bg-red-100 text-red-700'
      case 'Important': return 'bg-orange-100 text-orange-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getCategorieIcon = (categorie: Note['categorie']) => {
    switch (categorie) {
      case 'Observation': return '👁️'
      case 'Incident': return '⚠️'
      case 'Information': return 'ℹ️'
      case 'Rappel': return '🔔'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-teal-600 text-white p-4 flex items-center gap-4">
        <Link to={`/beneficiaires/${id}`} className="hover:bg-teal-700 p-2 rounded">
          ← Retour
        </Link>
        <h1 className="text-xl font-bold">📝 Carnet de {beneficiaire.prenom}</h1>
      </header>

      <main className="p-6 max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">
            {notesBeneficiaire.length} note(s)
          </h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition"
          >
            + Ajouter
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleAjouter} className="bg-white p-4 rounded-xl shadow mb-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                <select
                  value={newNote.categorie}
                  onChange={(e) => setNewNote({ ...newNote, categorie: e.target.value as Note['categorie'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="Observation">👁️ Observation</option>
                  <option value="Incident">⚠️ Incident</option>
                  <option value="Information">ℹ️ Information</option>
                  <option value="Rappel">🔔 Rappel</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Importance</label>
                <select
                  value={newNote.importance}
                  onChange={(e) => setNewNote({ ...newNote, importance: e.target.value as Note['importance'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="Normal">Normal</option>
                  <option value="Important">Important</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contenu</label>
              <textarea
                value={newNote.contenu}
                onChange={(e) => setNewNote({ ...newNote, contenu: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                rows={3}
                placeholder="Décrivez l'observation, l'incident..."
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-2 rounded-lg hover:bg-teal-700 transition"
            >
              Enregistrer
            </button>
          </form>
        )}

        <div className="space-y-3">
          {notesBeneficiaire.map((note) => (
            <div key={note.id} className="bg-white p-4 rounded-xl shadow">
              <div className="flex justify-between items-start mb-2">
                <span className="text-lg">{getCategorieIcon(note.categorie)} {note.categorie}</span>
                <span className={`px-2 py-1 rounded text-sm ${getBadgeColor(note.importance)}`}>
                  {note.importance}
                </span>
              </div>
              <p className="text-gray-700">{note.contenu}</p>
              <p className="text-gray-400 text-sm mt-2">📅 {note.date}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}