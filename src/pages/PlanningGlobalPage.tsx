import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCreneaux } from '../store/useCreneaux'
import { useBeneficiaires } from '../store/useBeneficiaires'

export default function PlanningGlobalPage() {
  const { creneaux } = useCreneaux()
  const { beneficiaires } = useBeneficiaires()

  const [filtre, setFiltre] = useState<'tous' | 'aujourdhui' | 'semaine'>('tous')

  const aujourd_hui = new Date().toISOString().split('T')[0]
  
  const getDateDansSemaine = (joursAhead: number) => {
    const date = new Date()
    date.setDate(date.getDate() + joursAhead)
    return date.toISOString().split('T')[0]
  }

  const creneauxFiltres = creneaux
    .filter((c) => {
      if (filtre === 'aujourdhui') return c.date === aujourd_hui
      if (filtre === 'semaine') return c.date >= aujourd_hui && c.date <= getDateDansSemaine(7)
      return true
    })
    .sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date)
      return a.heureDebut.localeCompare(b.heureDebut)
    })

  const getBeneficiaire = (id: number) => beneficiaires.find((b) => b.id === id)

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
  }

  // Grouper par date
  const creneauxParDate: Record<string, typeof creneaux> = {}
  creneauxFiltres.forEach((c) => {
    if (!creneauxParDate[c.date]) creneauxParDate[c.date] = []
    creneauxParDate[c.date].push(c)
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-teal-600 text-white p-4 flex items-center gap-4">
        <Link to="/dashboard" className="hover:bg-teal-700 p-2 rounded">
          ← Retour
        </Link>
        <h1 className="text-xl font-bold">📅 Planning Global</h1>
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
            onClick={() => setFiltre('aujourdhui')}
            className={`px-4 py-2 rounded-lg ${
              filtre === 'aujourdhui'
                ? 'bg-teal-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Aujourd'hui
          </button>
          <button
            onClick={() => setFiltre('semaine')}
            className={`px-4 py-2 rounded-lg ${
              filtre === 'semaine'
                ? 'bg-teal-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            7 prochains jours
          </button>
        </div>

        {/* Stats */}
        <div className="bg-teal-50 p-4 rounded-xl border border-teal-200 mb-6">
          <p className="text-lg font-semibold text-teal-700">
            {creneauxFiltres.length} créneau(x)
          </p>
        </div>

        {/* Liste par date */}
        {Object.keys(creneauxParDate).length === 0 ? (
          <p className="text-center text-gray-500 py-8">Aucun créneau</p>
        ) : (
          <div className="space-y-6">
            {Object.entries(creneauxParDate).map(([date, creneauxDuJour]) => (
              <div key={date}>
                <h2 className="font-semibold text-gray-800 mb-3 capitalize">
                  📆 {formatDate(date)}
                </h2>
                <div className="space-y-3">
                  {creneauxDuJour.map((c) => {
                    const benef = getBeneficiaire(c.beneficiaireId)
                    return (
                      <div key={c.id} className="bg-white p-4 rounded-xl shadow">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-teal-700">{c.type}</p>
                            <p className="text-gray-600">
                              🕐 {c.heureDebut} - {c.heureFin}
                            </p>
                            {benef && (
                              <Link
                                to={`/beneficiaires/${benef.id}`}
                                className="text-sm text-teal-600 hover:underline"
                              >
                                👤 {benef.prenom} {benef.nom}
                              </Link>
                            )}
                            {c.notes && (
                              <p className="text-gray-500 text-sm mt-1">{c.notes}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}