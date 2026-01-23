import { Link } from 'react-router-dom'
import { useBadges } from '../store/useBadges'

export default function BadgesPage() {
  const { badges } = useBadges()
  
  const badgesDebloques = badges.filter((b) => b.debloque).length
  const totalBadges = badges.length

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-teal-600 text-white p-4 flex items-center gap-4">
        <Link to="/dashboard" className="hover:bg-teal-700 p-2 rounded">
          ← Retour
        </Link>
        <h1 className="text-xl font-bold">🏅 Mes Badges</h1>
      </header>

      <main className="p-6 max-w-2xl mx-auto">
        <div className="bg-teal-50 p-4 rounded-xl border border-teal-200 mb-6 text-center">
          <p className="text-3xl font-bold text-teal-700">{badgesDebloques} / {totalBadges}</p>
          <p className="text-teal-600">badges débloqués</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-4 rounded-xl shadow text-center ${
                badge.debloque
                  ? 'bg-white'
                  : 'bg-gray-100 opacity-60'
              }`}
            >
              <div className="text-4xl mb-2">
                {badge.debloque ? badge.icon : '🔒'}
              </div>
              <h3 className="font-semibold text-gray-800">{badge.nom}</h3>
              <p className="text-sm text-gray-500 mt-1">{badge.description}</p>
              {!badge.debloque && (
                <p className="text-xs text-teal-600 mt-2">
                  → {badge.condition}
                </p>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}