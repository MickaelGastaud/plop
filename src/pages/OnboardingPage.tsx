import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfil } from '../store/useProfil'

const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']

const TYPES_ACTIVITE = [
  { id: 'aide_quotidien', label: '🏠 Aide à la vie quotidienne', desc: 'Ménage, courses, repas...' },
  { id: 'aide_personne', label: '🧓 Aide à la personne', desc: 'Toilette, habillage, mobilité...' },
  { id: 'garde_enfants', label: '👶 Garde d\'enfants', desc: 'Babysitting, sortie d\'école...' },
  { id: 'compagnie', label: '💬 Compagnie', desc: 'Présence, conversation, sorties...' },
  { id: 'nuit', label: '🌙 Garde de nuit', desc: 'Présence nocturne, surveillance...' },
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

  // État local pour les champs du formulaire
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
      // Sauvegarder le profil avec date d'acceptation
      updateProfil({
        ...form,
        dateAcceptation: new Date().toISOString(),
      })
      completeOnboarding()
      navigate('/dashboard')
    }
  }

  const prevEtape = () => setEtape(e => Math.max(e - 1, 1))

  const updateForm = (field: string, value: string | number | string[] | boolean) => {
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

  // Gestion de la photo
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

  const handleTakePhoto = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      // Pour simplifier, on ouvre juste le sélecteur de fichier en mode capture
      if (fileInputRef.current) {
        fileInputRef.current.setAttribute('capture', 'user')
        fileInputRef.current.click()
      }
      stream.getTracks().forEach(track => track.stop())
    } catch {
      // Fallback : ouvrir le sélecteur classique
      if (fileInputRef.current) {
        fileInputRef.current.click()
      }
    }
  }

  // Vérifier si on peut passer à l'étape suivante
  const canContinue = () => {
    switch (etape) {
      case 1: return form.prenom.trim() !== ''
      case 7: return form.cgvAcceptees && form.rgpdAcceptee
      default: return true
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-teal-50 flex flex-col">
      {/* Barre de progression */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-50">
        <div 
          className="h-1 bg-teal-500 transition-all duration-500"
          style={{ width: `${(etape / totalEtapes) * 100}%` }}
        />
      </div>

      {/* Header */}
      <header className="p-4 flex justify-between items-center">
        {etape > 1 ? (
          <button 
            onClick={prevEtape}
            className="text-teal-600 font-medium"
          >
            ← Retour
          </button>
        ) : (
          <div />
        )}
        <span className="text-sm text-gray-400">{etape}/{totalEtapes}</span>
      </header>

      {/* Contenu principal */}
      <main className="flex-1 flex flex-col justify-center px-6 pb-24 overflow-y-auto">
        
        {/* ÉTAPE 1 : Prénom + Photo */}
        {etape === 1 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center">
              <span className="text-6xl mb-4 block">👋</span>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Salut !
              </h1>
              <p className="text-lg text-gray-600">
                Bienvenue sur CeSuCare.<br />
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
                    className="w-32 h-32 rounded-full object-cover border-4 border-teal-200"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border-4 border-dashed border-gray-300">
                    <span className="text-4xl">📷</span>
                  </div>
                )}
                {form.photo && (
                  <button
                    onClick={() => updateForm('photo', '')}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full text-sm"
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

              <div className="flex gap-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200"
                >
                  📁 Choisir une photo
                </button>
                <button
                  onClick={handleTakePhoto}
                  className="px-4 py-2 bg-teal-100 rounded-lg text-sm font-medium text-teal-700 hover:bg-teal-200"
                >
                  📸 Prendre une photo
                </button>
              </div>
              <p className="text-xs text-gray-400">Optionnel — Tu pourras l'ajouter plus tard</p>
            </div>

            {/* Prénom / Nom */}
            <div className="space-y-4 max-w-md mx-auto w-full">
              <input
                type="text"
                value={form.prenom}
                onChange={(e) => updateForm('prenom', e.target.value)}
                placeholder="Ton prénom *"
                autoFocus
                className="w-full px-6 py-4 text-xl border-2 border-gray-200 rounded-2xl focus:border-teal-500 focus:outline-none text-center"
              />
              <input
                type="text"
                value={form.nom}
                onChange={(e) => updateForm('nom', e.target.value)}
                placeholder="Ton nom"
                className="w-full px-6 py-4 text-xl border-2 border-gray-200 rounded-2xl focus:border-teal-500 focus:outline-none text-center"
              />
            </div>
          </div>
        )}

        {/* ÉTAPE 2 : Coordonnées */}
        {etape === 2 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center">
              <span className="text-6xl mb-4 block">📱</span>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Enchanté {form.prenom} !
              </h1>
              <p className="text-lg text-gray-600">
                Comment on peut te joindre ?
              </p>
            </div>

            <div className="space-y-4 max-w-md mx-auto w-full">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1 ml-2">Téléphone</label>
                <input
                  type="tel"
                  value={form.telephone}
                  onChange={(e) => updateForm('telephone', e.target.value)}
                  placeholder="06 12 34 56 78"
                  className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1 ml-2">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateForm('email', e.target.value)}
                  placeholder="ton.email@exemple.fr"
                  className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1 ml-2">Adresse</label>
                <input
                  type="text"
                  value={form.adresse}
                  onChange={(e) => updateForm('adresse', e.target.value)}
                  placeholder="12 rue des Lilas"
                  className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1 ml-2">Ville</label>
                  <input
                    type="text"
                    value={form.ville}
                    onChange={(e) => updateForm('ville', e.target.value)}
                    placeholder="Paris"
                    className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1 ml-2">Code postal</label>
                  <input
                    type="text"
                    value={form.codePostal}
                    onChange={(e) => updateForm('codePostal', e.target.value)}
                    placeholder="75012"
                    className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ÉTAPE 3 : Infos administratives + CESU */}
        {etape === 3 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center">
              <span className="text-6xl mb-4 block">📋</span>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Quelques infos pratiques
              </h1>
              <p className="text-lg text-gray-600">
                Pour tes futurs contrats, on a besoin de ça :
              </p>
            </div>

            <div className="space-y-4 max-w-md mx-auto w-full">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1 ml-2">Date de naissance</label>
                <input
                  type="date"
                  value={form.dateNaissance}
                  onChange={(e) => updateForm('dateNaissance', e.target.value)}
                  className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1 ml-2">
                  N° Sécurité sociale
                  <span className="text-gray-400 font-normal"> (sur ta carte Vitale)</span>
                </label>
                <input
                  type="text"
                  value={form.numeroSecu}
                  onChange={(e) => updateForm('numeroSecu', e.target.value)}
                  placeholder="2 85 12 75 108 234 56"
                  className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1 ml-2">
                  N° CESU
                  <span className="text-gray-400 font-normal"> (si tu en as déjà un)</span>
                </label>
                <input
                  type="text"
                  value={form.numeroCesu}
                  onChange={(e) => updateForm('numeroCesu', e.target.value)}
                  placeholder="Optionnel"
                  className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none"
                />
                <p className="text-xs text-gray-400 mt-1 ml-2">
                  💡 C'est le numéro que l'URSSAF t'a donné si tu t'es déjà inscrit(e) au CESU
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1 ml-2">
                  Ton expérience
                </label>
                <select
                  value={form.experience}
                  onChange={(e) => updateForm('experience', e.target.value)}
                  className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none bg-white"
                >
                  <option value="">Choisis...</option>
                  <option value="debutant">Je débute dans le métier</option>
                  <option value="1-2ans">1 à 2 ans d'expérience</option>
                  <option value="3-5ans">3 à 5 ans d'expérience</option>
                  <option value="5ans+">Plus de 5 ans d'expérience</option>
                </select>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
                <strong>🔒 Tes données sont en sécurité</strong>
                <p className="mt-1 text-blue-600">On les utilise uniquement pour pré-remplir tes contrats. Rien n'est partagé sans ton accord.</p>
              </div>
            </div>
          </div>
        )}

        {/* ÉTAPE 4 : Diplômes */}
        {etape === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center">
              <span className="text-6xl mb-4 block">🎓</span>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Tes diplômes & formations
              </h1>
              <p className="text-lg text-gray-600">
                Sélectionne ceux que tu as obtenus
              </p>
            </div>

            <div className="space-y-2 max-w-md mx-auto w-full max-h-[40vh] overflow-y-auto">
              {DIPLOMES.map(diplome => (
                <button
                  key={diplome.id}
                  onClick={() => toggleDiplome(diplome.id)}
                  className={`w-full p-3 rounded-xl border-2 text-left transition ${
                    form.diplomes.includes(diplome.id)
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm ${
                      form.diplomes.includes(diplome.id)
                        ? 'bg-teal-500 text-white'
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {form.diplomes.includes(diplome.id) ? '✓' : ''}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">{diplome.label}</p>
                      <p className="text-xs text-gray-500">{diplome.desc}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="max-w-md mx-auto w-full">
              <label className="block text-sm font-medium text-gray-500 mb-1 ml-2">
                Autres formations ou certifications
              </label>
              <textarea
                value={form.autresDiplomes}
                onChange={(e) => updateForm('autresDiplomes', e.target.value)}
                placeholder="Ex: Formation Alzheimer, Gestes et postures, Permis B..."
                rows={3}
                className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none resize-none"
              />
            </div>

            <div className="max-w-md mx-auto">
              <p className="text-sm text-gray-500 text-center">
                💡 Pas de diplôme ? Pas de souci ! L'expérience compte aussi.
              </p>
            </div>
          </div>
        )}

        {/* ÉTAPE 5 : Type d'activité */}
        {etape === 5 && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center">
              <span className="text-6xl mb-4 block">💼</span>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Qu'est-ce que tu recherches ?
              </h1>
              <p className="text-lg text-gray-600">
                Sélectionne les types de missions qui t'intéressent
              </p>
            </div>

            <div className="space-y-3 max-w-md mx-auto w-full">
              {TYPES_ACTIVITE.map(type => (
                <button
                  key={type.id}
                  onClick={() => toggleActivite(type.id)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition ${
                    form.typeActivite.includes(type.id)
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className="font-medium text-gray-900">{type.label}</p>
                  <p className="text-sm text-gray-500">{type.desc}</p>
                </button>
              ))}
            </div>

            <div className="max-w-md mx-auto w-full">
              <label className="block text-sm font-medium text-gray-500 mb-2">
                💰 Salaire minimum souhaité (net/heure)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={10}
                  max={25}
                  value={form.salaireMinimum}
                  onChange={(e) => updateForm('salaireMinimum', Number(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
                />
                <span className="text-2xl font-bold text-teal-600 w-20 text-right">
                  {form.salaireMinimum}€/h
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">SMIC 2025 : ~9,27€ net/h</p>
            </div>
          </div>
        )}

        {/* ÉTAPE 6 : Disponibilités */}
        {etape === 6 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center">
              <span className="text-6xl mb-4 block">📅</span>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Tes disponibilités
              </h1>
              <p className="text-lg text-gray-600">
                Quand es-tu généralement disponible ?
              </p>
            </div>

            <div className="max-w-lg mx-auto w-full overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="p-2"></th>
                    <th className="p-2 text-center">
                      <span className="text-xl">🌅</span>
                      <p className="text-xs text-gray-500">Matin</p>
                    </th>
                    <th className="p-2 text-center">
                      <span className="text-xl">☀️</span>
                      <p className="text-xs text-gray-500">Après-midi</p>
                    </th>
                    <th className="p-2 text-center">
                      <span className="text-xl">🌆</span>
                      <p className="text-xs text-gray-500">Soir</p>
                    </th>
                    <th className="p-2 text-center">
                      <span className="text-xl">🌙</span>
                      <p className="text-xs text-gray-500">Nuit</p>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {form.disponibilites.map((dispo, index) => (
                    <tr key={dispo.jour} className="border-t border-gray-100">
                      <td className="p-2 font-medium text-gray-700">{dispo.jour.slice(0, 3)}</td>
                      {(['matin', 'apresMidi', 'soir', 'nuit'] as const).map(moment => (
                        <td key={moment} className="p-2 text-center">
                          <button
                            onClick={() => toggleDispo(index, moment)}
                            className={`w-10 h-10 rounded-lg transition ${
                              dispo[moment]
                                ? 'bg-teal-500 text-white'
                                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                            }`}
                          >
                            {dispo[moment] ? '✓' : ''}
                          </button>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="max-w-md mx-auto text-center">
              <p className="text-sm text-gray-500">
                💡 Pas de panique, tu pourras modifier ça plus tard !
              </p>
            </div>
          </div>
        )}

        {/* ÉTAPE 7 : CGV / RGPD */}
        {etape === 7 && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center">
              <span className="text-6xl mb-4 block">✅</span>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Dernière étape !
              </h1>
              <p className="text-lg text-gray-600">
                Pour utiliser CeSuCare, merci d'accepter nos conditions
              </p>
            </div>

            <div className="max-w-md mx-auto w-full space-y-4">
              {/* CGV */}
              <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.cgvAcceptees}
                    onChange={(e) => updateForm('cgvAcceptees', e.target.checked)}
                    className="w-6 h-6 rounded border-gray-300 text-teal-600 focus:ring-teal-500 mt-0.5"
                  />
                  <div>
                    <p className="font-medium text-gray-900">
                      J'accepte les Conditions Générales d'Utilisation *
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      En utilisant CeSuCare, tu acceptes nos{' '}
                      <a href="#" className="text-teal-600 underline">CGU</a>
                      {' '}qui définissent les règles d'utilisation de l'application.
                    </p>
                  </div>
                </label>
              </div>

              {/* RGPD */}
              <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.rgpdAcceptee}
                    onChange={(e) => updateForm('rgpdAcceptee', e.target.checked)}
                    className="w-6 h-6 rounded border-gray-300 text-teal-600 focus:ring-teal-500 mt-0.5"
                  />
                  <div>
                    <p className="font-medium text-gray-900">
                      J'accepte la politique de confidentialité *
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Tes données personnelles sont protégées conformément au RGPD.{' '}
                      <a href="#" className="text-teal-600 underline">En savoir plus</a>
                    </p>
                  </div>
                </label>
              </div>

              {/* Résumé */}
              <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
                <p className="text-sm text-teal-800">
                  <strong>🔒 En résumé :</strong>
                </p>
                <ul className="text-sm text-teal-700 mt-2 space-y-1">
                  <li>• Tes données restent confidentielles</li>
                  <li>• Elles servent uniquement à pré-remplir tes documents</li>
                  <li>• Tu peux les modifier ou supprimer à tout moment</li>
                  <li>• On ne vend jamais tes infos à personne</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bouton suivant */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100">
        <div className="max-w-md mx-auto">
          <button
            onClick={nextEtape}
            disabled={!canContinue()}
            className={`w-full py-4 rounded-xl font-bold text-lg transition ${
              !canContinue()
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-teal-600 text-white hover:bg-teal-700 shadow-lg'
            }`}
          >
            {etape === totalEtapes ? (
              <>C'est parti ! 🚀</>
            ) : (
              <>Continuer</>
            )}
          </button>
          {etape === 7 && !canContinue() && (
            <p className="text-center text-sm text-red-500 mt-2">
              Tu dois accepter les deux conditions pour continuer
            </p>
          )}
        </div>
      </div>

      {/* Animation CSS */}
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