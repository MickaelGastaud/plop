import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useProfil } from '../store/useProfil'

const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']

const TYPES_ACTIVITE_LABELS: Record<string, string> = {
  'aide_quotidien': '🏠 Aide à la vie quotidienne',
  'aide_personne': '🧓 Aide à la personne',
  'garde_enfants': '👶 Garde d\'enfants',
  'compagnie': '💬 Compagnie',
  'nuit': '🌙 Garde de nuit',
}

const DIPLOMES_LABELS: Record<string, string> = {
  'deavs': 'DEAVS',
  'advf': 'ADVF',
  'bep_css': 'BEP CSS',
  'bac_assp': 'Bac Pro ASSP',
  'deaes': 'DEAES',
  'titre_advf': 'Titre pro ADVF',
  'cap_petite_enfance': 'CAP Petite Enfance',
  'aide_soignant': 'DEAS',
  'sst': 'SST',
  'psc1': 'PSC1',
}

const EXPERIENCE_LABELS: Record<string, string> = {
  'debutant': 'Débutant(e)',
  '1-2ans': '1 à 2 ans',
  '3-5ans': '3 à 5 ans',
  '5ans+': 'Plus de 5 ans',
}

const TYPES_ACTIVITE = [
  { id: 'aide_quotidien', label: '🏠 Aide à la vie quotidienne' },
  { id: 'aide_personne', label: '🧓 Aide à la personne' },
  { id: 'garde_enfants', label: '👶 Garde d\'enfants' },
  { id: 'compagnie', label: '💬 Compagnie' },
  { id: 'nuit', label: '🌙 Garde de nuit' },
]

const DIPLOMES = [
  { id: 'deavs', label: 'DEAVS' },
  { id: 'advf', label: 'ADVF' },
  { id: 'bep_css', label: 'BEP CSS' },
  { id: 'bac_assp', label: 'Bac Pro ASSP' },
  { id: 'deaes', label: 'DEAES' },
  { id: 'titre_advf', label: 'Titre pro ADVF' },
  { id: 'cap_petite_enfance', label: 'CAP Petite Enfance' },
  { id: 'aide_soignant', label: 'DEAS' },
  { id: 'sst', label: 'SST' },
  { id: 'psc1', label: 'PSC1' },
]

type EditSection = 'infos' | 'coordonnees' | 'activites' | 'diplomes' | 'disponibilites' | null

