import { Link } from 'react-router-dom'
import { useBeneficiaires } from '../store/useBeneficiaires'

export default function BeneficiairesPage() {
  const { beneficiaires } = useBeneficiaires()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-teal-600 text-white p-4 flex items-center gap-4">
        <Link to="/dashboard" className="hover:bg-teal-700 p-2 rounded">
          ← Retour
        </Link>
        <h1 className="text-xl font-bold">👥 Mes Bénéficiaires</h1>
      </header>

      <main className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {beneficiaires.length} bénéficiaire(s)
          </h2>
          <Link
            to="/beneficiaires/nouveau"
            className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition"
          >
            + Ajouter
          </Link>
        </div>

        <div className="space-y-4">
          {beneficiaires.map((b) => (
            <div
              key={b.id}
              className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold text-lg">
                  {b.prenom} {b.nom}
                </h3>
                <p className="text-gray-500">{b.telephone}</p>
              </div>
              <Link
                to={`/beneficiaires/${b.id}`}
                className="text-teal-600 hover:underline"
              >
                Voir →
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}