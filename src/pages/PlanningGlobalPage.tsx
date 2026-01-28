import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useBeneficiaires } from '../store/useBeneficiaires'
import { useInterventions } from '../store/useInterventions'
import { useProfil } from '../store/useProfil'
import Layout from '../components/Layout'

// Helpers pour les dates
const JOURS_SEMAINE = ['DIM', 'LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM']
const MOIS = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
const JOURS_NOMS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']

// Type pour les moments de la journée
type Moment = 'matin' | 'apresMidi' | 'soir' | 'nuit'

// Créneaux horaires par moment de la journée
const CRENEAUX: Record<Moment, { debut: string; fin: string; label: string; sublabel: string }> = {
  matin: { debut: '08:00', fin: '12:00', label: '🌅 Matin', sublabel: '8h - 12h' },
  apresMidi: { debut: '14:00', fin: '18:00', label: '☀️ Après-midi', sublabel: '14h - 18h' },
  soir: { debut: '18:00', fin: '21:00', label: '🌆 Soir', sublabel: '18h - 21h' },
  nuit: { debut: '21:00', fin: '07:00', label: '🌙 Nuit', sublabel: '21h - 7h' },
}

function getWeekDays(date: Date): Date[] {
  const days: Date[] = []
  const current = new Date(date)
  
  const day = current.getDay()
  const diff = current.getDate() - day + (day === 0 ? -6 : 1)
  current.setDate(diff)
  
  for (let i = 0; i < 14; i++) {
    days.push(new Date(current))
    current.setDate(current.getDate() + 1)
  }
  
  return days
}

function isSameDay(d1: Date, d2: Date): boolean {
  return d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear()
}

function isToday(date: Date): boolean {
  return isSameDay(date, new Date())
}

function getJourIndex(date: Date): number {
  const day = date.getDay()
  return day === 0 ? 6 : day - 1
}

