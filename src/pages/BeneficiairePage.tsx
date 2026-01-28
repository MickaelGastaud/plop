import { useParams, Link, useNavigate } from 'react-router-dom'
import { useBeneficiaires } from '../store/useBeneficiaires'
import Layout from '../components/Layout'

export default function BeneficiairePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { beneficiaires, supprimer } = useBeneficiaires()

  // Convertir l'id en number pour la comparaison
  const beneficiaire = beneficiaires.find((b) => b.id === Number(id))

  if (!beneficiaire) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <span className="text-6xl mb-4">😕</span>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Bénéficiaire introuvable</h1>
          <p className="text-gray-500 mb-6">Ce bénéficiaire n'existe pas ou a été supprimé.</p>
          <Link
            to="/beneficiaires"
            className="px-6 py-3 bg-teal-600 text-white rounded-xl font-medium"
          >
            ← Retour à la liste
          </Link>
        </div>
      </Layout>
    )
  }

  const handleDelete = () => {
    if (confirm(`Supprimer ${beneficiaire.prenom} de ta liste ?`)) {
      supprimer(beneficiaire.id)
      navigate('/beneficiaires')
    }
  }

  return (
    <Layout>
      {/* Header */}
      <header className="bg-gradient-to-br from-teal-500 to-teal-600 text-white px-4 py-6">
        <div className="max-w-lg mx-auto">
          <Link to="/beneficiaires" className="text-teal-100 text-sm mb-4 inline-block">
            ← Mes bénéficiaires
          </Link>
          
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold border-4 border-white/30">
              {beneficiaire.prenom?.[0]?.toUpperCase() || '?'}
            </div>
            
            {/* Nom */}
            <div>
              <h1 className="text-2xl font-bold">
                {beneficiaire.prenom} {beneficiaire.nom}
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Actions rapides */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-40">
        <div className="max-w-lg mx-auto flex gap-2">
          <Link
            to={`/beneficiaires/${id}/planning`}
            className="flex-1 py-2 px-4 bg-teal-50 text-teal-700 rounded-lg text-center text-sm font-medium hover:bg-teal-100 transition"
          >
            📅 Planning
          </Link>
          <Link
            to={`/beneficiaires/${id}/carnet`}
            className="flex-1 py-2 px-4 bg-blue-50 text-blue-700 rounded-lg text-center text-sm font-medium hover:bg-blue-100 transition"
          >
            📓 Carnet
          </Link>
        </div>
      </div>

      {/* Contenu */}
      <main className="px-4 py-6 max-w-lg mx-auto space-y-4">
        
        {/* Coordonnées */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">📍 Coordonnées</h2>
          </div>
          <div className="p-4 space-y-3">
            <div>
              <p className="text-sm text-gray-500">Adresse</p>
              <p className="font-medium text-gray-900">
                {beneficiaire.adresse || 'Non renseignée'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Téléphone</p>
              {beneficiaire.telephone ? (
                <a 
                  href={`tel:${beneficiaire.telephone}`}
                  className="font-medium text-teal-600"
                >
                  {beneficiaire.telephone}
                </a>
              ) : (
                <p className="font-medium text-gray-400">Non renseigné</p>
              )}
            </div>
          </div>
        </section>

        {/* Infos CESU */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">📋 Informations CESU</h2>
          </div>
          <div className="p-4">
            <div>
              <p className="text-sm text-gray-500">Numéro CESU</p>
              <p className="font-medium text-gray-900">
                {beneficiaire.numeroCesu || 'Non renseigné'}
              </p>
            </div>
          </div>
        </section>

        {/* Documents rapides */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">📄 Documents</h2>
          </div>
          <div className="p-4 grid grid-cols-2 gap-3">
            <Link
              to="/devis"
              className="p-4 bg-blue-50 rounded-xl text-center hover:bg-blue-100 transition"
            >
              <span className="text-2xl block mb-1">📝</span>
              <span className="text-sm font-medium text-blue-700">Créer un devis</span>
            </Link>
            <Link
              to="/contrat"
              className="p-4 bg-teal-50 rounded-xl text-center hover:bg-teal-100 transition"
            >
              <span className="text-2xl block mb-1">📋</span>
              <span className="text-sm font-medium text-teal-700">Créer un contrat</span>
            </Link>
          </div>
        </section>

        {/* Actions */}
        <div className="pt-4 space-y-3">
          <Link
            to={`/beneficiaires/${id}/modifier`}
            className="block w-full py-3 bg-gray-100 text-gray-700 rounded-xl text-center font-medium hover:bg-gray-200 transition"
          >
            ✏️ Modifier les informations
          </Link>
          <button
            onClick={handleDelete}
            className="block w-full py-3 text-red-500 text-center font-medium hover:bg-red-50 rounded-xl transition"
          >
            🗑️ Supprimer ce bénéficiaire
          </button>
        </div>

      </main>
    </Layout>
  )
}