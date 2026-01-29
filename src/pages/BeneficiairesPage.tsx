import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useBeneficiaires } from '../store/useBeneficiaires'
import BottomNav from '../components/BottomNav'

export default function BeneficiairesPage() {
  const { beneficiaires } = useBeneficiaires()
  const [filtre, setFiltre] = useState<'tous' | 'actif' | 'pause'>('tous')
  const [recherche, setRecherche] = useState('')

  const beneficiairesFiltres = beneficiaires.filter(b => {
    if (filtre !== 'tous' && b.statut !== filtre) return false
    if (recherche) {
      const search = recherche.toLowerCase()
      return (
        b.nom.toLowerCase().includes(search) ||
        b.prenom.toLowerCase().includes(search) ||
        b.ville?.toLowerCase().includes(search)
      )
    }
    return true
  })

  const nbActifs = beneficiaires.filter(b => b.statut === 'actif').length
  const nbPause = beneficiaires.filter(b => b.statut === 'pause').length

  // Calcul heures totales
  let heuresTotal = 0
  let revenuTotal = 0
  beneficiaires.filter(b => b.statut === 'actif').forEach(b => {
    b.creneauxHabituels?.forEach(c => {
      const [hDebut, mDebut] = c.heureDebut.split(':').map(Number)
      const [hFin, mFin] = c.heureFin.split(':').map(Number)
      const duree = (hFin * 60 + mFin - hDebut * 60 - mDebut) / 60
      heuresTotal += duree
      revenuTotal += duree * b.tauxHoraireNet
    })
  })

  const avatarColors = ['bg-indigo-500', 'bg-pink-500', 'bg-cyan-500', 'bg-orange-500', 'bg-violet-500']

  return (
    <div className="min-h-screen bg-[#FFF1F2] pb-24">
      {/* Header */}
      <header className="relative h-44 overflow-hidden">
        {/* Image de fond optionnelle ou gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FB7185] via-[#FDA4AF] to-[#FDA4AF]" />
        
        <div className="absolute inset-0 px-6 pt-14 pb-6">
          <div className="max-w-lg mx-auto relative z-10">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">Bénéficiaires</h1>
                <p className="text-white/70 text-sm mt-1">
                  {nbActifs} actif{nbActifs > 1 ? 's' : ''} · {heuresTotal.toFixed(0)}h/semaine
                </p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-right ring-1 ring-white/30">
                <p className="text-lg font-bold">{(revenuTotal * 4).toFixed(0)}€</p>
                <p className="text-white/70 text-xs">par mois</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 -mt-12 py-5 space-y-4 relative z-10">
        {/* Recherche */}
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            placeholder="Rechercher..."
            className="w-full pl-12 pr-4 py-3.5 bg-white rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.08)] border border-slate-100"
          />
        </div>

        {/* Filtres */}
        <div className="flex gap-2">
          {[
            { key: 'tous', label: 'Tous', count: beneficiaires.length },
            { key: 'actif', label: 'Actifs', count: nbActifs },
            { key: 'pause', label: 'En pause', count: nbPause },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFiltre(f.key as typeof filtre)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                filtre === f.key
                  ? 'bg-gradient-to-r from-[#FB7185] to-[#FDA4AF] text-white shadow-lg shadow-[#FB7185]/25'
                  : 'bg-white text-slate-500 shadow-sm hover:shadow-md border border-slate-100'
              }`}
            >
              {f.label} ({f.count})
            </button>
          ))}
        </div>

        {/* Liste */}
        {beneficiairesFiltres.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-slate-100">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-slate-500">
              {recherche ? 'Aucun résultat' : 'Aucun bénéficiaire'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {beneficiairesFiltres.map((b, index) => {
              let heuresHebdo = 0
              b.creneauxHabituels?.forEach(c => {
                const [hDebut, mDebut] = c.heureDebut.split(':').map(Number)
                const [hFin, mFin] = c.heureFin.split(':').map(Number)
                heuresHebdo += (hFin * 60 + mFin - hDebut * 60 - mDebut) / 60
              })

              return (
                <Link
                  key={b.id}
                  to={`/beneficiaires/${b.id}`}
                  className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-[0_2px_12px_-2px_rgba(0,0,0,0.08)] border border-slate-100 hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 transition-all group"
                >
                  <div className={`relative w-12 h-12 ${
                    b.statut === 'pause' ? 'bg-slate-300' : avatarColors[index % avatarColors.length]
                  } rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                    {b.prenom[0]?.toUpperCase()}
                    {b.statut === 'actif' && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-slate-800 group-hover:text-slate-900">
                        {b.prenom} {b.nom}
                      </p>
                      {b.statut === 'pause' && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">
                          Pause
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-400 truncate">{b.ville || 'Ville non renseignée'}</p>
                  </div>

                  {heuresHebdo > 0 && (
                    <div className="bg-slate-100 px-3 py-1.5 rounded-xl">
                      <span className="text-sm font-bold text-slate-600">{heuresHebdo.toFixed(0)}h</span>
                      <span className="text-xs text-slate-400">/sem</span>
                    </div>
                  )}

                  <svg className="w-5 h-5 text-slate-300 group-hover:text-slate-400 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )
            })}
          </div>
        )}
      </main>

      {/* FAB */}
      <Link
        to="/beneficiaires/nouveau"
        className="fixed bottom-24 right-5 w-14 h-14 bg-gradient-to-br from-[#FB7185] to-[#FDA4AF] text-white rounded-2xl shadow-xl shadow-[#FB7185]/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-40"
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </Link>

      <BottomNav />
    </div>
  )
}