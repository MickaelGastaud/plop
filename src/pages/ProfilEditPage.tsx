import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useProfil } from '../store/useProfil'

const SERVICES = [
  'Aide à la toilette',
  'Aide au lever/coucher',
  'Préparation des repas',
  'Courses',
  'Entretien du logement',
  'Accompagnement sorties',
  'Gestion administrative',
  'Compagnie',
]

export default function ProfilEditPage() {
  const { profil, updateProfil } = useProfil()
  const [form, setForm] = useState(profil)
  const [saved, setSaved] = useState(false)

  const toggleService = (service: string) => {
    if (form.services.includes(service)) {
      setForm({ ...form, services: form.services.filter((s) => s !== service) })
    } else {
      setForm({ ...form, services: [...form.services, service] })
    }
  }

  const handleSave = () => {
    updateProfil(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-teal-600 text-white p-4 flex items-center gap-4">
        <Link to="/dashboard" className="hover:bg-teal-700 p-2 rounded">
          ← Retour
        </Link>
        <h1 className="text-xl font-bold">👤 Mon Profil Pro</h1>
      </header>

      <main className="p-6 max-w-2xl mx-auto space-y-6">
        {/* Aperçu */}
        <Link
          to="/profil/public"
          className="block bg-teal-50 p-4 rounded-xl border border-teal-200 text-center hover:bg-teal-100 transition"
        >
          👁️ Voir ma page publique
        </Link>

        {/* Infos personnelles */}
        <div className="bg-white p-4 rounded-xl shadow space-y-4">
          <h2 className="font-semibold text-gray-800">Informations personnelles</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
              <input
                type="text"
                value={form.prenom}
                onChange={(e) => setForm({ ...form, prenom: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input
                type="text"
                value={form.nom}
                onChange={(e) => setForm({ ...form, nom: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio / Présentation</label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows={3}
              placeholder="Présentez-vous en quelques lignes..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <input
                type="tel"
                value={form.telephone}
                onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Expérience */}
        <div className="bg-white p-4 rounded-xl shadow space-y-4">
          <h2 className="font-semibold text-gray-800">Expérience</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Années d'expérience</label>
              <input
                type="number"
                value={form.experience}
                onChange={(e) => setForm({ ...form, experience: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Zone d'intervention</label>
              <input
                type="text"
                value={form.zone}
                onChange={(e) => setForm({ ...form, zone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="Ex: Paris 15km"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Diplômes / Formations</label>
            <input
              type="text"
              value={form.diplomes}
              onChange={(e) => setForm({ ...form, diplomes: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        {/* Services */}
        <div className="bg-white p-4 rounded-xl shadow space-y-4">
          <h2 className="font-semibold text-gray-800">Services proposés</h2>
          <div className="grid grid-cols-2 gap-2">
            {SERVICES.map((s) => (
              <label
                key={s}
                className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer border ${
                  form.services.includes(s)
                    ? 'bg-teal-50 border-teal-500'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={form.services.includes(s)}
                  onChange={() => toggleService(s)}
                  className="accent-teal-600"
                />
                <span className="text-sm">{s}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Tarifs */}
        <div className="bg-white p-4 rounded-xl shadow space-y-4">
          <h2 className="font-semibold text-gray-800">Tarifs indicatifs</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tarif min (€/h)</label>
              <input
                type="number"
                value={form.tarifMin}
                onChange={(e) => setForm({ ...form, tarifMin: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tarif max (€/h)</label>
              <input
                type="number"
                value={form.tarifMax}
                onChange={(e) => setForm({ ...form, tarifMax: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Bouton sauvegarder */}
        <button
          onClick={handleSave}
          className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition"
        >
          {saved ? '✓ Enregistré !' : '💾 Enregistrer'}
        </button>
      </main>
    </div>
  )
}