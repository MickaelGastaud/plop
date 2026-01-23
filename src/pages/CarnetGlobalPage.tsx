import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNotes, type Note } from '../store/useNotes'
import { useBeneficiaires } from '../store/useBeneficiaires'

export default function CarnetGlobalPage() {
  const { notes } = useNotes()
  const { beneficiaires } = useBeneficiaires()

  const [filtre, setFiltre] = useState<'tous' | 'urgent' | 'important'>('tous')

  const notesFiltrees = notes
    .filter((n) => {
      if (filtre === 'urgent') return n.importance === 'Urgent'
      if (filtre === 'important') return n.importance === 'Important' || n.importance === 'Urgent'
      return true
    })
    .sort((a, b) => b.date.localeCompare(a.date))

  const getBeneficiaire = (id: number) => beneficiaires.find((b) => b.id === id)

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
        <Link to="/dashboard" className="hover:bg-teal-700 p-2 rounded">
          ← Retour
        </Link>
        <h1 className="text-xl font-bold">📝 Carnet de Liaison</h1>
      </header>

      <main className="p-6 max-w-2xl mx-auto">
        {/* Filtres */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFiltre('tous')}
            className={`px-4 py-2 rounded-lg ${
              filtre === 'tous'
                ? 'bg-teal-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Tous
          </button>
          <button
            onClick={() => setFiltre('important')}
            className={`px-4 py-2 rounded-lg ${
              filtre === 'important'
                ? 'bg-orange-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Important
          </button>
          <button
            onClick={() => setFiltre('urgent')}
            className={`px-4 py-2 rounded-lg ${
              filtre === 'urgent'
                ? 'bg-red-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Urgent
          </button>
        </div>

        {/* Stats */}
        <div className="bg-teal-50 p-4 rounded-xl border border-teal-200 mb-6">
          <p className="text-lg font-semibold text-teal-700">
            {notesFiltrees.length} note(s)
          </p>
        </div>

        {/* Liste */}
        {notesFiltrees.length === 0 ? (
          <p className="text-center text-gray-500 py-8">Aucune note</p>
        ) : (
          <div className="space-y-3">
            {notesFiltrees.map((note) => {
              const benef = getBeneficiaire(note.beneficiaireId)
              return (
                <div key={note.id} className="bg-white p-4 rounded-xl shadow">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-lg">
                      {getCategorieIcon(note.categorie)} {note.categorie}
                    </span>
                    <span className={`px-2 py-1 rounded text-sm ${getBadgeColor(note.importance)}`}>
                      {note.importance}
                    </span>
                  </div>
                  <p className="text-gray-700">{note.contenu}</p>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-gray-400 text-sm">📅 {note.date}</p>
                    {benef && (
                      <Link
                        to={`/beneficiaires/${benef.id}`}
                        className="text-sm text-teal-600 hover:underline"
                      >
                        👤 {benef.prenom} {benef.nom}
                      </Link>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}