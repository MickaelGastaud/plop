import { useState, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useBeneficiaires } from '../store/useBeneficiaires'
import { useInterventions } from '../store/useInterventions'
import BottomNav from '../components/BottomNav'

export default function BeneficiaireDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getById, modifier, supprimer } = useBeneficiaires()
  const { interventions } = useInterventions()
  
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [onglet, setOnglet] = useState<'infos' | 'planning' | 'revenus'>('infos')

  const beneficiaire = getById(Number(id))

  // Stats du bénéficiaire
  const stats = useMemo(() => {
    if (!beneficiaire) return null

    const now = new Date()
    const debutMois = new Date(now.getFullYear(), now.getMonth(), 1)
    const finMois = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    const interventionsBenef = interventions.filter(i => i.beneficiaireId === beneficiaire.id)
    const interventionsMois = interventionsBenef.filter(i => {
      const date = new Date(i.date)
      return date >= debutMois && date <= finMois
    })

    let heuresMois = 0
    interventionsMois.forEach(i => {
      const [hDebut, mDebut] = i.heureDebut.split(':').map(Number)
      const [hFin, mFin] = i.heureFin.split(':').map(Number)
      heuresMois += (hFin * 60 + mFin - hDebut * 60 - mDebut) / 60
    })

    const revenuMois = heuresMois * beneficiaire.tauxHoraireNet
    const fraisKmMois = interventionsMois.length * beneficiaire.kmAllerRetour * beneficiaire.fraisKm

    // Heures hebdo habituelles
    let heuresHebdo = 0
    beneficiaire.creneauxHabituels.forEach(c => {
      const [hDebut, mDebut] = c.heureDebut.split(':').map(Number)
      const [hFin, mFin] = c.heureFin.split(':').map(Number)
      heuresHebdo += (hFin * 60 + mFin - hDebut * 60 - mDebut) / 60
    })

    // Nombre de jours travaillés
    const joursUniques = Array.from(new Set(beneficiaire.creneauxHabituels.map(c => c.jour))).length

    // Ancienneté
    const debut = new Date(beneficiaire.dateDebutContrat)
    const diffMs = now.getTime() - debut.getTime()
    const moisAnciennete = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30))

    return {
      heuresMois,
      revenuMois,
      fraisKmMois,
      heuresHebdo,
      joursUniques,
      revenuHebdo: heuresHebdo * beneficiaire.tauxHoraireNet,
      nbInterventionsMois: interventionsMois.length,
      moisAnciennete,
      prochainCreneau: interventionsBenef
        .filter(i => new Date(i.date) >= now)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0],
    }
  }, [beneficiaire, interventions])

  if (!beneficiaire) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Bénéficiaire non trouvé</p>
          <Link to="/beneficiaires" className="text-teal-600 hover:underline">
            ← Retour à la liste
          </Link>
        </div>
      </div>
    )
  }

  const handleDelete = () => {
    supprimer(beneficiaire.id)
    navigate('/beneficiaires')
  }

  const toggleStatut = () => {
    const nouveauStatut = beneficiaire.statut === 'actif' ? 'pause' : 'actif'
    modifier(beneficiaire.id, { statut: nouveauStatut })
  }

  const getAge = () => {
    if (!beneficiaire.dateNaissance) return null
    const naissance = new Date(beneficiaire.dateNaissance)
    const age = Math.floor((Date.now() - naissance.getTime()) / (1000 * 60 * 60 * 24 * 365))
    return age
  }

  const statutColors = {
    actif: 'bg-green-100 text-green-700',
    pause: 'bg-amber-100 text-amber-700',
    termine: 'bg-gray-100 text-gray-600',
  }

  const statutLabels = {
    actif: '✅ Actif',
    pause: '⏸️ En pause',
    termine: '🏁 Terminé',
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header avec gradient */}
      <div className="bg-gradient-to-br from-teal-500 to-teal-600 text-white">
        <div className="max-w-lg mx-auto px-4 pt-4 pb-20">
          <div className="flex items-center justify-between mb-4">
            <Link to="/beneficiaires" className="text-white/80 hover:text-white">
              ← Retour
            </Link>
            <div className="flex gap-2">
              <Link
                to={`/beneficiaires/${beneficiaire.id}/modifier`}
                className="px-3 py-1.5 bg-white/20 rounded-lg text-sm hover:bg-white/30"
              >
                ✏️ Modifier
              </Link>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-lg mx-auto px-4 -mt-16">
        {/* Carte profil */}
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-2xl font-bold">
              {beneficiaire.prenom[0]}{beneficiaire.nom[0]}
            </div>
            
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">
                {beneficiaire.prenom} {beneficiaire.nom}
              </h1>
              {getAge() && (
                <p className="text-gray-500 text-sm">{getAge()} ans</p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statutColors[beneficiaire.statut]}`}>
                  {statutLabels[beneficiaire.statut]}
                </span>
                {beneficiaire.niveauGir && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    {beneficiaire.niveauGir}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
            <a
              href={`tel:${beneficiaire.telephone}`}
              className="flex-1 py-2 bg-teal-50 text-teal-700 rounded-xl text-center font-medium text-sm"
            >
              📞 Appeler
            </a>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(`${beneficiaire.adresse}, ${beneficiaire.codePostal} ${beneficiaire.ville}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2 bg-blue-50 text-blue-700 rounded-xl text-center font-medium text-sm"
            >
              📍 Itinéraire
            </a>
            <button
              onClick={toggleStatut}
              className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-xl text-center font-medium text-sm"
            >
              {beneficiaire.statut === 'actif' ? '⏸️ Pause' : '▶️ Activer'}
            </button>
          </div>
        </div>

        {/* Onglets */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-4">
          {[
            { key: 'infos', label: '📋 Infos' },
            { key: 'planning', label: '📅 Planning' },
            { key: 'revenus', label: '💰 Revenus' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setOnglet(tab.key as typeof onglet)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                onglet === tab.key
                  ? 'bg-white text-teal-700 shadow-sm'
                  : 'text-gray-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Contenu onglet INFOS */}
        {onglet === 'infos' && (
          <div className="space-y-4">
            {/* Adresse & Accès */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="font-bold text-gray-700 mb-3">📍 Adresse & Accès</h3>
              
              <p className="text-gray-800">{beneficiaire.adresse}</p>
              {beneficiaire.etage && (
                <p className="text-gray-600 text-sm">{beneficiaire.etage}</p>
              )}
              <p className="text-gray-600">{beneficiaire.codePostal} {beneficiaire.ville}</p>
              
              {(beneficiaire.codeAcces || beneficiaire.notesAcces) && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  {beneficiaire.codeAcces && (
                    <p className="text-sm">
                      <span className="text-gray-500">Code :</span>{' '}
                      <span className="font-mono bg-gray-100 px-2 py-0.5 rounded">{beneficiaire.codeAcces}</span>
                    </p>
                  )}
                  {beneficiaire.notesAcces && (
                    <p className="text-sm text-gray-600 mt-1">💡 {beneficiaire.notesAcces}</p>
                  )}
                </div>
              )}
            </div>

            {/* Contact urgence */}
            {beneficiaire.contactUrgence.nom && (
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <h3 className="font-bold text-gray-700 mb-3">🆘 Contact urgence</h3>
                <p className="text-gray-800">{beneficiaire.contactUrgence.nom}</p>
                <p className="text-gray-500 text-sm">{beneficiaire.contactUrgence.lien}</p>
                <a 
                  href={`tel:${beneficiaire.contactUrgence.telephone}`}
                  className="text-teal-600 font-medium"
                >
                  {beneficiaire.contactUrgence.telephone}
                </a>
              </div>
            )}

            {/* Santé */}
            {(beneficiaire.pathologies || beneficiaire.allergies || beneficiaire.notesImportantes) && (
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <h3 className="font-bold text-gray-700 mb-3">🏥 Santé & Notes</h3>
                
                {beneficiaire.pathologies && (
                  <div className="mb-2">
                    <p className="text-xs text-gray-500">Pathologies</p>
                    <p className="text-gray-800">{beneficiaire.pathologies}</p>
                  </div>
                )}
                
                {beneficiaire.allergies && (
                  <div className="mb-2 p-2 bg-red-50 rounded-lg">
                    <p className="text-xs text-red-600">⚠️ Allergies</p>
                    <p className="text-red-700 font-medium">{beneficiaire.allergies}</p>
                  </div>
                )}
                
                {beneficiaire.notesImportantes && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">Notes importantes</p>
                    <p className="text-gray-700 text-sm">{beneficiaire.notesImportantes}</p>
                  </div>
                )}
              </div>
            )}

            {/* Contrat */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="font-bold text-gray-700 mb-3">📋 Contrat</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">N° CESU</p>
                  <p className="font-mono text-gray-800">{beneficiaire.numeroCesu || '-'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Depuis</p>
                  <p className="text-gray-800">
                    {beneficiaire.dateDebutContrat 
                      ? new Date(beneficiaire.dateDebutContrat).toLocaleDateString('fr-FR')
                      : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Taux horaire net</p>
                  <p className="text-gray-800 font-bold text-lg text-green-600">
                    {beneficiaire.tauxHoraireNet.toFixed(2)}€/h
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Ancienneté</p>
                  <p className="text-gray-800">{stats?.moisAnciennete || 0} mois</p>
                </div>
              </div>
            </div>

            {/* Zone danger */}
            <div className="bg-red-50 rounded-2xl p-4">
              <button
                onClick={() => setShowConfirmDelete(true)}
                className="w-full py-2 text-red-600 font-medium"
              >
                🗑️ Supprimer ce bénéficiaire
              </button>
            </div>
          </div>
        )}

        {/* Contenu onglet PLANNING */}
        {onglet === 'planning' && (
          <div className="space-y-4">
            {/* Horaires habituels */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="font-bold text-gray-700 mb-3">📅 Horaires habituels</h3>
              
              <div className="space-y-2">
                {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].map(jour => {
                  const creneauxDuJour = beneficiaire.creneauxHabituels.filter(c => c.jour === jour)
                  
                  return (
                    <div 
                      key={jour}
                      className={`p-2 rounded-lg ${
                        creneauxDuJour.length > 0 ? 'bg-teal-50' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`font-medium ${creneauxDuJour.length > 0 ? 'text-teal-700' : 'text-gray-400'}`}>
                          {jour}
                        </span>
                        {creneauxDuJour.length > 0 ? (
                          <div className="flex flex-col items-end gap-1">
                            {creneauxDuJour.map((c, i) => (
                              <span key={i} className="text-teal-600 font-mono text-sm">
                                {c.heureDebut} → {c.heureFin}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              {stats && stats.heuresHebdo > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                  <p className="text-2xl font-bold text-teal-600">
                    {stats.heuresHebdo.toFixed(1)}h / semaine
                  </p>
                  <p className="text-sm text-gray-500">{stats.joursUniques} jour{stats.joursUniques > 1 ? 's' : ''} travaillé{stats.joursUniques > 1 ? 's' : ''}</p>
                </div>
              )}
            </div>

            {/* Prochain créneau */}
            {stats?.prochainCreneau && (
              <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl p-4 text-white">
                <p className="text-teal-100 text-sm mb-1">Prochain créneau</p>
                <p className="text-xl font-bold">
                  {new Date(stats.prochainCreneau.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
                <p className="text-teal-100">
                  {stats.prochainCreneau.heureDebut} → {stats.prochainCreneau.heureFin}
                </p>
              </div>
            )}

            <Link
              to={`/planning?beneficiaire=${beneficiaire.id}`}
              className="block w-full py-3 bg-teal-600 text-white rounded-xl text-center font-medium"
            >
              📅 Voir le planning complet
            </Link>
          </div>
        )}

        {/* Contenu onglet REVENUS */}
        {onglet === 'revenus' && stats && (
          <div className="space-y-4">
            {/* Stats du mois */}
            <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl p-5 text-white">
              <h3 className="font-bold mb-4">
                💰 {new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-xl p-3">
                  <p className="text-green-100 text-xs">Heures ce mois</p>
                  <p className="text-2xl font-bold">{stats.heuresMois.toFixed(1)}h</p>
                </div>
                <div className="bg-white/10 rounded-xl p-3">
                  <p className="text-green-100 text-xs">Revenus ce mois</p>
                  <p className="text-2xl font-bold">{stats.revenuMois.toFixed(0)}€</p>
                </div>
              </div>

              {stats.fraisKmMois > 0 && (
                <p className="text-sm text-green-100 mt-3">
                  + {stats.fraisKmMois.toFixed(2)}€ frais km ({stats.nbInterventionsMois} déplacements)
                </p>
              )}
            </div>

            {/* Estimations */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="font-bold text-gray-700 mb-3">📊 Estimations</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Par semaine (horaires habituels)</span>
                  <span className="font-bold text-gray-800">{stats.revenuHebdo.toFixed(0)}€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Par mois (estimé)</span>
                  <span className="font-bold text-gray-800">{(stats.revenuHebdo * 4).toFixed(0)}€</span>
                </div>
                {beneficiaire.kmAllerRetour > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">
                      + frais km ({beneficiaire.kmAllerRetour}km × {beneficiaire.fraisKm}€)
                    </span>
                    <span className="text-gray-500">
                      ~{(beneficiaire.kmAllerRetour * beneficiaire.fraisKm * stats.joursUniques * 4).toFixed(0)}€/mois
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal confirmation suppression */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Supprimer ce bénéficiaire ?
            </h3>
            <p className="text-gray-600 mb-6">
              Cette action est irréversible. Toutes les données associées seront perdues.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="flex-1 py-3 border border-gray-300 rounded-xl font-medium"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl font-medium"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Barre de navigation */}
      <BottomNav />
    </div>
  )
}