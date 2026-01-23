import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useBeneficiaires } from '../store/useBeneficiaires'
import { useCreneaux } from '../store/useCreneaux'

export default function PlanningPage() {
  const { id } = useParams()
  const beneficiaireId = Number(id)
  const { beneficiaires } = useBeneficiaires()
  const { creneaux, ajouter, supprimer } = useCreneaux()
  
  const beneficiaire = beneficiaires.find((b) => b.id === beneficiaireId)
  const creneauxBeneficiaire = creneaux.filter((c) => c.beneficiaireId === beneficiaireId)

  const [showForm, setShowForm] = useState(false)
  const [newCreneau, setNewCreneau] = useState({
    date: '',
    heureDebut: '',
    heureFin: '',
    type: 'Aide à la toilette',
    notes: '',
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
    ajouter({ ...newCreneau, beneficiaireId })
    setNewCreneau({ date: '', heureDebut: '', heureFin: '', type: 'Aide à la toilette', notes: '' })
    setShowForm(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-teal-600 text-white p-4 flex items-center gap-4">
        <Link to={`/beneficiaires/${id}`} className="hover:bg-teal-700 p-2 rounded">
          ← Retour
        </Link>
        <h1 className="text-xl font-bold">📅 Planning de {beneficiaire.prenom}</h1>
      </header>

      <main className="p-6 max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">
            {creneauxBeneficiaire.length} créneau(x)
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={newCreneau.date}
                  onChange={(e) => setNewCreneau({ ...newCreneau, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={newCreneau.type}
                  onChange={(e) => setNewCreneau({ ...newCreneau, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option>Aide à la toilette</option>
                  <option>Aide au lever/coucher</option>
                  <option>Préparation des repas</option>
                  <option>Courses</option>
                  <option>Entretien du logement</option>
                  <option>Accompagnement sorties</option>
                  <option>Compagnie</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Heure début</label>
                <input
                  type="time"
                  value={newCreneau.heureDebut}
                  onChange={(e) => setNewCreneau({ ...newCreneau, heureDebut: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Heure fin</label>
                <input
                  type="time"
                  value={newCreneau.heureFin}
                  onChange={(e) => setNewCreneau({ ...newCreneau, heureFin: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <input
                type="text"
                value={newCreneau.notes}
                onChange={(e) => setNewCreneau({ ...newCreneau, notes: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Optionnel..."
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
          {creneauxBeneficiaire.map((c) => (
            <div key={c.id} className="bg-white p-4 rounded-xl shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-teal-700">{c.type}</p>
                  <p className="text-gray-600">
                    📆 {c.date} · 🕐 {c.heureDebut} - {c.heureFin}
                  </p>
                  {c.notes && <p className="text-gray-500 text-sm mt-1">{c.notes}</p>}
                </div>
                <button
                  onClick={() => supprimer(c.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}