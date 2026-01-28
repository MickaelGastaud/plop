import { useMemo } from 'react'
import { useBeneficiaires } from '../store/useBeneficiaires'

export default function CarteRevenus() {
  const { beneficiaires } = useBeneficiaires()

  const stats = useMemo(() => {
    const now = new Date()
    const benefActifs = beneficiaires.filter(b => b.statut === 'actif')

    // Heures hebdo habituelles
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

    // Pourcentage du mois écoulé
    const jourActuel = now.getDate()
    const dernierJour = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
    const pourcentageMois = Math.round((jourActuel / dernierJour) * 100)

    return {
      nbBenefActifs: benefActifs.length,
      heuresHebdo,
      revenuHebdo,
      revenuMensuel: revenuHebdo * 4,
      heuresMensuel: heuresHebdo * 4,
      pourcentageMois,
    }
  }, [beneficiaires])

  const nomMois = new Date().toLocaleDateString('fr-FR', { month: 'long' })

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header avec montants */}
      <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-5 py-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-teal-100 text-sm">Estimation {nomMois}</p>
            <p className="text-3xl font-bold">{stats.revenuMensuel.toFixed(0)}€</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold">{stats.heuresMensuel.toFixed(0)}h</p>
            <p className="text-teal-100 text-sm">/ mois</p>
          </div>
        </div>
      </div>

      {/* Barre de progression + stats */}
      <div className="p-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-500">Mois en cours</span>
          <span className="font-medium text-gray-700">{stats.pourcentageMois}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
          <div 
            className="h-full bg-gradient-to-r from-teal-400 to-teal-500 rounded-full transition-all"
            style={{ width: `${stats.pourcentageMois}%` }}
          />
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="py-2">
            <p className="text-2xl font-bold text-gray-800">{stats.nbBenefActifs}</p>
            <p className="text-xs text-gray-500">bénéficiaire{stats.nbBenefActifs > 1 ? 's' : ''}</p>
          </div>
          <div className="py-2 border-x border-gray-100">
            <p className="text-2xl font-bold text-teal-600">{stats.heuresHebdo.toFixed(0)}h</p>
            <p className="text-xs text-gray-500">/ semaine</p>
          </div>
          <div className="py-2">
            <p className="text-2xl font-bold text-green-600">{stats.revenuHebdo.toFixed(0)}€</p>
            <p className="text-xs text-gray-500">/ semaine</p>
          </div>
        </div>
      </div>
    </div>
  )
}