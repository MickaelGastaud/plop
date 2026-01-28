import { useState } from 'react'
import { useBeneficiaires } from '../store/useBeneficiaires'
import { useTransmissions } from '../store/useTransmissions'
import type { Evaluation } from '../store/useTransmissions'
import Layout from '../components/Layout'
import AjouterTransmission from '../components/AjouterTransmission'

// Helper pour afficher le smiley selon l'évaluation
function getSmileysDisplay(evaluation: Evaluation, type: string): string {
  const smileys: Record<string, Record<string, string>> = {
    humeur: { bien: '😊', moyen: '😐', mauvais: '😔' },
    appetit: { bien: '😋', moyen: '😕', mauvais: '🤢' },
    hydratation: { bien: '💧', moyen: '💦', mauvais: '🏜️' },
    mobilite: { bien: '🚶', moyen: '🦯', mauvais: '🛋️' },
    sommeil: { bien: '😴', moyen: '🥱', mauvais: '😵' },
  }
  if (!evaluation) return '—'
  return smileys[type]?.[evaluation] || '—'
}

// Helper pour la couleur selon l'évaluation
function getEvalColor(evaluation: Evaluation): string {
  switch (evaluation) {
    case 'bien': return 'bg-green-100 text-green-700'
    case 'moyen': return 'bg-amber-100 text-amber-700'
    case 'mauvais': return 'bg-red-100 text-red-700'
    default: return 'bg-gray-100 text-gray-400'
  }
}

// Labels des tâches
const TACHES_LABELS: Record<string, string> = {
  toilette: '🚿 Toilette',
  habillage: '👕 Habillage',
  repas: '🍽️ Repas',
  medicaments: '💊 Médicaments',
  menage: '🧹 Ménage',
  courses: '🛒 Courses',
  linge: '👔 Linge',
  promenade: '🚶 Promenade',
  compagnie: '💬 Compagnie',
  rdv: '📅 RDV',
}

