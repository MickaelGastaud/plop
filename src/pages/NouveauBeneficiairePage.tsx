import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useBeneficiaires, createEmptyBeneficiaire, JOURS } from '../store/useBeneficiaires'
import type { Beneficiaire, CreneauHabituel } from '../store/useBeneficiaires'

const LIENS_CONTACT = ['Fils', 'Fille', 'Époux/se', 'Frère', 'Sœur', 'Neveu/Nièce', 'Voisin(e)', 'Ami(e)', 'Autre']
const NIVEAUX_GIR = ['', 'GIR 1', 'GIR 2', 'GIR 3', 'GIR 4', 'GIR 5', 'GIR 6']

type NouveauBeneficiaire = Omit<Beneficiaire, 'id' | 'createdAt' | 'updatedAt'>

export default function NouveauBeneficiairePage() {
  const navigate = useNavigate()
  const { ajouter } = useBeneficiaires()
  const [etape, setEtape] = useState(1)
  const totalEtapes = 5

  const [form, setForm] = useState<NouveauBeneficiaire>(createEmptyBeneficiaire())

  const updateForm = (field: string, value: unknown) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const updateContactUrgence = (field: string, value: string) => {
    setForm(prev => ({
      ...prev,
      contactUrgence: { ...prev.contactUrgence, [field]: value }
    }))
  }

  // Gestion des créneaux habituels
  const ajouterCreneau = (jour: string) => {
    setForm(prev => ({
      ...prev,
      creneauxHabituels: [
        ...prev.creneauxHabituels,
        { id: Date.now(), jour, heureDebut: '09:00', heureFin: '12:00' }
      ]
    }))
  }

  const supprimerCreneau = (id: number) => {
    setForm(prev => ({
      ...prev,
      creneauxHabituels: prev.creneauxHabituels.filter(c => c.id !== id)
    }))
  }

  const updateCreneau = (id: number, field: keyof CreneauHabituel, value: string) => {
    setForm(prev => ({
      ...prev,
      creneauxHabituels: prev.creneauxHabituels.map(c =>
        c.id === id ? { ...c, [field]: value } : c
      )
    }))
  }

  const nextEtape = () => setEtape(e => Math.min(e + 1, totalEtapes))
  const prevEtape = () => setEtape(e => Math.max(e - 1, 1))

  const handleSubmit = () => {
    ajouter(form)
    navigate('/beneficiaires')
  }

  // Calcul heures hebdo habituelles
  const heuresHebdo = form.creneauxHabituels.reduce((acc, c) => {
    const [hDebut, mDebut] = c.heureDebut.split(':').map(Number)
    const [hFin, mFin] = c.heureFin.split(':').map(Number)
    const duree = (hFin * 60 + mFin - hDebut * 60 - mDebut) / 60
    return acc + duree
  }, 0)

  // Nombre de jours travaillés
  const joursUniques = Array.from(new Set(form.creneauxHabituels.map(c => c.jour))).length

  const revenuHebdoEstime = heuresHebdo * form.tauxHoraireNet
  const revenuMensuelEstime = revenuHebdoEstime * 4

  const etapesTitres = [
    { icon: '👤', label: 'Identité' },
    { icon: '📍', label: 'Adresse' },
    { icon: '💰', label: 'Contrat' },
    { icon: '🏥', label: 'Santé' },
    { icon: '📅', label: 'Horaires' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-teal-500 to-teal-600 text-white">
        <div className="max-w-lg mx-auto px-4 pt-4 pb-8">
          <div className="flex items-center justify-between mb-4">
            <Link to="/beneficiaires" className="text-white/80 hover:text-white font-medium">
              ← Retour
            </Link>
          </div>
          <h1 className="text-2xl font-bold">➕ Nouveau bénéficiaire</h1>
          <p className="text-teal-100 mt-1">Ajoutez les informations du contrat</p>
        </div>
      </div>

      <main className="max-w-lg mx-auto px-4 -mt-4 pb-32">
        {/* Barre de progression */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
          <div className="flex justify-between mb-2">
            {etapesTitres.map((titre, index) => (
              <button
                key={index}
                onClick={() => setEtape(index + 1)}
                className="flex flex-col items-center"
              >
                <div
                  className={`w-10 h-10 rounded-full font-bold flex items-center justify-center transition ${
                    index + 1 === etape
                      ? 'bg-teal-600 text-white shadow-lg scale-110'
                      : index + 1 < etape
                      ? 'bg-teal-200 text-teal-700'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {index + 1 < etape ? '✓' : titre.icon}
                </div>
                <span className={`text-xs mt-1 ${index + 1 === etape ? 'text-teal-700 font-medium' : 'text-gray-400'}`}>
                  {titre.label}
                </span>
              </button>
            ))}
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-teal-500 to-teal-600 rounded-full transition-all duration-300"
              style={{ width: `${((etape - 1) / (totalEtapes - 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* ÉTAPE 1 : Identité */}
        {etape === 1 && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="text-lg font-bold text-teal-700 mb-4">👤 Identité du bénéficiaire</h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                  <input
                    type="text"
                    value={form.nom}
                    onChange={(e) => updateForm('nom', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none"
                    placeholder="DUPONT"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
                  <input
                    type="text"
                    value={form.prenom}
                    onChange={(e) => updateForm('prenom', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none"
                    placeholder="Marie"
                  />
                </div>
              </div>

              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance</label>
                <input
                  type="date"
                  value={form.dateNaissance}
                  onChange={(e) => updateForm('dateNaissance', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 mt-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
                  <input
                    type="tel"
                    value={form.telephone}
                    onChange={(e) => updateForm('telephone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none"
                    placeholder="06 12 34 56 78"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => updateForm('email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none"
                    placeholder="optionnel"
                  />
                </div>
              </div>
            </div>

            {/* Contact urgence */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="text-lg font-bold text-teal-700 mb-4">🆘 Contact en cas d'urgence</h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <input
                    type="text"
                    value={form.contactUrgence.nom}
                    onChange={(e) => updateContactUrgence('nom', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none"
                    placeholder="Pierre Dupont"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Lien</label>
                  <select
                    value={form.contactUrgence.lien}
                    onChange={(e) => updateContactUrgence('lien', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none bg-white"
                  >
                    <option value="">Choisir...</option>
                    {LIENS_CONTACT.map(lien => (
                      <option key={lien} value={lien}>{lien}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <input
                  type="tel"
                  value={form.contactUrgence.telephone}
                  onChange={(e) => updateContactUrgence('telephone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none"
                  placeholder="06 11 22 33 44"
                />
              </div>
            </div>
          </div>
        )}

        {/* ÉTAPE 2 : Adresse */}
        {etape === 2 && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="text-lg font-bold text-teal-700 mb-4">📍 Adresse d'intervention</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Adresse *</label>
                <input
                  type="text"
                  value={form.adresse}
                  onChange={(e) => updateForm('adresse', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none"
                  placeholder="12 rue des Lilas"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 mt-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Code postal *</label>
                  <input
                    type="text"
                    value={form.codePostal}
                    onChange={(e) => updateForm('codePostal', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none"
                    placeholder="75012"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ville *</label>
                  <input
                    type="text"
                    value={form.ville}
                    onChange={(e) => updateForm('ville', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none"
                    placeholder="Paris"
                  />
                </div>
              </div>

              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Étage / Porte</label>
                <input
                  type="text"
                  value={form.etage}
                  onChange={(e) => updateForm('etage', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none"
                  placeholder="3ème étage droite"
                />
              </div>
            </div>

            {/* Accès */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="text-lg font-bold text-teal-700 mb-4">🔑 Accès au domicile</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Code d'accès</label>
                <input
                  type="text"
                  value={form.codeAcces}
                  onChange={(e) => updateForm('codeAcces', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none"
                  placeholder="Digicode, interphone..."
                />
              </div>

              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes d'accès</label>
                <textarea
                  value={form.notesAcces}
                  onChange={(e) => updateForm('notesAcces', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none resize-none"
                  rows={3}
                  placeholder="Boîte à clef sous le pot de fleurs, parking visiteur place 12..."
                />
              </div>
            </div>
          </div>
        )}

        {/* ÉTAPE 3 : Contrat & Tarification */}
        {etape === 3 && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="text-lg font-bold text-teal-700 mb-4">📋 Informations contrat</h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">N° CESU employeur</label>
                  <input
                    type="text"
                    value={form.numeroCesu}
                    onChange={(e) => updateForm('numeroCesu', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none"
                    placeholder="CESU123456"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date début contrat</label>
                  <input
                    type="date"
                    value={form.dateDebutContrat}
                    onChange={(e) => updateForm('dateDebutContrat', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="text-lg font-bold text-teal-700 mb-4">💰 Tarification</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Votre taux horaire NET (€/h) *
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.10"
                    value={form.tauxHoraireNet}
                    onChange={(e) => updateForm('tauxHoraireNet', Number(e.target.value))}
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none text-xl font-bold text-center"
                  />
                  <span className="text-gray-500 font-medium">€/h net</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Ce que vous touchez vraiment (10% CP inclus)</p>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">🚗 Frais kilométriques</label>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Indemnité/km</label>
                    <input
                      type="number"
                      step="0.01"
                      value={form.fraisKm}
                      onChange={(e) => updateForm('fraisKm', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Km aller-retour</label>
                    <input
                      type="number"
                      value={form.kmAllerRetour}
                      onChange={(e) => updateForm('kmAllerRetour', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-teal-500 focus:outline-none"
                      placeholder="0"
                    />
                  </div>
                </div>
                
                {form.kmAllerRetour > 0 && (
                  <p className="text-sm text-teal-600 mt-2">
                    💡 {(form.kmAllerRetour * form.fraisKm).toFixed(2)}€ / intervention
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ÉTAPE 4 : Santé */}
        {etape === 4 && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="text-lg font-bold text-teal-700 mb-4">🏥 Informations santé</h3>
              <p className="text-sm text-gray-500 mb-4">Ces informations sont optionnelles mais importantes pour la qualité de l'accompagnement.</p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Niveau GIR</label>
                <select
                  value={form.niveauGir}
                  onChange={(e) => updateForm('niveauGir', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none bg-white"
                >
                  {NIVEAUX_GIR.map(gir => (
                    <option key={gir} value={gir}>{gir || 'Non renseigné'}</option>
                  ))}
                </select>
              </div>

              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Pathologies connues</label>
                <textarea
                  value={form.pathologies}
                  onChange={(e) => updateForm('pathologies', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none resize-none"
                  rows={2}
                  placeholder="Alzheimer, diabète, problèmes cardiaques..."
                />
              </div>

              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
                <input
                  type="text"
                  value={form.allergies}
                  onChange={(e) => updateForm('allergies', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none"
                  placeholder="Pénicilline, arachides..."
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="text-lg font-bold text-teal-700 mb-4">📝 Notes importantes</h3>
              
              <textarea
                value={form.notesImportantes}
                onChange={(e) => updateForm('notesImportantes', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none resize-none"
                rows={4}
                placeholder="Habitudes, préférences, choses à éviter, points d'attention..."
              />
            </div>
          </div>
        )}

        {/* ÉTAPE 5 : Horaires habituels */}
        {etape === 5 && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="text-lg font-bold text-teal-700 mb-2">📅 Horaires habituels</h3>
              <p className="text-sm text-gray-500 mb-4">
                Ajoutez les créneaux récurrents pour chaque jour travaillé.
              </p>

              <div className="space-y-4">
                {JOURS.map((jour) => {
                  const creneauxDuJour = form.creneauxHabituels.filter(c => c.jour === jour)
                  
                  return (
                    <div key={jour} className="border border-gray-200 rounded-xl overflow-hidden">
                      {/* Header du jour */}
                      <div className="flex items-center justify-between p-3 bg-gray-50">
                        <span className="font-medium text-gray-700">{jour}</span>
                        <button
                          type="button"
                          onClick={() => ajouterCreneau(jour)}
                          className="text-teal-600 text-sm font-medium hover:text-teal-700 flex items-center gap-1"
                        >
                          + Ajouter créneau
                        </button>
                      </div>
                      
                      {/* Créneaux du jour */}
                      {creneauxDuJour.length === 0 ? (
                        <div className="p-3 text-center text-gray-400 text-sm">
                          Aucun créneau
                        </div>
                      ) : (
                        <div className="divide-y divide-gray-100">
                          {creneauxDuJour.map((creneau) => (
                            <div key={creneau.id} className="p-3 flex items-center gap-3 bg-teal-50">
                              <input
                                type="time"
                                value={creneau.heureDebut}
                                onChange={(e) => updateCreneau(creneau.id, 'heureDebut', e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                              />
                              <span className="text-gray-400">→</span>
                              <input
                                type="time"
                                value={creneau.heureFin}
                                onChange={(e) => updateCreneau(creneau.id, 'heureFin', e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
                              />
                              <button
                                type="button"
                                onClick={() => supprimerCreneau(creneau.id)}
                                className="ml-auto text-red-500 hover:text-red-700 p-1"
                              >
                                🗑️
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Résumé revenus */}
            {heuresHebdo > 0 && (
              <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl p-5 text-white">
                <h3 className="font-bold mb-3">💰 Estimation des revenus</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-green-100">Jours travaillés</span>
                    <span className="font-bold">{joursUniques} jour{joursUniques > 1 ? 's' : ''}/sem</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-100">Heures / semaine</span>
                    <span className="font-bold">{heuresHebdo.toFixed(1)}h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-100">Taux horaire</span>
                    <span className="font-bold">{form.tauxHoraireNet.toFixed(2)}€ net</span>
                  </div>
                  <div className="border-t border-white/30 my-2" />
                  <div className="flex justify-between">
                    <span className="text-green-100">Revenu / semaine</span>
                    <span className="font-bold">{revenuHebdoEstime.toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span>Revenu / mois (estimé)</span>
                    <span className="font-bold">{revenuMensuelEstime.toFixed(2)}€</span>
                  </div>
                </div>
                
                {form.kmAllerRetour > 0 && (
                  <p className="text-xs text-green-100 mt-3">
                    + frais km : ~{(form.kmAllerRetour * form.fraisKm * joursUniques * 4).toFixed(2)}€/mois
                  </p>
                )}
              </div>
            )}

            {/* Statut */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="text-lg font-bold text-teal-700 mb-4">📊 Statut du contrat</h3>
              
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'actif', label: '✅ Actif', color: 'green' },
                  { value: 'pause', label: '⏸️ En pause', color: 'amber' },
                  { value: 'termine', label: '🏁 Terminé', color: 'gray' },
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => updateForm('statut', option.value)}
                    className={`py-3 px-2 rounded-xl text-sm font-medium transition ${
                      form.statut === option.value
                        ? option.color === 'green'
                          ? 'bg-green-500 text-white'
                          : option.color === 'amber'
                          ? 'bg-amber-500 text-white'
                          : 'bg-gray-500 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40">
        <div className="max-w-lg mx-auto flex gap-3">
          <button
            onClick={prevEtape}
            disabled={etape === 1}
            className={`py-3 px-4 rounded-xl font-medium transition ${
              etape === 1 ? 'bg-gray-100 text-gray-400' : 'border-2 border-teal-600 text-teal-600'
            }`}
          >
            ←
          </button>

          {etape < totalEtapes ? (
            <button
              onClick={nextEtape}
              className="flex-1 py-3 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 transition"
            >
              Suivant →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!form.nom || !form.prenom || !form.telephone}
              className="flex-1 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold hover:from-green-600 hover:to-green-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ✅ Enregistrer le bénéficiaire
            </button>
          )}
        </div>
      </div>
    </div>
  )
}