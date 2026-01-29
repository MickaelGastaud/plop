import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../store/useAuth'
import { useProfil } from '../store/useProfil'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, register } = useAuth()
  const { profil } = useProfil()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [prenom, setPrenom] = useState('')
  const [nom, setNom] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (isLogin) {
      const success = login(email, password)
      if (success) {
        if (!profil.onboardingComplete) {
          navigate('/onboarding')
        } else {
          navigate('/dashboard')
        }
      } else {
        setError('Email ou mot de passe incorrect')
      }
    } else {
      if (password.length < 6) {
        setError('Le mot de passe doit contenir au moins 6 caractères')
        return
      }
      const success = register(email, password, prenom, nom)
      if (success) {
        navigate('/onboarding')
      } else {
        setError('Cet email est déjà utilisé')
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#FFF1F2] flex flex-col">
      
      {/* Header avec image */}
      <header className="relative h-56 overflow-hidden">
        {/* Image de fond */}
        <img 
          src="/header-care.png" 
          alt="Aide à domicile"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FB7185]/80 via-[#FB7185]/60 to-[#FDA4AF]/40" />
        
        {/* Contenu header */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">CeSuCare</h1>
          <p className="text-white/90 text-sm font-medium max-w-xs">
            Reprenez le pouvoir sur votre métier.
          </p>
        </div>
      </header>

      {/* Carte formulaire - remonte sur le header */}
      <div className="flex-1 px-4 -mt-8 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-6 max-w-md mx-auto w-full">
          
          {/* Toggle Connexion / Inscription */}
          <div className="flex bg-slate-100 rounded-2xl p-1 mb-6">
            <button
              onClick={() => { setIsLogin(true); setError('') }}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${
                isLogin 
                  ? 'bg-white text-[#FB7185] shadow-sm' 
                  : 'text-slate-500'
              }`}
            >
              Connexion
            </button>
            <button
              onClick={() => { setIsLogin(false); setError('') }}
              className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${
                !isLogin 
                  ? 'bg-white text-[#FB7185] shadow-sm' 
                  : 'text-slate-500'
              }`}
            >
              Inscription
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Champs inscription uniquement */}
            {!isLogin && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5 ml-1">Prénom</label>
                  <input
                    type="text"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    placeholder="Marie"
                    required={!isLogin}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FB7185]/30 placeholder-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5 ml-1">Nom</label>
                  <input
                    type="text"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    placeholder="Durand"
                    required={!isLogin}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FB7185]/30 placeholder-slate-300"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5 ml-1">Email</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="marie@exemple.fr"
                  required
                  className="w-full px-4 py-3 pl-11 bg-slate-50 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FB7185]/30 placeholder-slate-300"
                />
                <svg className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5 ml-1">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full px-4 py-3 pl-11 pr-11 bg-slate-50 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FB7185]/30 placeholder-slate-300"
                />
                <svg className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Erreur */}
            {error && (
              <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            {/* Mot de passe oublié */}
            {isLogin && (
              <div className="text-right">
                <button type="button" className="text-sm text-[#FB7185] font-medium hover:underline">
                  Mot de passe oublié ?
                </button>
              </div>
            )}

            {/* Bouton submit */}
            <button
              type="submit"
              className="w-full py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-[#FB7185] to-[#FDA4AF] text-white shadow-lg shadow-[#FB7185]/25 hover:shadow-xl transition-all mt-2"
            >
              {isLogin ? 'Se connecter' : "S'inscrire"}
            </button>
          </form>

          {/* Séparateur */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400 font-medium">ou</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          {/* Boutons sociaux */}
          <div className="space-y-3">
            <button className="w-full py-3 px-4 rounded-xl border border-slate-200 flex items-center justify-center gap-3 text-slate-700 font-medium hover:bg-slate-50 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continuer avec Google
            </button>
            <button className="w-full py-3 px-4 rounded-xl border border-slate-200 flex items-center justify-center gap-3 text-slate-700 font-medium hover:bg-slate-50 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Continuer avec Apple
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="py-6 text-center">
          <p className="text-xs text-slate-400">
            En continuant, tu acceptes nos{' '}
            <button className="text-[#FB7185] hover:underline">CGU</button>
            {' '}et notre{' '}
            <button className="text-[#FB7185] hover:underline">Politique de confidentialité</button>
          </p>
        </div>
      </div>
    </div>
  )
}