export default function ProfilPage() {
  const { profil, updateProfil } = useProfil()
  const [editSection, setEditSection] = useState<EditSection>(null)
  const [tempData, setTempData] = useState<Partial<typeof profil>>({})

  // Ouvrir l'édition d'une section
  const openEdit = (section: EditSection) => {
    setTempData({ ...profil })
    setEditSection(section)
  }

  // Sauvegarder les modifications
  const saveEdit = () => {
    updateProfil(tempData)
    setEditSection(null)
  }

  // Annuler les modifications
  const cancelEdit = () => {
    setTempData({})
    setEditSection(null)
  }

  // Toggle pour les activités
  const toggleActivite = (id: string) => {
    const current = tempData.typeActivite || profil.typeActivite || []
    const updated = current.includes(id)
      ? current.filter(a => a !== id)
      : [...current, id]
    setTempData(prev => ({ ...prev, typeActivite: updated }))
  }

  // Toggle pour les diplômes
  const toggleDiplome = (id: string) => {
    const current = tempData.diplomes || profil.diplomes || []
    const updated = current.includes(id)
      ? current.filter(d => d !== id)
      : [...current, id]
    setTempData(prev => ({ ...prev, diplomes: updated }))
  }

  // Toggle pour les disponibilités
  const toggleDispo = (jourIndex: number, moment: 'matin' | 'apresMidi' | 'soir' | 'nuit') => {
    const current = tempData.disponibilites || profil.disponibilites || []
    const updated = current.map((dispo, index) =>
      index === jourIndex
        ? { ...dispo, [moment]: !dispo[moment] }
        : dispo
    )
    setTempData(prev => ({ ...prev, disponibilites: updated }))
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header avec photo */}
      <div className="bg-gradient-to-br from-teal-500 to-teal-600 text-white">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <Link to="/dashboard" className="text-white/80 hover:text-white">
              ← Retour
            </Link>
            <h1 className="text-lg font-semibold">Mon profil</h1>
            <div className="w-16" />
          </div>

          <div className="flex items-center gap-4">
            {/* Photo */}
            <div className="relative">
              {profil.photo ? (
                <img
                  src={profil.photo}
                  alt="Ma photo"
                  className="w-20 h-20 rounded-full object-cover border-4 border-white/30"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center text-3xl border-4 border-white/30">
                  {profil.prenom ? profil.prenom[0].toUpperCase() : '👤'}
                </div>
              )}
            </div>

            {/* Nom */}
            <div>
              <h2 className="text-2xl font-bold">
                Bonjour, {profil.prenom || 'toi'} !
              </h2>
              <p className="text-white/80 text-sm">
                Ton profil est complet à {calculateCompletion()}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">

        {/* Section : Informations générales */}
        <Section
          title="Informations générales"
          icon="👤"
          onEdit={() => openEdit('infos')}
          isEditing={editSection === 'infos'}
          onSave={saveEdit}
          onCancel={cancelEdit}
        >
          {editSection === 'infos' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Prénom"
                  value={tempData.prenom || ''}
                  onChange={(v) => setTempData(prev => ({ ...prev, prenom: v }))}
                />
                <InputField
                  label="Nom"
                  value={tempData.nom || ''}
                  onChange={(v) => setTempData(prev => ({ ...prev, nom: v }))}
                />
              </div>
              <InputField
                label="Date de naissance"
                type="date"
                value={tempData.dateNaissance || ''}
                onChange={(v) => setTempData(prev => ({ ...prev, dateNaissance: v }))}
              />
              <InputField
                label="N° Sécurité sociale"
                value={tempData.numeroSecu || ''}
                onChange={(v) => setTempData(prev => ({ ...prev, numeroSecu: v }))}
              />
              <InputField
                label="N° CESU"
                value={tempData.numeroCesu || ''}
                onChange={(v) => setTempData(prev => ({ ...prev, numeroCesu: v }))}
                placeholder="Optionnel"
              />
              <div>
                <label className="block text-sm text-gray-500 mb-1">Expérience</label>
                <select
                  value={tempData.experience || ''}
                  onChange={(e) => setTempData(prev => ({ ...prev, experience: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-teal-500 focus:outline-none bg-white"
                >
                  <option value="">Non renseigné</option>
                  <option value="debutant">Débutant(e)</option>
                  <option value="1-2ans">1 à 2 ans</option>
                  <option value="3-5ans">3 à 5 ans</option>
                  <option value="5ans+">Plus de 5 ans</option>
                </select>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-y-3 text-sm">
              <InfoItem label="Prénom" value={profil.prenom} />
              <InfoItem label="Nom" value={profil.nom} />
              <InfoItem label="Date de naissance" value={profil.dateNaissance ? new Date(profil.dateNaissance).toLocaleDateString('fr-FR') : null} />
              <InfoItem label="Expérience" value={EXPERIENCE_LABELS[profil.experience]} />
              <InfoItem label="N° Sécu" value={profil.numeroSecu ? '••••' + profil.numeroSecu.slice(-4) : null} />
              <InfoItem label="N° CESU" value={profil.numeroCesu} />
            </div>
          )}
        </Section>

        {/* Section : Coordonnées */}
        <Section
          title="Coordonnées"
          icon="📱"
          onEdit={() => openEdit('coordonnees')}
          isEditing={editSection === 'coordonnees'}
          onSave={saveEdit}
          onCancel={cancelEdit}
        >
          {editSection === 'coordonnees' ? (
            <div className="space-y-4">
              <InputField
                label="Téléphone"
                type="tel"
                value={tempData.telephone || ''}
                onChange={(v) => setTempData(prev => ({ ...prev, telephone: v }))}
              />
              <InputField
                label="Email"
                type="email"
                value={tempData.email || ''}
                onChange={(v) => setTempData(prev => ({ ...prev, email: v }))}
              />
              <InputField
                label="Adresse"
                value={tempData.adresse || ''}
                onChange={(v) => setTempData(prev => ({ ...prev, adresse: v }))}
              />
              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="Ville"
                  value={tempData.ville || ''}
                  onChange={(v) => setTempData(prev => ({ ...prev, ville: v }))}
                />
                <InputField
                  label="Code postal"
                  value={tempData.codePostal || ''}
                  onChange={(v) => setTempData(prev => ({ ...prev, codePostal: v }))}
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-y-3 text-sm">
              <InfoItem label="Téléphone" value={profil.telephone} />
              <InfoItem label="Email" value={profil.email} />
              <InfoItem label="Adresse" value={profil.adresse} className="col-span-2" />
              <InfoItem label="Ville" value={profil.ville} />
              <InfoItem label="Code postal" value={profil.codePostal} />
            </div>
          )}
        </Section>

        {/* Section : Objectifs d'activités */}
        <Section
          title="Objectifs d'activités"
          icon="💼"
          onEdit={() => openEdit('activites')}
          isEditing={editSection === 'activites'}
          onSave={saveEdit}
          onCancel={cancelEdit}
        >
          {editSection === 'activites' ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm text-gray-500">Types de missions</label>
                {TYPES_ACTIVITE.map(type => (
                  <button
                    key={type.id}
                    onClick={() => toggleActivite(type.id)}
                    className={`w-full p-3 rounded-lg border text-left transition text-sm ${
                      (tempData.typeActivite || []).includes(type.id)
                        ? 'border-teal-500 bg-teal-50'
                        : 'border-gray-200'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Salaire minimum souhaité</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={10}
                    max={25}
                    value={tempData.salaireMinimum || 12}
                    onChange={(e) => setTempData(prev => ({ ...prev, salaireMinimum: Number(e.target.value) }))}
                    className="flex-1 accent-teal-500"
                  />
                  <span className="font-bold text-teal-600 w-16 text-right">
                    {tempData.salaireMinimum || 12}€/h
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500 mb-2">Types de missions :</p>
                {profil.typeActivite && profil.typeActivite.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profil.typeActivite.map(id => (
                      <span key={id} className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm">
                        {TYPES_ACTIVITE_LABELS[id] || id}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-sm">Non renseigné</p>
                )}
              </div>
              <div>
                <p className="text-sm text-gray-500">Salaire minimum :</p>
                <p className="font-semibold text-teal-600">{profil.salaireMinimum || 12}€/h net</p>
              </div>
            </div>
          )}
        </Section>

        {/* Section : Diplômes */}
        <Section
          title="Diplômes & formations"
          icon="🎓"
          onEdit={() => openEdit('diplomes')}
          isEditing={editSection === 'diplomes'}
          onSave={saveEdit}
          onCancel={cancelEdit}
        >
          {editSection === 'diplomes' ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                {DIPLOMES.map(diplome => (
                  <button
                    key={diplome.id}
                    onClick={() => toggleDiplome(diplome.id)}
                    className={`p-2 rounded-lg border text-left transition text-sm ${
                      (tempData.diplomes || []).includes(diplome.id)
                        ? 'border-teal-500 bg-teal-50'
                        : 'border-gray-200'
                    }`}
                  >
                    {(tempData.diplomes || []).includes(diplome.id) ? '✓ ' : ''}{diplome.label}
                  </button>
                ))}
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Autres formations</label>
                <textarea
                  value={tempData.autresDiplomes || ''}
                  onChange={(e) => setTempData(prev => ({ ...prev, autresDiplomes: e.target.value }))}
                  placeholder="Formation Alzheimer, Permis B..."
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-teal-500 focus:outline-none resize-none text-sm"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {profil.diplomes && profil.diplomes.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profil.diplomes.map(id => (
                    <span key={id} className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm">
                      {DIPLOMES_LABELS[id] || id}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">Aucun diplôme renseigné</p>
              )}
              {profil.autresDiplomes && (
                <p className="text-sm text-gray-600">Autres : {profil.autresDiplomes}</p>
              )}
            </div>
          )}
        </Section>

        {/* Section : Disponibilités */}
        <Section
          title="Disponibilités"
          icon="📅"
          onEdit={() => openEdit('disponibilites')}
          isEditing={editSection === 'disponibilites'}
          onSave={saveEdit}
          onCancel={cancelEdit}
        >
          {editSection === 'disponibilites' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="p-1"></th>
                    <th className="p-1 text-center text-xs text-gray-500">Matin</th>
                    <th className="p-1 text-center text-xs text-gray-500">Après-midi</th>
                    <th className="p-1 text-center text-xs text-gray-500">Soir</th>
                    <th className="p-1 text-center text-xs text-gray-500">Nuit</th>
                  </tr>
                </thead>
                <tbody>
                  {(tempData.disponibilites || profil.disponibilites || []).map((dispo, index) => (
                    <tr key={dispo.jour}>
                      <td className="p-1 font-medium text-gray-700 text-xs">{dispo.jour.slice(0, 3)}</td>
                      {(['matin', 'apresMidi', 'soir', 'nuit'] as const).map(moment => (
                        <td key={moment} className="p-1 text-center">
                          <button
                            onClick={() => toggleDispo(index, moment)}
                            className={`w-8 h-8 rounded transition text-xs ${
                              dispo[moment]
                                ? 'bg-teal-500 text-white'
                                : 'bg-gray-100'
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
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr>
                    <th className="p-1"></th>
                    <th className="p-1 text-center">🌅</th>
                    <th className="p-1 text-center">☀️</th>
                    <th className="p-1 text-center">🌆</th>
                    <th className="p-1 text-center">🌙</th>
                  </tr>
                </thead>
                <tbody>
                  {(profil.disponibilites || []).map((dispo) => (
                    <tr key={dispo.jour}>
                      <td className="p-1 font-medium text-gray-500">{dispo.jour.slice(0, 3)}</td>
                      {(['matin', 'apresMidi', 'soir', 'nuit'] as const).map(moment => (
                        <td key={moment} className="p-1 text-center">
                          <span className={`inline-block w-6 h-6 rounded ${
                            dispo[moment] ? 'bg-teal-500' : 'bg-gray-200'
                          }`} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Section>

      </div>
    </div>
  )

  // Calculer le pourcentage de complétion du profil
  function calculateCompletion(): number {
    let filled = 0
    let total = 10

    if (profil.prenom) filled++
    if (profil.nom) filled++
    if (profil.telephone) filled++
    if (profil.email) filled++
    if (profil.adresse) filled++
    if (profil.numeroSecu) filled++
    if (profil.experience) filled++
    if (profil.typeActivite && profil.typeActivite.length > 0) filled++
    if (profil.diplomes && profil.diplomes.length > 0) filled++
    if (profil.disponibilites && profil.disponibilites.some(d => d.matin || d.apresMidi || d.soir || d.nuit)) filled++

    return Math.round((filled / total) * 100)
  }
}

// Composant Section
function Section({
  title,
  icon,
  children,
  onEdit,
  isEditing,
  onSave,
  onCancel,
}: {
  title: string
  icon: string
  children: React.ReactNode
  onEdit: () => void
  isEditing: boolean
  onSave: () => void
  onCancel: () => void
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <span>{icon}</span>
          {title}
        </h3>
        {isEditing ? (
          <div className="flex gap-2">
            <button
              onClick={onCancel}
              className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700"
            >
              Annuler
            </button>
            <button
              onClick={onSave}
              className="px-3 py-1 text-sm bg-teal-600 text-white rounded-lg hover:bg-teal-700"
            >
              Enregistrer
            </button>
          </div>
        ) : (
          <button
            onClick={onEdit}
            className="px-3 py-1 text-sm text-teal-600 border border-teal-600 rounded-lg hover:bg-teal-50"
          >
            Modifier
          </button>
        )}
      </div>
      <div className="px-4 py-4">
        {children}
      </div>
    </div>
  )
}

// Composant InfoItem (affichage lecture)
function InfoItem({
  label,
  value,
  className = '',
}: {
  label: string
  value: string | null | undefined
  className?: string
}) {
  return (
    <div className={className}>
      <p className="text-gray-500">{label}</p>
      <p className="font-medium text-gray-900">{value || <span className="text-gray-400">Non renseigné</span>}</p>
    </div>
  )
}

// Composant InputField (édition)
function InputField({
  label,
  value,
  onChange,
  type = 'text',
  placeholder = '',
}: {
  label: string
  value: string
  onChange: (value: string) => void
  type?: string
  placeholder?: string
}) {
  return (
    <div>
      <label className="block text-sm text-gray-500 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-teal-500 focus:outline-none text-sm"
      />
    </div>
  )
}