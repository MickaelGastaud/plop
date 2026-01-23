import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useBeneficiaires } from '../store/useBeneficiaires'
import jsPDF from 'jspdf'

// Constantes
const CREDIT_IMPOT_TAUX = 0.5
const SEMAINES_PAR_MOIS = 4

const JOURS_SEMAINE = [
  { id: 'lundi', label: 'Lun', fullLabel: 'Lundi', isWeekend: false },
  { id: 'mardi', label: 'Mar', fullLabel: 'Mardi', isWeekend: false },
  { id: 'mercredi', label: 'Mer', fullLabel: 'Mercredi', isWeekend: false },
  { id: 'jeudi', label: 'Jeu', fullLabel: 'Jeudi', isWeekend: false },
  { id: 'vendredi', label: 'Ven', fullLabel: 'Vendredi', isWeekend: false },
  { id: 'samedi', label: 'Sam', fullLabel: 'Samedi', isWeekend: true },
  { id: 'dimanche', label: 'Dim', fullLabel: 'Dimanche', isWeekend: true },
]

const PRESTATIONS = [
  'Aide à la toilette',
  'Aide au lever/coucher',
  'Préparation des repas',
  'Courses',
  'Entretien du logement',
  'Accompagnement sorties',
  'Gestion administrative',
  'Compagnie / stimulation',
]

