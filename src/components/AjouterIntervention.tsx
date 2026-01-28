import { useState } from 'react'
import { useBeneficiaires } from '../store/useBeneficiaires'
import { useInterventions } from '../store/useInterventions'

interface Props {
  date: string // Format YYYY-MM-DD
  onClose: () => void
  creneauSuggere?: { debut: string; fin: string } | null
}

const TYPES_INTERVENTION = [
  'Aide à domicile',
  'Aide à la toilette',
  'Préparation repas',
  'Courses',
  'Ménage',
  'Compagnie',
  'Accompagnement sortie',
  'Garde de nuit',
  'Autre',
]

export default function AjouterIntervention({ date, onClose, creneauSuggere }: Props) {
  const { beneficiaires } = useBeneficiaires()
  const { ajouter } = useInterventions()

  const [form, setForm] = useState({
    beneficiaireId: beneficiaires.length > 0 ? beneficiaires[0].id : 0,
    heureDebut: creneauSuggere?.debut || '09:00',
    heureFin: creneauSuggere?.fin || '12:00',
    type: TYPES_INTERVENTION[0],
    notes: '',
  })

  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validations
    if (!form.beneficiaireId) {
      setError('Sélectionne un bénéficiaire')
      return
    }

    if (form.heureDebut >= form.heureFin) {
      setError("L'heure de fin doit être après l'heure de début")
      return
    }

    // Ajouter l'intervention
    ajouter({
      beneficiaireId: form.beneficiaireId,
      date,
      heureDebut: form.heureDebut,
      heureFin: form.heureFin,
      type: form.type,
      notes: form.notes,
      statut: 'planifie',
    })

    onClose()
  }

  // Formater la date pour l'affichage
  const dateObj = new Date(date + 'T12:00:00')
  const dateFormatee = dateObj.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50">
      <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">➕ Nouvelle intervention</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
          >
            ✕
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Date affichée */}
          <div className="bg-teal-50 rounded-xl p-3 text-center">
            <p className="text-sm text-teal-600">📅 {dateFormatee}</p>
          </div>

          {/* Bénéficiaire */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bénéficiaire *
            </label>
            {beneficiaires.length > 0 ? (
              <select
                value={form.beneficiaireId}
                onChange={(e) => setForm({ ...form, beneficiaireId: Number(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none bg-white"
              >
                {beneficiaires.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.prenom} {b.nom}
                  </option>
                ))}
              </select>
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800">
                ⚠️ Aucun bénéficiaire. Ajoute-en un d'abord !
              </div>
            )}
          </div>

          {/* Horaires */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Début *
              </label>
              <input
                type="time"
                value={form.heureDebut}
                onChange={(e) => setForm({ ...form, heureDebut: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fin *
              </label>
              <input
                type="time"
                value={form.heureFin}
                onChange={(e) => setForm({ ...form, heureFin: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Durée calculée */}
          <div className="text-center text-sm text-gray-500">
            Durée : {(() => {
              const [hDebut, mDebut] = form.heureDebut.split(':').map(Number)
              const [hFin, mFin] = form.heureFin.split(':').map(Number)
              const minutes = (hFin * 60 + mFin) - (hDebut * 60 + mDebut)
              if (minutes <= 0) return '—'
              const h = Math.floor(minutes / 60)
              const m = minutes % 60
              return h > 0 ? `${h}h${m > 0 ? m.toString().padStart(2, '0') : ''}` : `${m} min`
            })()}
          </div>

          {/* Type d'intervention */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type d'intervention *
            </label>
            <div className="flex flex-wrap gap-2">
              {TYPES_INTERVENTION.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setForm({ ...form, type })}
                  className={`px-3 py-2 rounded-lg text-sm border transition ${
                    form.type === type
                      ? 'bg-teal-600 text-white border-teal-600'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (optionnel)
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Ex: Apporter les médicaments, préparer le déjeuner..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none resize-none"
            />
          </div>

          {/* Erreur */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Boutons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={beneficiaires.length === 0}
              className="flex-1 py-3 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}