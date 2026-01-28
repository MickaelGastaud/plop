import { Link } from 'react-router-dom'
import { useProfil } from '../store/useProfil'
import { useBeneficiaires } from '../store/useBeneficiaires'
import BottomNav from '../components/BottomNav'

export default function DashboardPage() {
  const { profil } = useProfil()
  const { beneficiaires } = useBeneficiaires()

  // Statistiques rapides
  const nbBeneficiaires = beneficiaires?.length || 0

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header avec salutation */}
      <header className="bg-gradient-to-br from-teal-500 to-teal-600 text-white px-4 py-6">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3">
            {profil.photo ? (
              <img 
                src={profil.photo} 
                alt="" 
                className="w-12 h-12 rounded-full object-cover border-2 border-white/30"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-xl">
                {profil.prenom ? profil.prenom[0].toUpperCase() : '👤'}
              </div>
            )}
            <div>
              <p className="text-teal-100 text-sm">Bonjour,</p>
              <h1 className="text-xl font-bold">{profil.prenom || 'toi'} ! 👋</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="px-4 py-6 max-w-lg mx-auto space-y-6">
        
        {/* Stats rapides */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-3xl font-bold text-teal-600">{nbBeneficiaires}</p>
            <p className="text-sm text-gray-500">Bénéficiaire{nbBeneficiaires > 1 ? 's' : ''}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-3xl font-bold text-blue-600">0h</p>
            <p className="text-sm text-gray-500">Cette semaine</p>
          </div>
        </div>

        {/* Actions rapides */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Actions rapides</h2>
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/beneficiaires/nouveau"
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition text-center"
            >
              <span className="text-3xl block mb-2">➕</span>
              <span className="text-sm font-medium text-gray-700">Nouveau bénéficiaire</span>
            </Link>
            <Link
              to="/planning"
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition text-center"
            >
              <span className="text-3xl block mb-2">📅</span>
              <span className="text-sm font-medium text-gray-700">Mon planning</span>
            </Link>
            <Link
              to="/documents"
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition text-center"
            >
              <span className="text-3xl block mb-2">📄</span>
              <span className="text-sm font-medium text-gray-700">Documents</span>
            </Link>
            <Link
              to="/carnet"
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition text-center"
            >
              <span className="text-3xl block mb-2">📓</span>
              <span className="text-sm font-medium text-gray-700">Carnet de liaison</span>
            </Link>
          </div>
        </section>

        {/* Mes bénéficiaires */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Mes bénéficiaires</h2>
            <Link to="/beneficiaires" className="text-teal-600 text-sm font-medium">
              Voir tout →
            </Link>
          </div>
          
          {nbBeneficiaires > 0 ? (
            <div className="space-y-2">
              {beneficiaires.slice(0, 3).map((b: any) => (
                <Link
                  key={b.id}
                  to={`/beneficiaires/${b.id}`}
                  className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm border border-gray-100 hover:shadow-md transition"
                >
                  <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-semibold">
                    {b.prenom?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{b.prenom} {b.nom}</p>
                    <p className="text-xs text-gray-500">{b.ville || 'Ville non renseignée'}</p>
                  </div>
                  <span className="text-gray-400">→</span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-6 text-center border border-dashed border-gray-300">
              <span className="text-4xl block mb-2">👥</span>
              <p className="text-gray-500 text-sm mb-3">Aucun bénéficiaire pour l'instant</p>
              <Link
                to="/beneficiaires/nouveau"
                className="inline-block px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition"
              >
                Ajouter mon premier bénéficiaire
              </Link>
            </div>
          )}
        </section>

        {/* Badges / Gamification */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Mes badges</h2>
            <Link to="/badges" className="text-teal-600 text-sm font-medium">
              Voir tout →
            </Link>
          </div>
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
            <div className="flex items-center gap-3">
              <span className="text-4xl">🏅</span>
              <div>
                <p className="font-medium text-amber-800">Continue comme ça !</p>
                <p className="text-sm text-amber-600">Complète ton profil pour débloquer ton premier badge</p>
              </div>
            </div>
          </div>
        </section>

        {/* Astuce du jour */}
        <section className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <h3 className="font-medium text-blue-800 flex items-center gap-2">
            💡 Astuce du jour
          </h3>
          <p className="text-sm text-blue-700 mt-1">
            Pense à remplir le carnet de liaison après chaque intervention. C'est rassurant pour les familles et ça valorise ton travail !
          </p>
        </section>

      </main>

      {/* Barre de navigation */}
      <BottomNav />
    </div>
  )
}