export default function CarnetGlobalPage() {
  const { beneficiaires } = useBeneficiaires()
  const { transmissions } = useTransmissions()
  const [showModal, setShowModal] = useState(false)
  const [filtreBereficiaire, setFiltreBeneficiaire] = useState<number | 'tous'>('tous')

  // Filtrer et trier les transmissions
  const transmissionsFiltrees = transmissions
    .filter(t => filtreBereficiaire === 'tous' || t.beneficiaireId === filtreBereficiaire)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  // Grouper par date
  const groupedByDate = transmissionsFiltrees.reduce((acc, t) => {
    const date = t.date
    if (!acc[date]) acc[date] = []
    acc[date].push(t)
    return acc
  }, {} as Record<string, typeof transmissionsFiltrees>)

  const dates = Object.keys(groupedByDate).sort((a, b) => b.localeCompare(a))

  // Trouver le bénéficiaire
  const getBeneficiaire = (id: number) => beneficiaires.find(b => b.id === id)

  // Formater la date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T12:00:00')
    const today = new Date()
    const yesterday = new Date(Date.now() - 86400000)
    
    if (dateStr === today.toISOString().split('T')[0]) return "Aujourd'hui"
    if (dateStr === yesterday.toISOString().split('T')[0]) return 'Hier'
    
    return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
  }

  return (
    <Layout>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-40">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900">📓 Carnet de liaison</h1>
            <button
              onClick={() => setShowModal(true)}
              className="w-10 h-10 bg-teal-600 text-white rounded-full flex items-center justify-center text-2xl hover:bg-teal-700 transition shadow-lg"
            >
              +
            </button>
          </div>

          {/* Filtre par bénéficiaire */}
          {beneficiaires.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              <button
                onClick={() => setFiltreBeneficiaire('tous')}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition ${
                  filtreBereficiaire === 'tous'
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Tous
              </button>
              {beneficiaires.map(b => (
                <button
                  key={b.id}
                  onClick={() => setFiltreBeneficiaire(b.id)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition ${
                    filtreBereficiaire === b.id
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {b.prenom}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Contenu */}
      <main className="px-4 py-6 max-w-lg mx-auto">
        {dates.length > 0 ? (
          <div className="space-y-6">
            {dates.map(date => (
              <div key={date}>
                {/* Date header */}
                <h2 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
                  {formatDate(date)}
                </h2>

                {/* Transmissions du jour */}
                <div className="space-y-3">
                  {groupedByDate[date].map(transmission => {
                    const beneficiaire = getBeneficiaire(transmission.beneficiaireId)
                    
                    return (
                      <div
                        key={transmission.id}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                      >
                        {/* Header de la transmission */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-100">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-bold">
                              {beneficiaire?.prenom?.[0]?.toUpperCase() || '?'}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">
                                {beneficiaire?.prenom} {beneficiaire?.nom}
                              </p>
                              <p className="text-xs text-gray-500">
                                {transmission.heure}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Smileys rapides */}
                        <div className="px-4 py-3 bg-gray-50 flex justify-around">
                          {[
                            { key: 'humeur', label: 'Humeur' },
                            { key: 'appetit', label: 'Appétit' },
                            { key: 'hydratation', label: 'Hydrat.' },
                            { key: 'mobilite', label: 'Mobilité' },
                            { key: 'sommeil', label: 'Sommeil' },
                          ].map(item => (
                            <div key={item.key} className="text-center">
                              <span className={`inline-flex w-8 h-8 items-center justify-center rounded-lg text-lg ${getEvalColor(transmission[item.key as keyof typeof transmission] as Evaluation)}`}>
                                {getSmileysDisplay(transmission[item.key as keyof typeof transmission] as Evaluation, item.key)}
                              </span>
                              <p className="text-xs text-gray-400 mt-1">{item.label}</p>
                            </div>
                          ))}
                        </div>

                        {/* Tâches effectuées */}
                        {transmission.taches.length > 0 && (
                          <div className="px-4 py-3 border-t border-gray-100">
                            <p className="text-xs text-gray-500 mb-2">Tâches effectuées</p>
                            <div className="flex flex-wrap gap-1">
                              {transmission.taches.map(tache => (
                                <span
                                  key={tache}
                                  className="px-2 py-1 bg-teal-50 text-teal-700 rounded text-xs"
                                >
                                  {TACHES_LABELS[tache] || tache}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Observations */}
                        {transmission.observations && (
                          <div className="px-4 py-3 border-t border-gray-100">
                            <p className="text-xs text-gray-500 mb-1">📝 Observations</p>
                            <p className="text-sm text-gray-700">{transmission.observations}</p>
                          </div>
                        )}

                        {/* Changements à signaler */}
                        {transmission.changements && (
                          <div className="px-4 py-3 border-t border-gray-100 bg-amber-50">
                            <p className="text-xs text-amber-600 mb-1">⚠️ Changements à signaler</p>
                            <p className="text-sm text-amber-800">{transmission.changements}</p>
                          </div>
                        )}

                        {/* Instructions suivantes */}
                        {transmission.instructionsSuivantes && (
                          <div className="px-4 py-3 border-t border-gray-100 bg-blue-50">
                            <p className="text-xs text-blue-600 mb-1">📋 Pour la prochaine fois</p>
                            <p className="text-sm text-blue-800">{transmission.instructionsSuivantes}</p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* État vide */
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl">📓</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Aucune transmission
            </h2>
            <p className="text-gray-500 mb-6 max-w-xs mx-auto">
              Le carnet de liaison permet de garder un suivi de chaque intervention
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition shadow-lg"
            >
              <span className="text-xl">+</span>
              Ajouter une transmission
            </button>
          </div>
        )}

        {/* Info */}
        {transmissionsFiltrees.length > 0 && (
          <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>💡 Astuce :</strong> Le carnet de liaison est partageable avec la famille du bénéficiaire pour les tenir informés.
            </p>
          </div>
        )}
      </main>

      {/* Modal Ajouter Transmission */}
      {showModal && (
        <AjouterTransmission
          beneficiaireId={filtreBereficiaire !== 'tous' ? filtreBereficiaire : undefined}
          onClose={() => setShowModal(false)}
        />
      )}
    </Layout>
  )
}