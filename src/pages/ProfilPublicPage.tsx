import { Link } from 'react-router-dom'
import { useProfil } from '../store/useProfil'

export default function ProfilPublicPage() {
  const { profil } = useProfil()

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      <div className="bg-teal-600 text-white p-6 text-center">
        <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
          👤
        </div>
        <h1 className="text-2xl font-bold">{profil.prenom} {profil.nom}</h1>
        <p className="text-teal-100">Auxiliaire de vie</p>
        <p className="text-sm mt-2">📍 {profil.zone}</p>
      </div>

      <main className="p-6 max-w-2xl mx-auto space-y-6">
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold text-gray-800 mb-2">À propos</h2>
          <p className="text-gray-600">{profil.bio}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold text-gray-800 mb-2">Expérience</h2>
          <p className="text-gray-600">🏆 {profil.experience} ans d'expérience</p>
          <p className="text-gray-600 mt-1">🎓 {profil.diplomes}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold text-gray-800 mb-2">Services proposés</h2>
          <div className="flex flex-wrap gap-2">
            {profil.services.map((s) => (
              <span
                key={s}
                className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-sm"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-semibold text-gray-800 mb-2">Tarifs indicatifs</h2>
          <p className="text-2xl font-bold text-teal-600">
            {profil.tarifMin}€ - {profil.tarifMax}€ <span className="text-sm font-normal text-gray-500">/ heure</span>
          </p>
        </div>

        <div className="bg-teal-50 p-4 rounded-xl border border-teal-200">
          <h2 className="font-semibold text-gray-800 mb-3">Me contacter</h2>
          <div className="space-y-2">
            <a href={`tel:${profil.telephone}`} className="flex items-center gap-2 text-teal-700 hover:underline">
              <span>📞</span> {profil.telephone}
            </a>
            <a href={`mailto:${profil.email}`} className="flex items-center gap-2 text-teal-700 hover:underline">
              <span>✉️</span> {profil.email}
            </a>
          </div>
        </div>

        <p className="text-center text-gray-400 text-sm">
          Profil créé avec CeSuCare 🏠
        </p>

        <Link
          to="/profil"
          className="block text-center text-teal-600 hover:underline text-sm"
        >
          ← Modifier mon profil
        </Link>
      </main>
    </div>
  )
}