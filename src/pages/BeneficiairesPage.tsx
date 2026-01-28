import { Link } from 'react-router-dom'
import { useBeneficiaires } from '../store/useBeneficiaires'
import Layout from '../components/Layout'

export default function BeneficiairesPage() {
  const { beneficiaires, supprimer } = useBeneficiaires()

  const handleDelete = (id: number, prenom: string) => {
    if (confirm(`Supprimer ${prenom} de ta liste ?`)) {
      supprimer(id)
    }
  }

  return (
    <Layout>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-40">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">👥 Mes bénéficiaires</h1>
            <p className="text-sm text-gray-500">
              {beneficiaires.length} bénéficiaire{beneficiaires.length > 1 ? 's' : ''}
            </p>
          </div>
          <Link
            to="/beneficiaires/nouveau"
            className="w-10 h-10 bg-teal-600 text-white rounded-full flex items-center justify-center text-2xl hover:bg-teal-700 transition shadow-lg"
          >
            +
          </Link>
        </div>
      </header>

      {/* Contenu */}
      <main className="px-4 py-6 max-w-lg mx-auto">
        {beneficiaires.length > 0 ? (
          <div className="space-y-3">
            {beneficiaires.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >
                {/* Carte principale - cliquable */}
                <Link
                  to={`/beneficiaires/${b.id}`}
                  className="flex items-center gap-4 p-4 hover:bg-gray-50 transition"
                >
                  {/* Avatar */}
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-xl font-bold shadow">
                    {b.prenom?.[0]?.toUpperCase() || '?'}
                  </div>

                  {/* Infos */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">
                      {b.prenom} {b.nom}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">
                      {b.adresse || 'Adresse non renseignée'}
                    </p>
                    {b.telephone && (
                      <p className="text-sm text-teal-600">{b.telephone}</p>
                    )}
                  </div>

                  {/* Flèche */}
                  <span className="text-gray-400 text-xl">›</span>
                </Link>

                {/* Actions rapides */}
                <div className="flex border-t border-gray-100 divide-x divide-gray-100">
                  <Link
                    to={`/beneficiaires/${b.id}/planning`}
                    className="flex-1 py-3 text-center text-sm text-gray-600 hover:bg-gray-50 transition"
                  >
                    📅 Planning
                  </Link>
                  <Link
                    to={`/beneficiaires/${b.id}/carnet`}
                    className="flex-1 py-3 text-center text-sm text-gray-600 hover:bg-gray-50 transition"
                  >
                    📓 Carnet
                  </Link>
                  <button
                    onClick={() => handleDelete(b.id, b.prenom)}
                    className="flex-1 py-3 text-center text-sm text-red-500 hover:bg-red-50 transition"
                  >
                    🗑️ Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* État vide */
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl">👥</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Aucun bénéficiaire
            </h2>
            <p className="text-gray-500 mb-6 max-w-xs mx-auto">
              Ajoute ton premier bénéficiaire pour commencer à organiser ton travail
            </p>
            <Link
              to="/beneficiaires/nouveau"
              className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition shadow-lg"
            >
              <span className="text-xl">+</span>
              Ajouter un bénéficiaire
            </Link>
          </div>
        )}

        {/* Astuce */}
        {beneficiaires.length > 0 && beneficiaires.length < 3 && (
          <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>💡 Astuce :</strong> Tu peux ajouter plusieurs bénéficiaires et gérer le planning de chacun séparément.
            </p>
          </div>
        )}
      </main>
    </Layout>
  )
}