export default function PlanningGlobalPage() {
  const { beneficiaires } = useBeneficiaires()
  const { interventions } = useInterventions()
  const { profil } = useProfil()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [weekStart, setWeekStart] = useState(new Date())
  
  const days = getWeekDays(weekStart)
  
  // Filtrer les interventions du jour sélectionné
  const selectedDateStr = selectedDate.toISOString().split('T')[0]
  const interventionsDuJour = interventions.filter(i => i.date === selectedDateStr && i.statut !== 'annule')
  
  // Obtenir les disponibilités du jour sélectionné
  const jourSemaine = getJourIndex(selectedDate)
  const disponibilites = profil.disponibilites || []
  const dispoJour = disponibilites.find(d => d.jour === JOURS_NOMS[jourSemaine])
  
  // Calculer les créneaux libres
  const getCreneauxLibres = () => {
    if (!dispoJour) return []
    
    const libres: { moment: Moment; label: string; sublabel: string }[] = []
    const moments: Moment[] = ['matin', 'apresMidi', 'soir', 'nuit']
    
    moments.forEach((moment) => {
      if (dispoJour[moment]) {
        const creneau = CRENEAUX[moment]
        
        // Vérifier si ce créneau n'est pas déjà pris
        const estPris = interventionsDuJour.some(intervention => {
          const hDebut = intervention.heureDebut.replace(':', '')
          const hFin = intervention.heureFin.replace(':', '')
          const cDebut = creneau.debut.replace(':', '')
          const cFin = creneau.fin.replace(':', '')
          
          return !(hFin <= cDebut || hDebut >= cFin)
        })
        
        if (!estPris) {
          libres.push({
            moment,
            label: creneau.label,
            sublabel: creneau.sublabel
          })
        }
      }
    })
    
    return libres
  }
  
  const creneauxLibres = getCreneauxLibres()
  
  // Navigation semaines
  const goToToday = () => {
    setSelectedDate(new Date())
    setWeekStart(new Date())
  }
  
  const previousWeek = () => {
    const newStart = new Date(weekStart)
    newStart.setDate(newStart.getDate() - 7)
    setWeekStart(newStart)
  }
  
  const nextWeek = () => {
    const newStart = new Date(weekStart)
    newStart.setDate(newStart.getDate() + 7)
    setWeekStart(newStart)
  }

  // Trouver le bénéficiaire par ID
  const getBeneficiaire = (id: number) => {
    return beneficiaires.find(b => b.id === id)
  }

  // Vérifier si un jour a des interventions
  const hasIntervention = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return interventions.some(i => i.date === dateStr && i.statut !== 'annule')
  }

  // Vérifier si l'utilisateur est dispo ce jour
  const isDispoJour = (date: Date) => {
    const idx = getJourIndex(date)
    const dispo = disponibilites.find(d => d.jour === JOURS_NOMS[idx])
    return dispo && (dispo.matin || dispo.apresMidi || dispo.soir || dispo.nuit)
  }
  
  // Vérifier si le jour sélectionné a des dispos
  const hasDispoSelected = dispoJour && (dispoJour.matin || dispoJour.apresMidi || dispoJour.soir || dispoJour.nuit)

  return (
    <Layout>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4 sticky top-0 z-40">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-gray-900">📅 Planning</h1>
            <button
              onClick={goToToday}
              className="px-4 py-2 bg-teal-50 text-teal-700 rounded-full text-sm font-medium hover:bg-teal-100 transition"
            >
              Aujourd'hui
            </button>
          </div>
          
          {/* Navigation mois */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={previousWeek}
              className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-full text-xl"
            >
              ‹
            </button>
            <h2 className="text-lg font-semibold text-gray-800">
              {MOIS[selectedDate.getMonth()]} {selectedDate.getFullYear()}
            </h2>
            <button
              onClick={nextWeek}
              className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded-full text-xl"
            >
              ›
            </button>
          </div>
          
          {/* Calendrier horizontal */}
          <div className="flex gap-1 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {days.map((day, index) => {
              const isSelected = isSameDay(day, selectedDate)
              const isTodayDate = isToday(day)
              const hasInterv = hasIntervention(day)
              const isDispo = isDispoJour(day)
              
              return (
                <button
                  key={index}
                  onClick={() => setSelectedDate(day)}
                  className={`flex-shrink-0 w-12 py-2 rounded-xl flex flex-col items-center transition relative ${
                    isSelected
                      ? 'bg-teal-600 text-white'
                      : isTodayDate
                      ? 'bg-teal-100 text-teal-700'
                      : isDispo
                      ? 'bg-green-50 text-gray-600 hover:bg-green-100'
                      : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                  }`}
                >
                  <span className={`text-xs font-medium ${isSelected ? 'text-teal-100' : isTodayDate ? 'text-teal-500' : 'text-gray-400'}`}>
                    {JOURS_SEMAINE[day.getDay()]}
                  </span>
                  <span className="text-lg font-bold">
                    {day.getDate()}
                  </span>
                  {hasInterv && (
                    <span className={`w-1.5 h-1.5 rounded-full mt-1 ${isSelected ? 'bg-white' : 'bg-teal-500'}`} />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </header>

      {/* Contenu */}
      <main className="px-4 py-6 max-w-lg mx-auto">
        {/* Date sélectionnée */}
        <p className="text-sm text-gray-500 mb-4">
          {selectedDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
          {hasDispoSelected && (
            <span className="ml-2 text-green-600">• Disponible</span>
          )}
        </p>

        {/* Interventions du jour */}
        {interventionsDuJour.length > 0 && (
          <div className="space-y-3 mb-6">
            <h3 className="text-sm font-semibold text-gray-700">Interventions prévues</h3>
            {interventionsDuJour
              .sort((a, b) => a.heureDebut.localeCompare(b.heureDebut))
              .map((intervention) => {
                const beneficiaire = getBeneficiaire(intervention.beneficiaireId)
                
                return (
                  <Link
                    key={intervention.id}
                    to={`/beneficiaires/${intervention.beneficiaireId}`}
                    className="block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition"
                  >
                    <div className="flex">
                      <div className="w-1.5 bg-teal-500" />
                      <div className="flex-1 p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm font-semibold text-teal-600">
                              {intervention.heureDebut} → {intervention.heureFin}
                            </p>
                            <h3 className="font-semibold text-gray-900 mt-1">
                              {beneficiaire?.prenom} {beneficiaire?.nom}
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {intervention.type}
                            </p>
                          </div>
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white font-bold">
                            {beneficiaire?.prenom?.[0]?.toUpperCase() || '?'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
          </div>
        )}

        {/* Créneaux libres - Suggestion */}
        {creneauxLibres.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">💡 Créneaux disponibles</h3>
              <Link to="/profil" className="text-xs text-teal-600">Modifier mes dispos</Link>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-4 border border-green-200">
              <p className="text-sm text-green-800 mb-3">
                D'après ton profil, tu es disponible sur ces créneaux :
              </p>
              <div className="flex flex-wrap gap-2">
                {creneauxLibres.map((creneau) => (
                  <div
                    key={creneau.moment}
                    className="px-4 py-2 bg-white rounded-xl border border-green-200 shadow-sm"
                  >
                    <span className="font-medium text-gray-900">{creneau.label}</span>
                    <span className="text-gray-500 text-sm ml-2">{creneau.sublabel}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-green-600 mt-3">
                ✨ Tu pourrais proposer ces créneaux à de nouveaux bénéficiaires !
              </p>
            </div>
          </div>
        )}

        {/* État vide */}
        {interventionsDuJour.length === 0 && creneauxLibres.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">📭</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Aucune intervention</h3>
            <p className="text-gray-500 text-sm mb-4">
              {hasDispoSelected
                ? "Pas d'intervention prévue ce jour"
                : "Tu n'es pas disponible ce jour selon ton profil"
              }
            </p>
            {!hasDispoSelected && (
              <Link
                to="/profil"
                className="inline-block px-6 py-3 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 transition"
              >
                Modifier mes disponibilités
              </Link>
            )}
          </div>
        )}

        {/* Résumé du jour */}
        {interventionsDuJour.length > 0 && (
          <div className="bg-teal-50 rounded-xl p-4 border border-teal-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-teal-600">Total du jour</p>
                <p className="text-2xl font-bold text-teal-700">
                  {interventionsDuJour.length} intervention{interventionsDuJour.length > 1 ? 's' : ''}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-teal-600">Durée estimée</p>
                <p className="text-2xl font-bold text-teal-700">
                  {Math.round(interventionsDuJour.reduce((acc, i) => {
                    const [hDebut, mDebut] = i.heureDebut.split(':').map(Number)
                    const [hFin, mFin] = i.heureFin.split(':').map(Number)
                    return acc + (hFin * 60 + mFin) - (hDebut * 60 + mDebut)
                  }, 0) / 60 * 10) / 10}h
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Légende */}
        <div className="mt-6 flex items-center justify-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 bg-green-100 rounded"></span>
            <span>Disponible</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
            <span>Intervention</span>
          </div>
        </div>
      </main>
    </Layout>
  )
}