// Composant Toggle
const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 ${
      checked ? 'bg-teal-500' : 'bg-gray-300'
    }`}
  >
    <span
      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-200 ${
        checked ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
)

export default function DevisPage() {
  const { beneficiaires } = useBeneficiaires()

  // Bénéficiaire sélectionné
  const [beneficiaireId, setBeneficiaireId] = useState('')
  const beneficiaire = beneficiaires.find((b) => b.id === Number(beneficiaireId))

  // Tarifs
  const [tarifNormal, setTarifNormal] = useState(14)
  const [tarifWeekend, setTarifWeekend] = useState(16)
  const [fraisDeplacement, setFraisDeplacement] = useState(0)

  // Options
  const [inclureCreditImpot, setInclureCreditImpot] = useState(true)

  // Heures par jour
  const [heuresJour, setHeuresJour] = useState(2)

  // Jours sélectionnés
  const [joursSelectionnes, setJoursSelectionnes] = useState({
    lundi: true,
    mardi: true,
    mercredi: true,
    jeudi: true,
    vendredi: true,
    samedi: false,
    dimanche: false,
  })

  // Prestations
  const [prestationsSelectionnees, setPrestationsSelectionnees] = useState<string[]>([])

  // Notes
  const [notes, setNotes] = useState('')

  const toggleJour = (jourId: string) => {
    setJoursSelectionnes((prev) => ({
      ...prev,
      [jourId]: !prev[jourId as keyof typeof prev],
    }))
  }

  const togglePrestation = (prestation: string) => {
    if (prestationsSelectionnees.includes(prestation)) {
      setPrestationsSelectionnees(prestationsSelectionnees.filter((p) => p !== prestation))
    } else {
      setPrestationsSelectionnees([...prestationsSelectionnees, prestation])
    }
  }

  // Calculs
  const calculs = useMemo(() => {
    const joursNormaux = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi'].filter(
      (jour) => joursSelectionnes[jour as keyof typeof joursSelectionnes]
    ).length
    const joursWeekend = (joursSelectionnes.samedi ? 1 : 0) + (joursSelectionnes.dimanche ? 1 : 0)
    const totalJours = joursNormaux + joursWeekend

    const heuresMensuellesNormales = heuresJour * joursNormaux * SEMAINES_PAR_MOIS
    const heuresMensuellesWeekend = heuresJour * joursWeekend * SEMAINES_PAR_MOIS
    const totalHeuresMensuelles = heuresMensuellesNormales + heuresMensuellesWeekend

    const coutNormal = heuresMensuellesNormales * tarifNormal
    const coutWeekend = heuresMensuellesWeekend * tarifWeekend
    const totalBrut = coutNormal + coutWeekend + fraisDeplacement

    const creditImpot = inclureCreditImpot ? totalBrut * CREDIT_IMPOT_TAUX : 0
    const totalNet = totalBrut - creditImpot

    return {
      joursNormaux,
      joursWeekend,
      totalJours,
      heuresMensuellesNormales,
      heuresMensuellesWeekend,
      totalHeuresMensuelles,
      coutNormal,
      coutWeekend,
      totalBrut,
      creditImpot,
      totalNet,
    }
  }, [tarifNormal, tarifWeekend, heuresJour, joursSelectionnes, fraisDeplacement, inclureCreditImpot])

  const genererPDF = () => {
    if (!beneficiaire) {
      alert('Veuillez sélectionner un bénéficiaire')
      return
    }

    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const date = new Date().toLocaleDateString('fr-FR')
    let y = 20

    // En-tête
    doc.setFillColor(13, 148, 136)
    doc.rect(0, 0, pageWidth, 40, 'F')

    doc.setTextColor(255, 255, 255)
    doc.setFontSize(24)
    doc.setFont('helvetica', 'bold')
    doc.text('CeSuCare', 20, 25)

    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text('Proposition tarifaire', 20, 33)
    doc.text(`Date : ${date}`, pageWidth - 20, 25, { align: 'right' })

    y = 55

    // Bénéficiaire
    doc.setTextColor(13, 148, 136)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Bénéficiaire', 20, y)
    y += 8

    doc.setTextColor(60, 60, 60)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    doc.text(`${beneficiaire.prenom} ${beneficiaire.nom}`, 25, y)
    y += 6
    doc.text(`${beneficiaire.adresse || 'Adresse non renseignée'}`, 25, y)
    y += 6
    doc.text(`Tél : ${beneficiaire.telephone}`, 25, y)
    y += 15

    // Prestations
    if (prestationsSelectionnees.length > 0) {
      doc.setTextColor(13, 148, 136)
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('Prestations', 20, y)
      y += 8

      doc.setTextColor(60, 60, 60)
      doc.setFontSize(11)
      doc.setFont('helvetica', 'normal')
      prestationsSelectionnees.forEach((p) => {
        doc.text(`• ${p}`, 25, y)
        y += 6
      })
      y += 10
    }

    // Planning
    doc.setTextColor(13, 148, 136)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Planning prévu', 20, y)
    y += 8

    doc.setTextColor(60, 60, 60)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')

    const joursActifs = Object.entries(joursSelectionnes)
      .filter(([_, actif]) => actif)
      .map(([jour]) => JOURS_SEMAINE.find((j) => j.id === jour)?.fullLabel)
      .join(', ')

    doc.text(`Jours : ${joursActifs}`, 25, y)
    y += 6
    doc.text(`Heures/jour : ${heuresJour}h`, 25, y)
    y += 6
    doc.text(`Total mensuel : ${calculs.totalHeuresMensuelles}h/mois`, 25, y)
    y += 15

    // Tarification
    doc.setTextColor(13, 148, 136)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('Tarification', 20, y)
    y += 8

    doc.setTextColor(60, 60, 60)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')

    if (calculs.coutNormal > 0) {
      doc.text(`Lun-Ven (${calculs.heuresMensuellesNormales}h × ${tarifNormal}€)`, 25, y)
      doc.text(`${calculs.coutNormal}€`, pageWidth - 25, y, { align: 'right' })
      y += 6
    }
    if (calculs.coutWeekend > 0) {
      doc.text(`Weekend (${calculs.heuresMensuellesWeekend}h × ${tarifWeekend}€)`, 25, y)
      doc.text(`${calculs.coutWeekend}€`, pageWidth - 25, y, { align: 'right' })
      y += 6
    }
    if (fraisDeplacement > 0) {
      doc.text(`Frais de déplacement`, 25, y)
      doc.text(`${fraisDeplacement}€`, pageWidth - 25, y, { align: 'right' })
      y += 6
    }

    y += 5
    doc.setDrawColor(13, 148, 136)
    doc.line(25, y, pageWidth - 25, y)
    y += 8

    doc.setFont('helvetica', 'bold')
    doc.text('Total brut', 25, y)
    doc.text(`${calculs.totalBrut}€/mois`, pageWidth - 25, y, { align: 'right' })
    y += 8

    if (inclureCreditImpot) {
      doc.setTextColor(46, 204, 113)
      doc.setFont('helvetica', 'normal')
      doc.text('Crédit d\'impôt 50%', 25, y)
      doc.text(`-${calculs.creditImpot}€`, pageWidth - 25, y, { align: 'right' })
      y += 10

      doc.setFillColor(46, 204, 113)
      doc.roundedRect(20, y - 3, pageWidth - 40, 12, 2, 2, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text('Reste à charge', 25, y + 5)
      doc.text(`${calculs.totalNet}€/mois`, pageWidth - 25, y + 5, { align: 'right' })
    }

    // Notes
    if (notes) {
      y += 25
      doc.setTextColor(100, 100, 100)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.text('Notes :', 20, y)
      y += 5
      doc.text(notes, 20, y)
    }

    // Footer
    doc.setTextColor(150, 150, 150)
    doc.setFontSize(9)
    doc.text('Ce devis est valable 30 jours. Paiement en CESU.', 20, 270)
    doc.text('CeSuCare - Services à la personne', 20, 277)

    doc.save(`devis-${beneficiaire.nom}-${date}.pdf`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-teal-600 text-white p-4 flex items-center gap-4">
        <Link to="/dashboard" className="hover:bg-teal-700 p-2 rounded">
          ← Retour
        </Link>
        <h1 className="text-xl font-bold">📄 Générateur de Devis</h1>
      </header>

      <main className="p-6 max-w-4xl mx-auto">
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full mb-4">
            <span className="text-3xl">🧮</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Calculateur de devis</h2>
          <p className="text-gray-600">Estimation rapide et professionnelle</p>
        </motion.div>

        {/* Section 1 : Bénéficiaire */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-lg mb-6"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            👤 Bénéficiaire
          </h3>
          <select
            value={beneficiaireId}
            onChange={(e) => setBeneficiaireId(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none"
          >
            <option value="">-- Sélectionner un bénéficiaire --</option>
            {beneficiaires.map((b) => (
              <option key={b.id} value={b.id}>
                {b.prenom} {b.nom}
              </option>
            ))}
          </select>
        </motion.div>

        {/* Section 2 : Tarifs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-6 shadow-lg mb-6"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            💰 Tarifs horaires
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">☀️ Lun-Ven</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.5"
                  value={tarifNormal}
                  onChange={(e) => setTarifNormal(Number(e.target.value))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none text-lg font-bold text-center"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">€/h</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">📅 Weekend</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.5"
                  value={tarifWeekend}
                  onChange={(e) => setTarifWeekend(Number(e.target.value))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none text-lg font-bold text-center"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">€/h</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">🚗 Déplacement</label>
              <div className="relative">
                <input
                  type="number"
                  step="5"
                  value={fraisDeplacement}
                  onChange={(e) => setFraisDeplacement(Number(e.target.value))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none text-lg font-bold text-center"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">€/mois</span>
              </div>
            </div>
          </div>

          {/* Crédit d'impôt */}
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
            <div>
              <p className="font-semibold text-gray-900">💳 Crédit d'impôt 50%</p>
              <p className="text-sm text-gray-600">Avantage fiscal services à la personne</p>
            </div>
            <ToggleSwitch checked={inclureCreditImpot} onChange={setInclureCreditImpot} />
          </div>
        </motion.div>

        {/* Section 3 : Heures et jours */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-lg mb-6"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            ⏰ Volume horaire
          </h3>

          {/* Heures par jour */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Heures par jour d'intervention
            </label>

            <div className="grid grid-cols-4 gap-2 mb-4">
              {[1, 2, 3, 4].map((h) => (
                <button
                  key={h}
                  onClick={() => setHeuresJour(h)}
                  className={`p-3 rounded-xl border-2 transition-all text-center ${
                    heuresJour === h
                      ? 'border-teal-500 bg-teal-50 text-teal-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-xl font-bold block">{h}h</span>
                </button>
              ))}
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">Ajuster</span>
                <input
                  type="range"
                  min="0.5"
                  max="8"
                  step="0.5"
                  value={heuresJour}
                  onChange={(e) => setHeuresJour(Number(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-teal-500"
                />
                <div className="w-16 text-center bg-white rounded-lg px-3 py-2 border shadow-sm">
                  <span className="text-xl font-bold text-teal-600">{heuresJour}h</span>
                </div>
              </div>
            </div>
          </div>

          {/* Jours */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Jours d'intervention
            </label>
            <div className="grid grid-cols-7 gap-2">
              {JOURS_SEMAINE.map((jour) => {
                const isSelected = joursSelectionnes[jour.id as keyof typeof joursSelectionnes]
                return (
                  <button
                    key={jour.id}
                    onClick={() => toggleJour(jour.id)}
                    className={`p-3 rounded-xl border-2 transition-all text-center ${
                      isSelected
                        ? jour.isWeekend
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-teal-500 bg-teal-50 text-teal-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-sm font-bold block">{jour.label}</span>
                    {isSelected && (
                      <span className="text-xs block mt-1">
                        {jour.isWeekend ? tarifWeekend : tarifNormal}€
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Récap */}
          <div className="mt-6 bg-teal-50 rounded-xl p-4 border border-teal-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-teal-700 font-semibold">
                  💡 {heuresJour}h/jour × {calculs.totalJours} jour{calculs.totalJours > 1 ? 's' : ''}/sem
                </p>
                <p className="text-sm text-teal-600">= {calculs.totalHeuresMensuelles} heures/mois</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-teal-700">{calculs.totalBrut}€</p>
                <p className="text-xs text-teal-600">brut/mois</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Section 4 : Prestations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-lg mb-6"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            🛠️ Prestations
          </h3>

          <div className="grid grid-cols-2 gap-2">
            {PRESTATIONS.map((p) => (
              <label
                key={p}
                className={`flex items-center gap-2 p-3 rounded-xl cursor-pointer border-2 transition-all ${
                  prestationsSelectionnees.includes(p)
                    ? 'bg-teal-50 border-teal-500'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={prestationsSelectionnees.includes(p)}
                  onChange={() => togglePrestation(p)}
                  className="accent-teal-600 w-4 h-4"
                />
                <span className="text-sm">{p}</span>
              </label>
            ))}
          </div>
        </motion.div>

        {/* Section 5 : Notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-lg mb-6"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            📝 Notes
          </h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none"
            rows={3}
            placeholder="Conditions particulières, remarques..."
          />
        </motion.div>

        {/* Section 6 : Résultat */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl p-6 shadow-lg mb-6"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            📊 Récapitulatif
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="border-2 border-teal-200 rounded-2xl p-6 bg-teal-50">
              <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">Coût brut</p>
              <p className="text-4xl font-bold text-teal-700">
                {calculs.totalBrut}€<span className="text-lg">/mois</span>
              </p>
            </div>

            {inclureCreditImpot && (
              <div className="border-2 border-green-300 rounded-2xl p-6 bg-green-50">
                <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">Reste à charge</p>
                <p className="text-4xl font-bold text-green-600">
                  {calculs.totalNet}€<span className="text-lg">/mois</span>
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Après crédit d'impôt de {calculs.creditImpot}€
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Boutons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-4"
        >
          <button
            onClick={genererPDF}
            className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white py-4 rounded-xl font-bold text-lg hover:from-teal-600 hover:to-teal-700 transition-all shadow-lg flex items-center justify-center gap-3"
          >
            📥 Télécharger le devis PDF
          </button>

          <Link
            to="/contrat"
            className="block text-center text-teal-600 hover:underline"
          >
            📋 Générer un contrat CESU →
          </Link>
        </motion.div>
      </main>
    </div>
  )
}