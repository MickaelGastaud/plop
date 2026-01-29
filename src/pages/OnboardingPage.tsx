import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfil } from '../store/useProfil'

const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']

const TYPES_ACTIVITE = [
  { id: 'aide_quotidien', label: 'Aide à la vie quotidienne', icon: '🏠', desc: 'Ménage, courses, repas...' },
  { id: 'aide_personne', label: 'Aide à la personne', icon: '🧓', desc: 'Toilette, habillage, mobilité...' },
  { id: 'garde_enfants', label: 'Garde d\'enfants', icon: '👶', desc: 'Babysitting, sortie d\'école...' },
  { id: 'compagnie', label: 'Compagnie', icon: '💬', desc: 'Présence, conversation, sorties...' },
  { id: 'nuit', label: 'Garde de nuit', icon: '🌙', desc: 'Présence nocturne, surveillance...' },
]

const DIPLOMES = [
  { id: 'deavs', label: 'DEAVS', desc: 'Diplôme d\'État d\'Auxiliaire de Vie Sociale' },
  { id: 'advf', label: 'ADVF', desc: 'Assistant de Vie aux Familles' },
  { id: 'bep_css', label: 'BEP CSS', desc: 'Carrières Sanitaires et Sociales' },
  { id: 'bac_assp', label: 'Bac Pro ASSP', desc: 'Accompagnement Soins et Services à la Personne' },
  { id: 'deaes', label: 'DEAES', desc: 'Diplôme d\'État d\'Accompagnant Éducatif et Social' },
  { id: 'titre_advf', label: 'Titre pro ADVF', desc: 'Titre professionnel Assistant de Vie aux Familles' },
  { id: 'cap_petite_enfance', label: 'CAP Petite Enfance', desc: 'CAP Accompagnant Éducatif Petite Enfance' },
  { id: 'aide_soignant', label: 'DEAS', desc: 'Diplôme d\'État d\'Aide-Soignant' },
  { id: 'sst', label: 'SST', desc: 'Sauveteur Secouriste du Travail' },
  { id: 'psc1', label: 'PSC1', desc: 'Prévention et Secours Civiques niveau 1' },
]

