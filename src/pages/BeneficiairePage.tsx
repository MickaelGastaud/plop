import { Link, useParams, useNavigate } from 'react-router-dom'
import { useBeneficiaires } from '../store/useBeneficiaires'

export default function BeneficiairePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { beneficiaires, supprimer } = useBeneficiaires()
  
  const beneficiaire = beneficiaires.find((b) => b.id === Number(id))

  if (!beneficiaire) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Bénéficiaire introuvable</p>
          <Link to="/beneficiaires" className="text-teal-600 hover:underline">
            ← Retour à la liste
          </Link>
        </div>
      </div>
    )
  }

  const handleSupprimer = () => {
    if (confirm(`Supprimer ${beneficiaire.prenom} ${beneficiaire.nom} ?`)) {
      supprimer(beneficiaire.id)
      navigate('/beneficiaires')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-teal-600 text-white p-4 flex items-center gap-4">
        <Link to="/beneficiaires" className="hover:bg-teal-700 p-2 rounded">
          ← Retour
        </Link>
        <h1 className="text-xl font-bold">
          {beneficiaire.prenom} {beneficiaire.nom}
        </h1>
      </header>

      <main className="p-6 max-w-lg mx-auto">
        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          <div>
            <p className="text-sm text-gray-500">Téléphone</p>
            <p className="font-medium">{beneficiaire.telephone}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Adresse</p>
            <p className="font-medium">{beneficiaire.adresse || '—'}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">N° CESU Employeur</p>
            <p className="font-medium">{beneficiaire.numeroCesu}</p>
          </div>
        </div>

        <div className="mt-6 flex gap-4">
          <Link
            to={`/beneficiaires/${id}/planning`}
            className="flex-1 bg-teal-600 text-white py-3 rounded-lg font-semibold text-center hover:bg-teal-700 transition"
          >
            📅 Planning
          </Link>
          <Link
            to={`/beneficiaires/${id}/carnet`}
            className="flex-1 bg-teal-600 text-white py-3 rounded-lg font-semibold text-center hover:bg-teal-700 transition"
          >
            📝 Carnet
          </Link>
        </div>

        <button
          onClick={handleSupprimer}
          className="w-full mt-4 bg-red-100 text-red-600 py-3 rounded-lg font-semibold hover:bg-red-200 transition"
        >
          Supprimer ce bénéficiaire
        </button>
      </main>
    </div>
  )
}