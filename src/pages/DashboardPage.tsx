import { Link } from 'react-router-dom'
import { useProfil } from '../store/useProfil'
import { useBeneficiaires } from '../store/useBeneficiaires'
import BottomNav from '../components/BottomNav'

export default function DashboardPage() {
  const { profil } = useProfil()
  const { beneficiaires } = useBeneficiaires()

  const benefActifs = beneficiaires?.filter(b => b.statut === 'actif') || []

  // Calcul stats
  let heuresHebdo = 0
  let revenuHebdo = 0
  benefActifs.forEach(b => {
    b.creneauxHabituels?.forEach(c => {
      const [hDebut, mDebut] = c.heureDebut.split(':').map(Number)
      const [hFin, mFin] = c.heureFin.split(':').map(Number)
      const duree = (hFin * 60 + mFin - hDebut * 60 - mDebut) / 60
      heuresHebdo += duree
      revenuHebdo += duree * b.tauxHoraireNet
    })
  })

  // Prochain RDV
  const joursSemaine = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
  const today = new Date()
  
  let prochainRdv: { jour: string; heure: string; beneficiaire: any } | null = null
  for (let i = 0; i < 7 && !prochainRdv; i++) {
    const jourIndex = (today.getDay() + i) % 7
    const jourNom = joursSemaine[jourIndex]
    for (const b of benefActifs) {
      const creneau = b.creneauxHabituels?.find(c => c.jour === jourNom)
      if (creneau) {
        prochainRdv = {
          jour: i === 0 ? "Aujourd'hui" : i === 1 ? "Demain" : jourNom,
          heure: creneau.heureDebut,
          beneficiaire: b
        }
        break
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#FFF1F2] pb-24">
      {/* Header avec image de fond */}
      <header className="relative h-48 overflow-hidden">
        {/* Image de fond */}
        <img 
          src="/header-care.png" 
          alt="" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Overlay gradient ton pêche */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FB7185]/90 via-[#FDA4AF]/60 to-[#FDA4AF]/30" />
        
        <div className="absolute inset-0 px-6 pt-14 pb-6">
          <div className="max-w-lg mx-auto h-full flex items-start justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium">Bonjour</p>
              <h1 className="text-2xl font-bold text-white drop-shadow-sm">{profil.prenom || 'Sarah'}</h1>
            </div>
            <Link to="/profil" className="relative group">
              <div className="w-12 h-12 rounded-2xl bg-white/25 backdrop-blur-sm flex items-center justify-center overflow-hidden ring-2 ring-white/40 group-hover:ring-white/60 transition-all">
                {profil.photo ? (
                  <img src={profil.photo} alt="" className="w-12 h-12 object-cover" />
                ) : (
                  <span className="text-white font-semibold text-lg drop-shadow-sm">
                    {profil.prenom?.[0]?.toUpperCase() || 'S'}
                  </span>
                )}
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#FB7185]" />
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 -mt-12 space-y-5 relative z-10">
        
        {/* Carte revenus - floating */}
        <section className="bg-white rounded-3xl p-6 shadow-[0_8px_32px_-4px_rgba(0,0,0,0.12)]">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-slate-400 text-sm mb-1">Revenu estimé</p>
              <p className="text-4xl font-bold text-slate-800">{(revenuHebdo * 4).toFixed(0)} <span className="text-2xl text-slate-300">€</span></p>
              <p className="text-slate-400 text-sm mt-1">par mois</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FB7185] to-[#FDA4AF] flex items-center justify-center shadow-lg shadow-[#FB7185]/30">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-700">{benefActifs.length}</p>
              <p className="text-xs text-slate-400 mt-1">Bénéficiaires</p>
            </div>
            <div className="text-center border-x border-slate-100">
              <p className="text-2xl font-bold text-slate-700">{heuresHebdo.toFixed(0)}h</p>
              <p className="text-xs text-slate-400 mt-1">par semaine</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-slate-700">{(heuresHebdo * 4).toFixed(0)}h</p>
              <p className="text-xs text-slate-400 mt-1">par mois</p>
            </div>
          </div>
        </section>

        {/* Prochain RDV */}
        {prochainRdv && (
          <Link 
            to="/planning"
            className="block bg-gradient-to-r from-[#FB7185] to-[#FDA4AF] rounded-2xl p-4 shadow-lg shadow-[#FB7185]/25 hover:shadow-xl hover:-translate-y-0.5 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-white/80 text-sm">Prochain rendez-vous</p>
                <p className="text-white font-semibold">{prochainRdv.jour} · {prochainRdv.heure}</p>
              </div>
              <div className="text-right">
                <p className="text-white font-medium">{prochainRdv.beneficiaire.prenom}</p>
                <p className="text-white/70 text-sm">{prochainRdv.beneficiaire.ville}</p>
              </div>
            </div>
          </Link>
        )}

        {/* Actions rapides */}
        <section>
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-1">Actions rapides</h2>
          <div className="grid grid-cols-4 gap-3">
            {[
              { to: '/beneficiaires/nouveau', label: 'Ajouter', bg: 'bg-violet-100', iconBg: 'bg-violet-500', icon: 'M12 4v16m8-8H4' },
              { to: '/planning', label: 'Planning', bg: 'bg-sky-100', iconBg: 'bg-sky-500', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
              { to: '/documents', label: 'Documents', bg: 'bg-amber-100', iconBg: 'bg-amber-500', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
              { to: '/carnet', label: 'Carnet', bg: 'bg-rose-100', iconBg: 'bg-rose-500', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
            ].map((action) => (
              <Link
                key={action.to}
                to={action.to}
                className="group"
              >
                <div className={`${action.bg} rounded-2xl p-4 flex flex-col items-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all`}>
                  <div className={`w-10 h-10 ${action.iconBg} rounded-xl flex items-center justify-center mb-2 shadow-lg`}>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={action.icon} />
                    </svg>
                  </div>
                  <span className="text-xs text-slate-600 font-medium">{action.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Mes bénéficiaires */}
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Mes bénéficiaires</h2>
            <Link to="/beneficiaires" className="text-sm text-[#FB7185] font-medium hover:text-[#F43F5E]">
              Tout voir
            </Link>
          </div>
          
          {beneficiaires.length > 0 ? (
            <div className="space-y-3">
              {beneficiaires.slice(0, 3).map((b: any, index: number) => {
                let heuresBenef = 0
                b.creneauxHabituels?.forEach((c: any) => {
                  const [hDebut, mDebut] = c.heureDebut.split(':').map(Number)
                  const [hFin, mFin] = c.heureFin.split(':').map(Number)
                  heuresBenef += (hFin * 60 + mFin - hDebut * 60 - mDebut) / 60
                })

                const avatarColors = ['bg-indigo-500', 'bg-pink-500', 'bg-cyan-500']

                return (
                  <Link
                    key={b.id}
                    to={`/beneficiaires/${b.id}`}
                    className="flex items-center gap-4 p-4 bg-white rounded-2xl shadow-[0_2px_12px_-2px_rgba(0,0,0,0.08)] border border-slate-100 hover:shadow-[0_8px_24px_-4px_rgba(0,0,0,0.12)] hover:-translate-y-0.5 transition-all group"
                  >
                    <div className={`relative w-12 h-12 ${avatarColors[index % 3]} rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                      {b.prenom?.[0]?.toUpperCase()}
                      {b.statut === 'actif' && (
                        <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 group-hover:text-slate-900">{b.prenom} {b.nom}</p>
                      <p className="text-sm text-slate-400">{b.ville || 'Ville non renseignée'}</p>
                    </div>
                    {heuresBenef > 0 && (
                      <div className="bg-slate-100 px-3 py-1.5 rounded-xl">
                        <span className="text-sm font-bold text-slate-600">{heuresBenef.toFixed(0)}h</span>
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
          ) : (
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-slate-100">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-slate-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <p className="text-slate-500 mb-4">Ajoutez votre premier bénéficiaire</p>
              <Link
                to="/beneficiaires/nouveau"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#FB7185] to-[#FDA4AF] text-white rounded-xl font-medium hover:shadow-lg transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Ajouter
              </Link>
            </div>
          )}
        </section>

        {/* Semaine */}
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Cette semaine</h2>
            <Link to="/planning" className="text-sm text-[#FB7185] font-medium hover:text-[#F43F5E]">
              Planning
            </Link>
          </div>
          
          <div className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_-2px_rgba(0,0,0,0.08)] border border-slate-100">
            <div className="flex justify-between gap-2">
              {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((jour, i) => {
                const jourComplet = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'][i]
                const creneaux = benefActifs.flatMap(b => 
                  b.creneauxHabituels?.filter(c => c.jour === jourComplet) || []
                )
                const isToday = new Date().getDay() === (i + 1) % 7
                const heuresJour = creneaux.reduce((acc, c) => {
                  const [hD, mD] = c.heureDebut.split(':').map(Number)
                  const [hF, mF] = c.heureFin.split(':').map(Number)
                  return acc + (hF * 60 + mF - hD * 60 - mD) / 60
                }, 0)
                
                return (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <span className={`text-xs mb-2 font-medium ${isToday ? 'text-[#FB7185]' : 'text-slate-400'}`}>
                      {jour}
                    </span>
                    <div 
                      className={`w-full aspect-square max-w-[44px] rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                        heuresJour > 0 
                          ? 'bg-gradient-to-br from-[#FB7185] to-[#FDA4AF] text-white shadow-lg' 
                          : isToday 
                          ? 'bg-[#FDA4AF]/20 text-[#FB7185] ring-2 ring-[#FB7185]/30' 
                          : 'bg-slate-100 text-slate-300'
                      }`}
                    >
                      {heuresJour > 0 ? `${heuresJour.toFixed(0)}` : '–'}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

      </main>

      <BottomNav />
    </div>
  )
}