export default function OnboardingPage() {
  const navigate = useNavigate()
  const { profil, updateProfil, completeOnboarding } = useProfil()
  const [etape, setEtape] = useState(1)
  const totalEtapes = 7
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    prenom: profil.prenom || '',
    nom: profil.nom || '',
    photo: profil.photo || '',
    telephone: profil.telephone || '',
    email: profil.email || '',
    adresse: profil.adresse || '',
    ville: profil.ville || '',
    codePostal: profil.codePostal || '',
    dateNaissance: profil.dateNaissance || '',
    numeroSecu: profil.numeroSecu || '',
    numeroCesu: profil.numeroCesu || '',
    diplomes: profil.diplomes || [],
    autresDiplomes: profil.autresDiplomes || '',
    experience: profil.experience || '',
    salaireMinimum: profil.salaireMinimum || 12,
    typeActivite: profil.typeActivite || [],
    disponibilites: profil.disponibilites || JOURS.map(jour => ({
      jour,
      matin: false,
      apresMidi: false,
      soir: false,
      nuit: false
    })),
    cgvAcceptees: false,
    rgpdAcceptee: false,
  })

  const nextEtape = () => {
    if (etape < totalEtapes) {
      setEtape(e => e + 1)
    } else {
      updateProfil({
        ...form,
        dateAcceptation: new Date().toISOString(),
      })
      completeOnboarding()
      navigate('/dashboard')
    }
  }

  const prevEtape = () => setEtape(e => Math.max(e - 1, 1))

  const updateForm = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const toggleActivite = (id: string) => {
    setForm(prev => ({
      ...prev,
      typeActivite: prev.typeActivite.includes(id)
        ? prev.typeActivite.filter(a => a !== id)
        : [...prev.typeActivite, id]
    }))
  }

  const toggleDiplome = (id: string) => {
    setForm(prev => ({
      ...prev,
      diplomes: prev.diplomes.includes(id)
        ? prev.diplomes.filter(d => d !== id)
        : [...prev.diplomes, id]
    }))
  }

  const toggleDispo = (jourIndex: number, moment: 'matin' | 'apresMidi' | 'soir' | 'nuit') => {
    setForm(prev => ({
      ...prev,
      disponibilites: prev.disponibilites.map((dispo, index) => 
        index === jourIndex 
          ? { ...dispo, [moment]: !dispo[moment] }
          : dispo
      )
    }))
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        updateForm('photo', reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const canContinue = () => {
    switch (etape) {
      case 1: return form.prenom.trim() !== ''
      case 7: return form.cgvAcceptees && form.rgpdAcceptee
      default: return true
    }
  }

  return (
    <div className="min-h-screen bg-[#FFF1F2] flex flex-col">
      {/* Barre de progression */}
      <div className="fixed top-0 left-0 right-0 h-1.5 bg-[#FDA4AF]/30 z-50">
        <div 
          className="h-full bg-gradient-to-r from-[#FB7185] to-[#FDA4AF] transition-all duration-500 rounded-r-full"
          style={{ width: `${(etape / totalEtapes) * 100}%` }}
        />
      </div>

      {/* Header */}
      <header className="p-4 flex justify-between items-center">
        {etape > 1 ? (
          <button 
            onClick={prevEtape}
            className="flex items-center gap-2 text-[#FB7185] font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour
          </button>
        ) : (
          <div />
        )}
        <span className="text-sm text-slate-400 font-medium">{etape}/{totalEtapes}</span>
      </header>

      {/* Contenu principal */}
      <main className="flex-1 flex flex-col justify-center px-6 pb-28 overflow-y-auto">
        
        {/* ÉTAPE 1 : Prénom + Photo */}
        {etape === 1 && (
          <div className="space-y-8 animate-fadeIn max-w-md mx-auto w-full">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#FB7185] to-[#FDA4AF] rounded-3xl flex items-center justify-center shadow-lg shadow-[#FB7185]/20">
                <span className="text-4xl">👋</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-800 mb-2">
                Bienvenue sur CeSuCare
              </h1>
              <p className="text-slate-500">
                On fait connaissance ?
              </p>
            </div>

            {/* Photo */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                {form.photo ? (
                  <img 
                    src={form.photo} 
                    alt="Ta photo" 
                    className="w-28 h-28 rounded-3xl object-cover ring-4 ring-[#FDA4AF]/30 shadow-lg"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-3xl bg-white flex items-center justify-center border-2 border-dashed border-[#FDA4AF] shadow-sm">
                    <svg className="w-10 h-10 text-[#FDA4AF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                )}
                {form.photo && (
                  <button
                    onClick={() => updateForm('photo', '')}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-xl text-sm shadow-lg"
                  >
                    ✕
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-white rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 shadow-sm border border-slate-200"
              >
                {form.photo ? 'Changer la photo' : 'Ajouter une photo'}
              </button>
              <p className="text-xs text-slate-400">Optionnel</p>
            </div>

            {/* Prénom / Nom */}
            <div className="space-y-3">
              <input
                type="text"
                value={form.prenom}
                onChange={(e) => updateForm('prenom', e.target.value)}
                placeholder="Ton prénom *"
                autoFocus
                className="w-full px-5 py-4 text-lg bg-white border-2 border-slate-200 rounded-2xl focus:border-[#FB7185] focus:outline-none text-center font-medium placeholder-slate-300"
              />
              <input
                type="text"
                value={form.nom}
                onChange={(e) => updateForm('nom', e.target.value)}
                placeholder="Ton nom"
                className="w-full px-5 py-4 text-lg bg-white border-2 border-slate-200 rounded-2xl focus:border-[#FB7185] focus:outline-none text-center font-medium placeholder-slate-300"
              />
            </div>
          </div>
        )}

        {/* ÉTAPE 2 : Coordonnées */}
        {etape === 2 && (
          <div className="space-y-6 animate-fadeIn max-w-md mx-auto w-full">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#FB7185] to-[#FDA4AF] rounded-2xl flex items-center justify-center shadow-lg shadow-[#FB7185]/20">
                <span className="text-3xl">📱</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-800 mb-1">
                Enchanté {form.prenom} !
              </h1>
              <p className="text-slate-500">Comment te joindre ?</p>
            </div>

            <div className="space-y-3">
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                <label className="block text-xs font-medium text-slate-400 mb-1">Téléphone</label>
                <input
                  type="tel"
                  value={form.telephone}
                  onChange={(e) => updateForm('telephone', e.target.value)}
                  placeholder="06 12 34 56 78"
                  className="w-full text-slate-800 font-medium focus:outline-none placeholder-slate-300"
                />
              </div>
              
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                <label className="block text-xs font-medium text-slate-400 mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateForm('email', e.target.value)}
                  placeholder="ton.email@exemple.fr"
                  className="w-full text-slate-800 font-medium focus:outline-none placeholder-slate-300"
                />
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                <label className="block text-xs font-medium text-slate-400 mb-1">Adresse</label>
                <input
                  type="text"
                  value={form.adresse}
                  onChange={(e) => updateForm('adresse', e.target.value)}
                  placeholder="12 rue des Lilas"
                  className="w-full text-slate-800 font-medium focus:outline-none placeholder-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                  <label className="block text-xs font-medium text-slate-400 mb-1">Ville</label>
                  <input
                    type="text"
                    value={form.ville}
                    onChange={(e) => updateForm('ville', e.target.value)}
                    placeholder="Paris"
                    className="w-full text-slate-800 font-medium focus:outline-none placeholder-slate-300"
                  />
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                  <label className="block text-xs font-medium text-slate-400 mb-1">Code postal</label>
                  <input
                    type="text"
                    value={form.codePostal}
                    onChange={(e) => updateForm('codePostal', e.target.value)}
                    placeholder="75012"
                    className="w-full text-slate-800 font-medium focus:outline-none placeholder-slate-300"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ÉTAPE 3 : Infos administratives */}
        {etape === 3 && (
          <div className="space-y-6 animate-fadeIn max-w-md mx-auto w-full">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#FB7185] to-[#FDA4AF] rounded-2xl flex items-center justify-center shadow-lg shadow-[#FB7185]/20">
                <span className="text-3xl">📋</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-800 mb-1">
                Infos pratiques
              </h1>
              <p className="text-slate-500">Pour tes futurs contrats</p>
            </div>

            <div className="space-y-3">
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                <label className="block text-xs font-medium text-slate-400 mb-1">Date de naissance</label>
                <input
                  type="date"
                  value={form.dateNaissance}
                  onChange={(e) => updateForm('dateNaissance', e.target.value)}
                  className="w-full text-slate-800 font-medium focus:outline-none"
                />
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                <label className="block text-xs font-medium text-slate-400 mb-1">N° Sécurité sociale</label>
                <input
                  type="text"
                  value={form.numeroSecu}
                  onChange={(e) => updateForm('numeroSecu', e.target.value)}
                  placeholder="2 85 12 75 108 234 56"
                  className="w-full text-slate-800 font-medium focus:outline-none placeholder-slate-300"
                />
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                <label className="block text-xs font-medium text-slate-400 mb-1">N° CESU (optionnel)</label>
                <input
                  type="text"
                  value={form.numeroCesu}
                  onChange={(e) => updateForm('numeroCesu', e.target.value)}
                  placeholder="Si tu en as déjà un"
                  className="w-full text-slate-800 font-medium focus:outline-none placeholder-slate-300"
                />
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                <label className="block text-xs font-medium text-slate-400 mb-2">Ton expérience</label>
                <select
                  value={form.experience}
                  onChange={(e) => updateForm('experience', e.target.value)}
                  className="w-full text-slate-800 font-medium focus:outline-none bg-transparent"
                >
                  <option value="">Choisis...</option>
                  <option value="debutant">Je débute dans le métier</option>
                  <option value="1-2ans">1 à 2 ans d'expérience</option>
                  <option value="3-5ans">3 à 5 ans d'expérience</option>
                  <option value="5ans+">Plus de 5 ans d'expérience</option>
                </select>
              </div>
            </div>

            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
              <p className="text-sm text-blue-800 font-medium">🔒 Tes données sont en sécurité</p>
              <p className="text-xs text-blue-600 mt-1">Uniquement utilisées pour pré-remplir tes contrats.</p>
            </div>
          </div>
        )}

        {/* ÉTAPE 4 : Diplômes */}
        {etape === 4 && (
          <div className="space-y-6 animate-fadeIn max-w-md mx-auto w-full">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#FB7185] to-[#FDA4AF] rounded-2xl flex items-center justify-center shadow-lg shadow-[#FB7185]/20">
                <span className="text-3xl">🎓</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-800 mb-1">
                Tes diplômes
              </h1>
              <p className="text-slate-500">Sélectionne ceux que tu as</p>
            </div>

            <div className="space-y-2 max-h-[40vh] overflow-y-auto">
              {DIPLOMES.map(diplome => (
                <button
                  key={diplome.id}
                  onClick={() => toggleDiplome(diplome.id)}
                  className={`w-full p-4 rounded-2xl text-left transition-all ${
                    form.diplomes.includes(diplome.id)
                      ? 'bg-[#FB7185] text-white shadow-lg shadow-[#FB7185]/25'
                      : 'bg-white border border-slate-100 shadow-sm hover:border-[#FDA4AF]'
                  }`}
                >
                  <p className={`font-medium ${form.diplomes.includes(diplome.id) ? 'text-white' : 'text-slate-800'}`}>
                    {diplome.label}
                  </p>
                  <p className={`text-xs mt-0.5 ${form.diplomes.includes(diplome.id) ? 'text-white/80' : 'text-slate-400'}`}>
                    {diplome.desc}
                  </p>
                </button>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
              <label className="block text-xs font-medium text-slate-400 mb-2">Autres formations</label>
              <textarea
                value={form.autresDiplomes}
                onChange={(e) => updateForm('autresDiplomes', e.target.value)}
                placeholder="Formation Alzheimer, Permis B..."
                rows={2}
                className="w-full text-slate-800 focus:outline-none placeholder-slate-300 resize-none"
              />
            </div>

            <p className="text-sm text-slate-400 text-center">
              💡 Pas de diplôme ? Pas de souci, l'expérience compte aussi !
            </p>
          </div>
        )}

        {/* ÉTAPE 5 : Type d'activité */}
        {etape === 5 && (
          <div className="space-y-6 animate-fadeIn max-w-md mx-auto w-full">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#FB7185] to-[#FDA4AF] rounded-2xl flex items-center justify-center shadow-lg shadow-[#FB7185]/20">
                <span className="text-3xl">💼</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-800 mb-1">
                Tes missions
              </h1>
              <p className="text-slate-500">Qu'est-ce qui t'intéresse ?</p>
            </div>

            <div className="space-y-2">
              {TYPES_ACTIVITE.map(type => (
                <button
                  key={type.id}
                  onClick={() => toggleActivite(type.id)}
                  className={`w-full p-4 rounded-2xl text-left transition-all flex items-center gap-4 ${
                    form.typeActivite.includes(type.id)
                      ? 'bg-[#FB7185] text-white shadow-lg shadow-[#FB7185]/25'
                      : 'bg-white border border-slate-100 shadow-sm hover:border-[#FDA4AF]'
                  }`}
                >
                  <span className="text-2xl">{type.icon}</span>
                  <div>
                    <p className={`font-medium ${form.typeActivite.includes(type.id) ? 'text-white' : 'text-slate-800'}`}>
                      {type.label}
                    </p>
                    <p className={`text-xs ${form.typeActivite.includes(type.id) ? 'text-white/80' : 'text-slate-400'}`}>
                      {type.desc}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <label className="block text-sm font-medium text-slate-600 mb-3">
                💰 Salaire minimum souhaité
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={10}
                  max={25}
                  value={form.salaireMinimum}
                  onChange={(e) => updateForm('salaireMinimum', Number(e.target.value))}
                  className="flex-1 h-2 bg-[#FDA4AF]/30 rounded-lg appearance-none cursor-pointer accent-[#FB7185]"
                />
                <span className="text-2xl font-bold text-[#FB7185] w-20 text-right">
                  {form.salaireMinimum}€/h
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-2">SMIC 2025 : ~9,27€ net/h</p>
            </div>
          </div>
        )}

        {/* ÉTAPE 6 : Disponibilités */}
        {etape === 6 && (
          <div className="space-y-6 animate-fadeIn max-w-lg mx-auto w-full">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#FB7185] to-[#FDA4AF] rounded-2xl flex items-center justify-center shadow-lg shadow-[#FB7185]/20">
                <span className="text-3xl">📅</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-800 mb-1">
                Tes disponibilités
              </h1>
              <p className="text-slate-500">Quand es-tu libre ?</p>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="p-2"></th>
                    <th className="p-2 text-center">
                      <span className="text-lg">🌅</span>
                      <p className="text-[10px] text-slate-400 mt-1">Matin</p>
                    </th>
                    <th className="p-2 text-center">
                      <span className="text-lg">☀️</span>
                      <p className="text-[10px] text-slate-400 mt-1">Après-midi</p>
                    </th>
                    <th className="p-2 text-center">
                      <span className="text-lg">🌆</span>
                      <p className="text-[10px] text-slate-400 mt-1">Soir</p>
                    </th>
                    <th className="p-2 text-center">
                      <span className="text-lg">🌙</span>
                      <p className="text-[10px] text-slate-400 mt-1">Nuit</p>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {form.disponibilites.map((dispo, index) => (
                    <tr key={dispo.jour}>
                      <td className="p-2 font-medium text-slate-600 text-sm">{dispo.jour.slice(0, 3)}</td>
                      {(['matin', 'apresMidi', 'soir', 'nuit'] as const).map(moment => (
                        <td key={moment} className="p-1 text-center">
                          <button
                            onClick={() => toggleDispo(index, moment)}
                            className={`w-10 h-10 rounded-xl transition-all ${
                              dispo[moment]
                                ? 'bg-[#FB7185] text-white shadow-md'
                                : 'bg-slate-100 text-slate-300 hover:bg-[#FDA4AF]/20'
                            }`}
                          >
                            {dispo[moment] && '✓'}
                          </button>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-sm text-slate-400 text-center">
              💡 Tu pourras modifier ça plus tard !
            </p>
          </div>
        )}

        {/* ÉTAPE 7 : CGV / RGPD */}
        {etape === 7 && (
          <div className="space-y-6 animate-fadeIn max-w-md mx-auto w-full">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[#FB7185] to-[#FDA4AF] rounded-2xl flex items-center justify-center shadow-lg shadow-[#FB7185]/20">
                <span className="text-3xl">✅</span>
              </div>
              <h1 className="text-2xl font-bold text-slate-800 mb-1">
                Dernière étape !
              </h1>
              <p className="text-slate-500">Accepte nos conditions</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => updateForm('cgvAcceptees', !form.cgvAcceptees)}
                className={`w-full p-4 rounded-2xl text-left transition-all flex items-start gap-4 ${
                  form.cgvAcceptees
                    ? 'bg-[#FB7185] text-white shadow-lg'
                    : 'bg-white border border-slate-200 shadow-sm'
                }`}
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  form.cgvAcceptees ? 'bg-white/20' : 'bg-slate-100'
                }`}>
                  {form.cgvAcceptees && <span className="text-white text-sm">✓</span>}
                </div>
                <div>
                  <p className={`font-medium ${form.cgvAcceptees ? 'text-white' : 'text-slate-800'}`}>
                    J'accepte les CGU *
                  </p>
                  <p className={`text-xs mt-1 ${form.cgvAcceptees ? 'text-white/80' : 'text-slate-400'}`}>
                    Les règles d'utilisation de l'application
                  </p>
                </div>
              </button>

              <button
                onClick={() => updateForm('rgpdAcceptee', !form.rgpdAcceptee)}
                className={`w-full p-4 rounded-2xl text-left transition-all flex items-start gap-4 ${
                  form.rgpdAcceptee
                    ? 'bg-[#FB7185] text-white shadow-lg'
                    : 'bg-white border border-slate-200 shadow-sm'
                }`}
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  form.rgpdAcceptee ? 'bg-white/20' : 'bg-slate-100'
                }`}>
                  {form.rgpdAcceptee && <span className="text-white text-sm">✓</span>}
                </div>
                <div>
                  <p className={`font-medium ${form.rgpdAcceptee ? 'text-white' : 'text-slate-800'}`}>
                    J'accepte la politique de confidentialité *
                  </p>
                  <p className={`text-xs mt-1 ${form.rgpdAcceptee ? 'text-white/80' : 'text-slate-400'}`}>
                    Protection de tes données (RGPD)
                  </p>
                </div>
              </button>
            </div>

            <div className="bg-[#FFF1F2] rounded-2xl p-4 border border-[#FDA4AF]/30">
              <p className="text-sm text-[#FB7185] font-medium">🔒 En résumé</p>
              <ul className="text-xs text-slate-600 mt-2 space-y-1">
                <li>• Tes données restent confidentielles</li>
                <li>• On ne vend jamais tes infos</li>
                <li>• Tu peux tout modifier ou supprimer</li>
              </ul>
            </div>
          </div>
        )}
      </main>

      {/* Bouton suivant */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-lg border-t border-slate-100">
        <div className="max-w-md mx-auto">
          <button
            onClick={nextEtape}
            disabled={!canContinue()}
            className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
              !canContinue()
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#FB7185] to-[#FDA4AF] text-white shadow-lg shadow-[#FB7185]/25 hover:shadow-xl'
            }`}
          >
            {etape === totalEtapes ? "C'est parti ! 🚀" : 'Continuer'}
          </button>
          {etape === 7 && !canContinue() && (
            <p className="text-center text-xs text-red-500 mt-2">
              Accepte les deux conditions pour continuer
            </p>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  )
}