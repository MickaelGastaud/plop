import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../store/useAuth'

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-teal-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">🏠 CeSuCare</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm">{user?.prenom} {user?.nom}</span>
          <button
            onClick={handleLogout}
            className="bg-teal-700 px-3 py-1 rounded hover:bg-teal-800 text-sm"
          >
            Déconnexion
          </button>
        </div>
      </header>
      
      <main className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Bonjour {user?.prenom} ! 👋
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link to="/beneficiaires" className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <span className="text-3xl">👥</span>
            <h3 className="text-lg font-semibold mt-2">Mes Bénéficiaires</h3>
            <p className="text-gray-500 text-sm">Gérer vos bénéficiaires</p>
          </Link>
          
          <Link to="/planning" className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <span className="text-3xl">📅</span>
            <h3 className="text-lg font-semibold mt-2">Planning</h3>
            <p className="text-gray-500 text-sm">Voir votre calendrier</p>
          </Link>
          
          <Link to="/carnet" className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <span className="text-3xl">📝</span>
            <h3 className="text-lg font-semibold mt-2">Carnet de liaison</h3>
            <p className="text-gray-500 text-sm">Notes et observations</p>
          </Link>
          
          <Link to="/devis" className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <span className="text-3xl">📄</span>
            <h3 className="text-lg font-semibold mt-2">Devis & Contrats</h3>
            <p className="text-gray-500 text-sm">Générer des documents</p>
          </Link>

          <Link to="/profil" className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <span className="text-3xl">👤</span>
            <h3 className="text-lg font-semibold mt-2">Mon Profil Pro</h3>
            <p className="text-gray-500 text-sm">Ma page publique</p>
          </Link>

          <Link to="/badges" className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <span className="text-3xl">🏅</span>
            <h3 className="text-lg font-semibold mt-2">Mes Badges</h3>
            <p className="text-gray-500 text-sm">Voir ma progression</p>
          </Link>
        </div>
      </main>
    </div>
  )
}