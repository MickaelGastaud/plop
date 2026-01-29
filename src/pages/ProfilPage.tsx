import { Link } from 'react-router-dom'
import { useProfil } from '../store/useProfil'
import BottomNav from '../components/BottomNav'

export default function ProfilPage() {
  const { profil } = useProfil()

  const menuItems = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      label: 'Informations personnelles',
      to: '/profil/edit',
      description: 'Nom, téléphone, adresse'
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      label: 'Expérience & diplômes',
      to: '/profil/edit',
      description: 'Parcours professionnel'
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: 'Disponibilités',
      to: '/profil/edit',
      description: 'Jours et horaires'
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      label: 'Zone d\'intervention',
      to: '/profil/edit',
      description: profil.zone || 'Non définie'
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: 'Tarifs',
      to: '/profil/edit',
      description: profil.tarifMin && profil.tarifMax ? `${profil.tarifMin}€ - ${profil.tarifMax}€/h` : 'Non définis'
    },
  ]

  const secondaryItems = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      label: 'Mes documents',
      to: '/documents'
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      label: 'Confidentialité',
      to: '/profil/edit'
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: 'Aide & support',
      to: '/profil/edit'
    },
  ]

  return (
    <div className="min-h-screen bg-[#FFF1F2] pb-24">
      {/* Header profil */}
      <header className="relative bg-gradient-to-br from-[#FB7185] to-[#FDA4AF] px-6 pt-12 pb-20 overflow-hidden">
        {/* Formes décoratives */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="max-w-lg mx-auto relative z-10">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden ring-2 ring-white/30 shadow-lg">
                {profil.photo ? (
                  <img src={profil.photo} alt="" className="w-16 h-16 object-cover" />
                ) : (
                  <span className="text-white text-xl font-bold">
                    {profil.prenom?.[0]?.toUpperCase() || '?'}{profil.nom?.[0]?.toUpperCase() || ''}
                  </span>
                )}
              </div>
              <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-lg shadow flex items-center justify-center">
                <svg className="w-3 h-3 text-[#FB7185]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
            
            {/* Infos */}
            <div className="flex-1">
              <h1 className="text-xl font-bold text-white">
                {profil.prenom || 'Prénom'} {profil.nom || 'Nom'}
              </h1>
              <p className="text-white/80 text-sm">Auxiliaire de vie</p>
            </div>

            {/* Stats compactes */}
            <div className="flex gap-3">
              <div className="text-center">
                <p className="text-lg font-bold text-white">{profil.experience || 0}</p>
                <p className="text-white/60 text-[10px]">ans</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-white">4.8</p>
                <p className="text-white/60 text-[10px]">étoiles</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 -mt-8 space-y-4 relative z-10">
        
        {/* Voir mon profil public */}
        <Link
          to="/profil/public"
          className="block bg-white rounded-2xl p-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FB7185] to-[#FDA4AF] flex items-center justify-center shadow-lg shadow-[#FB7185]/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-800">Voir mon profil public</p>
              <p className="text-sm text-slate-400">Tel que les familles le voient</p>
            </div>
            <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>

        {/* Menu principal */}
        <section className="bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] overflow-hidden">
          {menuItems.map((item, index) => (
            <Link
              key={item.label}
              to={item.to}
              className={`flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors ${
                index !== menuItems.length - 1 ? 'border-b border-slate-100' : ''
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-[#FFF1F2] flex items-center justify-center text-[#FB7185]">
                {item.icon}
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-800">{item.label}</p>
                <p className="text-sm text-slate-400">{item.description}</p>
              </div>
              <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </section>

        {/* Menu secondaire */}
        <section className="bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] overflow-hidden">
          {secondaryItems.map((item, index) => (
            <Link
              key={item.label}
              to={item.to}
              className={`flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors ${
                index !== secondaryItems.length - 1 ? 'border-b border-slate-100' : ''
              }`}
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                {item.icon}
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-800">{item.label}</p>
              </div>
              <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </section>

        {/* Déconnexion */}
        <button className="w-full bg-white rounded-2xl p-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] text-red-500 font-medium hover:bg-red-50 transition-colors">
          Se déconnecter
        </button>

        {/* Version */}
        <p className="text-center text-slate-400 text-sm py-4">
          CeSuCare v1.0.0
        </p>

      </main>

      <BottomNav />
    </div>
  )
}