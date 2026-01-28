import { useState } from 'react'
import { useBeneficiaires } from '../store/useBeneficiaires'
import { useTransmissions } from '../store/useTransmissions'
import type { Evaluation } from '../store/useTransmissions'

interface Props {
  beneficiaireId?: number
  onClose: () => void
}

// Tâches courantes
const TACHES_COURANTES = [
  { id: 'toilette', label: '🚿 Toilette' },
  { id: 'habillage', label: '👕 Habillage' },
  { id: 'repas', label: '🍽️ Repas' },
  { id: 'medicaments', label: '💊 Médicaments' },
  { id: 'menage', label: '🧹 Ménage' },
  { id: 'courses', label: '🛒 Courses' },
  { id: 'linge', label: '👔 Linge' },
  { id: 'promenade', label: '🚶 Promenade' },
  { id: 'compagnie', label: '💬 Compagnie' },
  { id: 'rdv', label: '📅 Accompagnement RDV' },
]

// Composant pour sélectionner un smiley
function SmileySelector({
  label,
  value,
  onChange,
  icons,
}: {
  label: string
  value: Evaluation
  onChange: (val: Evaluation) => void
  icons: { bien: string; moyen: string; mauvais: string }
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-gray-700">{label}</span>
      <div className="flex gap-1">
        {(['bien', 'moyen', 'mauvais'] as const).map((niveau) => (
          <button
            key={niveau}
            type="button"
            onClick={() => onChange(value === niveau ? null : niveau)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition ${
              value === niveau
                ? niveau === 'bien'
                  ? 'bg-green-100 ring-2 ring-green-500'
                  : niveau === 'moyen'
                  ? 'bg-amber-100 ring-2 ring-amber-500'
                  : 'bg-red-100 ring-2 ring-red-500'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {icons[niveau]}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function AjouterTransmission({ beneficiaireId, onClose }: Props) {
  const { beneficiaires } = useBeneficiaires()
  const { ajouter } = useTransmissions()

  const now = new Date()
  const [form, setForm] = useState({
    beneficiaireId: beneficiaireId || (beneficiaires.length > 0 ? beneficiaires[0].id : 0),
    date: now.toISOString().split('T')[0],
    heure: now.toTimeString().slice(0, 5),
    humeur: null as Evaluation,
    appetit: null as Evaluation,
    hydratation: null as Evaluation,
    mobilite: null as Evaluation,
    sommeil: null as Evaluation,
    taches: [] as string[],
    observations: '',
    instructionsSuivantes: '',
    changements: '',
  })

  const [step, setStep] = useState(1) // 1: Smileys, 2: Tâches, 3: Notes

  const toggleTache = (id: string) => {
    setForm(prev => ({
      ...prev,
      taches: prev.taches.includes(id)
        ? prev.taches.filter(t => t !== id)
        : [...prev.taches, id]
    }))
  }

  const handleSubmit = () => {
    ajouter(form)
    onClose()
  }

  const beneficiaire = beneficiaires.find(b => b.id === form.beneficiaireId)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50">
      <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">📓 Nouvelle transmission</h2>
            {beneficiaire && (
              <p className="text-sm text-gray-500">Pour {beneficiaire.prenom} {beneficiaire.nom}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
          >
            ✕
          </button>
        </div>

        {/* Progress bar */}
        <div className="flex gap-1 px-4 pt-3">
          {[1, 2, 3].map(s => (
            <div
              key={s}
              className={`flex-1 h-1 rounded-full transition ${
                s <= step ? 'bg-teal-500' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        {/* Contenu scrollable */}
        <div className="flex-1 overflow-y-auto p-4">
          
          {/* Étape 1: Évaluations rapides (Smileys) */}
          {step === 1 && (
            <div className="space-y-2">
              <div className="text-center mb-4">
                <span className="text-4xl">😊</span>
                <h3 className="font-semibold text-gray-900 mt-2">Comment va {beneficiaire?.prenom || 'le bénéficiaire'} ?</h3>
                <p className="text-sm text-gray-500">Évalue rapidement son état</p>
              </div>

              {/* Sélecteur de bénéficiaire si non pré-sélectionné */}
              {!beneficiaireId && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bénéficiaire</label>
                  <select
                    value={form.beneficiaireId}
                    onChange={(e) => setForm({ ...form, beneficiaireId: Number(e.target.value) })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white"
                  >
                    {beneficiaires.map(b => (
                      <option key={b.id} value={b.id}>{b.prenom} {b.nom}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="bg-gray-50 rounded-2xl p-4 space-y-1 divide-y divide-gray-200">
                <SmileySelector
                  label="😊 Humeur"
                  value={form.humeur}
                  onChange={(val) => setForm({ ...form, humeur: val })}
                  icons={{ bien: '😊', moyen: '😐', mauvais: '😔' }}
                />
                <SmileySelector
                  label="🍽️ Appétit"
                  value={form.appetit}
                  onChange={(val) => setForm({ ...form, appetit: val })}
                  icons={{ bien: '😋', moyen: '😕', mauvais: '🤢' }}
                />
                <SmileySelector
                  label="💧 Hydratation"
                  value={form.hydratation}
                  onChange={(val) => setForm({ ...form, hydratation: val })}
                  icons={{ bien: '💧', moyen: '💦', mauvais: '🏜️' }}
                />
                <SmileySelector
                  label="🚶 Mobilité"
                  value={form.mobilite}
                  onChange={(val) => setForm({ ...form, mobilite: val })}
                  icons={{ bien: '🚶', moyen: '🦯', mauvais: '🛋️' }}
                />
                <SmileySelector
                  label="😴 Sommeil (nuit précédente)"
                  value={form.sommeil}
                  onChange={(val) => setForm({ ...form, sommeil: val })}
                  icons={{ bien: '😴', moyen: '🥱', mauvais: '😵' }}
                />
              </div>
            </div>
          )}

          {/* Étape 2: Tâches effectuées */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <span className="text-4xl">✅</span>
                <h3 className="font-semibold text-gray-900 mt-2">Qu'as-tu fait ?</h3>
                <p className="text-sm text-gray-500">Sélectionne les tâches effectuées</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {TACHES_COURANTES.map(tache => (
                  <button
                    key={tache.id}
                    type="button"
                    onClick={() => toggleTache(tache.id)}
                    className={`p-3 rounded-xl text-left transition border ${
                      form.taches.includes(tache.id)
                        ? 'bg-teal-50 border-teal-500'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className={`text-sm ${form.taches.includes(tache.id) ? 'font-medium' : ''}`}>
                      {tache.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Étape 3: Notes */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <span className="text-4xl">📝</span>
                <h3 className="font-semibold text-gray-900 mt-2">Notes & observations</h3>
                <p className="text-sm text-gray-500">Ajoute des détails si nécessaire</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observations du jour
                </label>
                <textarea
                  value={form.observations}
                  onChange={(e) => setForm({ ...form, observations: e.target.value })}
                  placeholder="Comment s'est passée l'intervention ?"
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ⚠️ Changements à signaler
                </label>
                <textarea
                  value={form.changements}
                  onChange={(e) => setForm({ ...form, changements: e.target.value })}
                  placeholder="Nouveaux symptômes, comportements inhabituels..."
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  📋 Instructions pour la prochaine fois
                </label>
                <textarea
                  value={form.instructionsSuivantes}
                  onChange={(e) => setForm({ ...form, instructionsSuivantes: e.target.value })}
                  placeholder="Choses à faire, à surveiller, à rappeler..."
                  rows={2}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl resize-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer avec boutons */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 flex gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(s => s - 1)}
              className="flex-1 py-3 border border-gray-200 rounded-xl font-medium text-gray-700"
            >
              ← Retour
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-gray-200 rounded-xl font-medium text-gray-700"
            >
              Annuler
            </button>
          )}
          
          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep(s => s + 1)}
              className="flex-1 py-3 bg-teal-600 text-white rounded-xl font-medium"
            >
              Continuer →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 py-3 bg-teal-600 text-white rounded-xl font-medium"
            >
              ✓ Enregistrer
            </button>
          )}
        </div>
      </div>
    </div>
  )
}