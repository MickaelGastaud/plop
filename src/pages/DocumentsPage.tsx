import { Link } from 'react-router-dom'
import BottomNav from '../components/BottomNav'

export default function DocumentsPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <h1 className="text-xl font-bold text-gray-900">📄 Documents</h1>
        <p className="text-sm text-gray-500">Génère tes documents professionnels</p>
      </header>

      {/* Contenu */}
      <main className="p-4 space-y-4 max-w-lg mx-auto">
        
        {/* Carte Devis */}
        <Link
          to="/devis"
          className="block bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition"
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-3xl">
              📝
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900">Devis</h2>
              <p className="text-sm text-gray-500 mt-1">
                Crée un devis professionnel pour tes futurs bénéficiaires
              </p>
              <span className="inline-block mt-3 text-blue-600 text-sm font-medium">
                Créer un devis →
              </span>
            </div>
          </div>
        </Link>

        {/* Carte Contrat */}
        <Link
          to="/contrat"
          className="block bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition"
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center text-3xl">
              📋
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900">Contrat CESU</h2>
              <p className="text-sm text-gray-500 mt-1">
                Génère un contrat de travail conforme à la convention collective
              </p>
              <span className="inline-block mt-3 text-teal-600 text-sm font-medium">
                Créer un contrat →
              </span>
            </div>
          </div>
        </Link>

        {/* Infos */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-6">
          <h3 className="font-medium text-amber-800 flex items-center gap-2">
            💡 Astuce
          </h3>
          <p className="text-sm text-amber-700 mt-1">
            Tes informations de profil sont automatiquement utilisées pour pré-remplir tes documents. Pense à garder ton profil à jour !
          </p>
          <Link to="/profil" className="text-sm text-amber-800 font-medium mt-2 inline-block">
            Voir mon profil →
          </Link>
        </div>

        {/* Historique (placeholder) */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-900 mb-4">📁 Historique</h2>
          <div className="text-center py-8 text-gray-400">
            <span className="text-4xl block mb-2">📭</span>
            <p className="text-sm">Tes documents générés apparaîtront ici</p>
            <p className="text-xs mt-1">(Bientôt disponible)</p>
          </div>
        </div>

      </main>

      {/* Navigation */}
      <BottomNav />
    </div>
  )
}