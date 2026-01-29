import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfil } from '../store/useProfil'
import BottomNav from '../components/BottomNav'

const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']

const DIPLOMES = [
  { id: 'deavs', label: 'DEAVS' },
  { id: 'advf', label: 'ADVF' },
  { id: 'deaes', label: 'DEAES' },
  { id: 'bac_assp', label: 'Bac Pro ASSP' },
  { id: 'cap_petite_enfance', label: 'CAP Petite Enfance' },
  { id: 'aide_soignant', label: 'DEAS' },
  { id: 'sst', label: 'SST' },
  { id: 'psc1', label: 'PSC1' },
]

const SERVICES = [
  { id: 'aide_quotidien', label: 'Aide vie quotidienne', icon: '🏠' },
  { id: 'aide_personne', label: 'Aide à la personne', icon: '🧓' },
  { id: 'garde_enfants', label: 'Garde d\'enfants', icon: '👶' },
  { id: 'compagnie', label: 'Compagnie', icon: '💬' },
  { id: 'nuit', label: 'Garde de nuit', icon: '🌙' },
]

export default function ProfilEditPage() {
  const navigate = useNavigate()
  const { profil, updateProfil } = useProfil()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [activeSection, setActiveSection] = useState<string | null>(null)

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
    experience: profil.experience || '',
    diplomes: profil.diplomes || [],
    autresDiplomes: profil.autresDiplomes || '',
    typeActivite: profil.typeActivite || [],
    salaireMinimum: profil.salaireMinimum || 12,
    zone: profil.zone || '',
    tarifMin: profil.tarifMin || 0,
    tarifMax: profil.tarifMax || 0,
    bio: profil.bio || '',
    disponibilites: profil.disponibilites || JOURS.map(jour => ({
      jour,
      matin: false,
      apresMidi: false,
      soir: false,
      nuit: false
    })),
  })

  const updateForm = (field: string, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }))
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

  const toggleDiplome = (id: string) => {
    setForm(prev => ({
      ...prev,
      diplomes: prev.diplomes.includes(id)
        ? prev.diplomes.filter(d => d !== id)
        : [...prev.diplomes, id]
    }))
  }

  const toggleService = (id: string) => {
    setForm(prev => ({
      ...prev,
      typeActivite: prev.typeActivite.includes(id)
        ? prev.typeActivite.filter(s => s !== id)
        : [...prev.typeActivite, id]
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

  const handleSave = () => {
    updateProfil(form)
    navigate('/profil')
  }

  const Section = ({ id, title, icon, children }: { id: string; title: string; icon: string; children: React.ReactNode }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <button
        onClick={() => setActiveSection(activeSection === id ? null : id)}
        className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{icon}</span>
          <span className="font-medium text-slate-800">{title}</span>
        </div>
        <svg 
          className={`w-5 h-5 text-slate-400 transition-transform ${activeSection === id ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {activeSection === id && (
        <div className="p-4 pt-0 border-t border-slate-100">
          {children}
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-[#FFF1F2] pb-32">
      {/* Header */}
      <header className="bg-gradient-to-br from-[#FB7185] to-[#FDA4AF] px-6 pt-14 pb-6">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => navigate('/profil')}
              className="flex items-center gap-2 text-white/90 font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Retour
            </button>
            <h1 className="text-lg font-bold text-white">Modifier mon profil</h1>
            <div className="w-16" />
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-4">
        
        {/* Photo de profil */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col items-center">
          <div className="relative mb-4">
            {form.photo ? (
              <img 
                src={form.photo} 
                alt="Photo" 
                className="w-24 h-24 rounded-2xl object-cover ring-4 ring-[#FDA4AF]/30"
              />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-[#FFF1F2] flex items-center justify-center">
                <span className="text-3xl font-bold text-[#FB7185]">
                  {form.prenom?.[0]?.toUpperCase() || '?'}{form.nom?.[0]?.toUpperCase() || ''}
                </span>
              </div>
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
            className="px-4 py-2 bg-[#FFF1F2] text-[#FB7185] rounded-xl text-sm font-medium hover:bg-[#FDA4AF]/20 transition-colors"
          >
            {form.photo ? 'Changer la photo' : 'Ajouter une photo'}
          </button>
        </div>

        {/* Identité */}
        <Section id="identite" title="Identité" icon="👤">
          <div className="space-y-3 mt-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Prénom</label>
              <input
                type="text"
                value={form.prenom}
                onChange={(e) => updateForm('prenom', e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FB7185]/30"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Nom</label>
              <input
                type="text"
                value={form.nom}
                onChange={(e) => updateForm('nom', e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FB7185]/30"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Date de naissance</label>
              <input
                type="date"
                value={form.dateNaissance}
                onChange={(e) => updateForm('dateNaissance', e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FB7185]/30"
              />
            </div>
          </div>
        </Section>

        {/* Contact */}
        <Section id="contact" title="Contact" icon="📱">
          <div className="space-y-3 mt-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Téléphone</label>
              <input
                type="tel"
                value={form.telephone}
                onChange={(e) => updateForm('telephone', e.target.value)}
                placeholder="06 12 34 56 78"
                className="w-full px-4 py-3 bg-slate-50 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FB7185]/30 placeholder-slate-300"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => updateForm('email', e.target.value)}
                placeholder="email@exemple.fr"
                className="w-full px-4 py-3 bg-slate-50 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FB7185]/30 placeholder-slate-300"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Adresse</label>
              <input
                type="text"
                value={form.adresse}
                onChange={(e) => updateForm('adresse', e.target.value)}
                placeholder="12 rue des Lilas"
                className="w-full px-4 py-3 bg-slate-50 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FB7185]/30 placeholder-slate-300"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Ville</label>
                <input
                  type="text"
                  value={form.ville}
                  onChange={(e) => updateForm('ville', e.target.value)}
                  placeholder="Paris"
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FB7185]/30 placeholder-slate-300"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Code postal</label>
                <input
                  type="text"
                  value={form.codePostal}
                  onChange={(e) => updateForm('codePostal', e.target.value)}
                  placeholder="75012"
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FB7185]/30 placeholder-slate-300"
                />
              </div>
            </div>
          </div>
        </Section>

        {/* Administratif */}
        <Section id="admin" title="Administratif" icon="📋">
          <div className="space-y-3 mt-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">N° Sécurité sociale</label>
              <input
                type="text"
                value={form.numeroSecu}
                onChange={(e) => updateForm('numeroSecu', e.target.value)}
                placeholder="2 85 12 75 108 234 56"
                className="w-full px-4 py-3 bg-slate-50 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FB7185]/30 placeholder-slate-300"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">N° CESU</label>
              <input
                type="text"
                value={form.numeroCesu}
                onChange={(e) => updateForm('numeroCesu', e.target.value)}
                placeholder="Optionnel"
                className="w-full px-4 py-3 bg-slate-50 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FB7185]/30 placeholder-slate-300"
              />
            </div>
          </div>
        </Section>

        {/* Expérience & Diplômes */}
        <Section id="experience" title="Expérience & Diplômes" icon="🎓">
          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">Expérience</label>
              <select
                value={form.experience}
                onChange={(e) => updateForm('experience', e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FB7185]/30"
              >
                <option value="">Choisis...</option>
                <option value="debutant">Débutant</option>
                <option value="1-2ans">1 à 2 ans</option>
                <option value="3-5ans">3 à 5 ans</option>
                <option value="5ans+">Plus de 5 ans</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">Diplômes</label>
              <div className="flex flex-wrap gap-2">
                {DIPLOMES.map(d => (
                  <button
                    key={d.id}
                    onClick={() => toggleDiplome(d.id)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      form.diplomes.includes(d.id)
                        ? 'bg-[#FB7185] text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Autres formations</label>
              <textarea
                value={form.autresDiplomes}
                onChange={(e) => updateForm('autresDiplomes', e.target.value)}
                placeholder="Formation Alzheimer, Permis B..."
                rows={2}
                className="w-full px-4 py-3 bg-slate-50 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FB7185]/30 placeholder-slate-300 resize-none"
              />
            </div>
          </div>
        </Section>

        {/* Services */}
        <Section id="services" title="Services proposés" icon="💼">
          <div className="space-y-2 mt-4">
            {SERVICES.map(s => (
              <button
                key={s.id}
                onClick={() => toggleService(s.id)}
                className={`w-full p-3 rounded-xl text-left transition-all flex items-center gap-3 ${
                  form.typeActivite.includes(s.id)
                    ? 'bg-[#FB7185] text-white'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span className="text-xl">{s.icon}</span>
                <span className="font-medium">{s.label}</span>
              </button>
            ))}
          </div>
        </Section>

        {/* Zone & Tarifs */}
        <Section id="tarifs" title="Zone & Tarifs" icon="💰">
          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Zone d'intervention</label>
              <input
                type="text"
                value={form.zone}
                onChange={(e) => updateForm('zone', e.target.value)}
                placeholder="Paris et proche banlieue (20km)"
                className="w-full px-4 py-3 bg-slate-50 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FB7185]/30 placeholder-slate-300"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Tarif min (€/h)</label>
                <input
                  type="number"
                  value={form.tarifMin || ''}
                  onChange={(e) => updateForm('tarifMin', Number(e.target.value))}
                  placeholder="14"
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FB7185]/30 placeholder-slate-300"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Tarif max (€/h)</label>
                <input
                  type="number"
                  value={form.tarifMax || ''}
                  onChange={(e) => updateForm('tarifMax', Number(e.target.value))}
                  placeholder="20"
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FB7185]/30 placeholder-slate-300"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">Salaire minimum souhaité</label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={10}
                  max={25}
                  value={form.salaireMinimum}
                  onChange={(e) => updateForm('salaireMinimum', Number(e.target.value))}
                  className="flex-1 h-2 bg-[#FDA4AF]/30 rounded-lg appearance-none cursor-pointer accent-[#FB7185]"
                />
                <span className="text-lg font-bold text-[#FB7185] w-16 text-right">
                  {form.salaireMinimum}€/h
                </span>
              </div>
            </div>
          </div>
        </Section>

        {/* Disponibilités */}
        <Section id="disponibilites" title="Disponibilités" icon="📅">
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="p-2"></th>
                  <th className="p-1 text-center text-xs text-slate-400">Matin</th>
                  <th className="p-1 text-center text-xs text-slate-400">Après-midi</th>
                  <th className="p-1 text-center text-xs text-slate-400">Soir</th>
                  <th className="p-1 text-center text-xs text-slate-400">Nuit</th>
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
                          className={`w-9 h-9 rounded-lg transition-all text-sm ${
                            dispo[moment]
                              ? 'bg-[#FB7185] text-white'
                              : 'bg-slate-100 text-slate-300 hover:bg-slate-200'
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
        </Section>

        {/* Bio */}
        <Section id="bio" title="Présentation" icon="✍️">
          <div className="mt-4">
            <label className="block text-xs font-medium text-slate-400 mb-1">Ta bio</label>
            <textarea
              value={form.bio}
              onChange={(e) => updateForm('bio', e.target.value)}
              placeholder="Parle de toi, de ta motivation, de ce qui te rend unique..."
              rows={4}
              className="w-full px-4 py-3 bg-slate-50 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#FB7185]/30 placeholder-slate-300 resize-none"
            />
          </div>
        </Section>

      </main>

      {/* Bouton sauvegarder */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-white/80 backdrop-blur-lg border-t border-slate-100">
        <div className="max-w-lg mx-auto">
          <button
            onClick={handleSave}
            className="w-full py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-[#FB7185] to-[#FDA4AF] text-white shadow-lg shadow-[#FB7185]/25 hover:shadow-xl transition-all"
          >
            Enregistrer
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}