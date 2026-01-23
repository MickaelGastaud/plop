import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useBeneficiaires } from '../store/useBeneficiaires'
import jsPDF from 'jspdf'

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

export default function DevisPage() {
  const { beneficiaires } = useBeneficiaires()
  
  const [devis, setDevis] = useState({
    beneficiaireId: '',
    prestations: [] as string[],
    tarifHoraire: 14,
    heuresParSemaine: 10,
    fraisDeplacement: 0,
    notes: '',
  })

  const beneficiaire = beneficiaires.find((b) => b.id === Number(devis.beneficiaireId))

  const togglePrestation = (prestation: string) => {
    if (devis.prestations.includes(prestation)) {
      setDevis({ ...devis, prestations: devis.prestations.filter((p) => p !== prestation) })
    } else {
      setDevis({ ...devis, prestations: [...devis.prestations, prestation] })
    }
  }

  const totalMensuel = (devis.tarifHoraire * devis.heuresParSemaine * 4) + devis.fraisDeplacement

  const genererPDF = () => {
    if (!beneficiaire) {
      alert('Veuillez sélectionner un bénéficiaire')
      return
    }

    const doc = new jsPDF()
    const date = new Date().toLocaleDateString('fr-FR')

    doc.setFontSize(24)
    doc.setTextColor(13, 148, 136)
    doc.text('CeSuCare', 20, 25)
    
    doc.setFontSize(12)
    doc.setTextColor(100)
    doc.text('Proposition tarifaire', 20, 35)
    doc.text(`Date : ${date}`, 150, 25)

    doc.setDrawColor(13, 148, 136)
    doc.line(20, 40, 190, 40)

    doc.setFontSize(14)
    doc.setTextColor(0)
    doc.text('Bénéficiaire', 20, 55)
    doc.setFontSize(11)
    doc.setTextColor(60)
    doc.text(`${beneficiaire.prenom} ${beneficiaire.nom}`, 20, 63)
    doc.text(`${beneficiaire.adresse || 'Adresse non renseignée'}`, 20, 70)
    doc.text(`Tél : ${beneficiaire.telephone}`, 20, 77)

    doc.setFontSize(14)
    doc.setTextColor(0)
    doc.text('Prestations proposées', 20, 95)
    
    doc.setFontSize(11)
    doc.setTextColor(60)
    let y = 103
    devis.prestations.forEach((p) => {
      doc.text(`• ${p}`, 25, y)
      y += 7
    })

    y += 10
    doc.setFontSize(14)
    doc.setTextColor(0)
    doc.text('Tarification', 20, y)
    
    y += 10
    doc.setFontSize(11)
    doc.setTextColor(60)
    doc.text(`Tarif horaire : ${devis.tarifHoraire} €/h`, 25, y)
    y += 7
    doc.text(`Volume horaire : ${devis.heuresParSemaine} h/semaine`, 25, y)
    y += 7
    doc.text(`Frais de déplacement : ${devis.fraisDeplacement} €/mois`, 25, y)
    
    y += 15
    doc.setFontSize(14)
    doc.setTextColor(13, 148, 136)
    doc.text(`Total estimé : ${totalMensuel} €/mois`, 25, y)

    if (devis.notes) {
      y += 15
      doc.setFontSize(11)
      doc.setTextColor(100)
      doc.text('Notes :', 20, y)
      y += 7
      doc.text(devis.notes, 20, y)
    }

    doc.setFontSize(9)
    doc.setTextColor(150)
    doc.text('Ce devis est valable 30 jours. Paiement en CESU.', 20, 270)
    doc.text('CeSuCare - Services à la personne', 20, 277)

    doc.save(`devis-${beneficiaire.nom}-${date}.pdf`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-teal-600 text-white p-4 flex items-center gap-4">
        <Link to="/dashboard" className="hover:bg-teal-700 p-2 rounded">
          ← Retour
        </Link>
        <h1 className="text-xl font-bold">📄 Générateur de Devis</h1>
      </header>

      <main className="p-6 max-w-2xl mx-auto space-y-6">
        <div className="bg-white p-4 rounded-xl shadow">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bénéficiaire
          </label>
          <select
            value={devis.beneficiaireId}
            onChange={(e) => setDevis({ ...devis, beneficiaireId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">-- Sélectionner --</option>
            {beneficiaires.map((b) => (
              <option key={b.id} value={b.id}>
                {b.prenom} {b.nom}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prestations
          </label>
          <div className="grid grid-cols-2 gap-2">
            {PRESTATIONS.map((p) => (
              <label
                key={p}
                className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer border ${
                  devis.prestations.includes(p)
                    ? 'bg-teal-50 border-teal-500'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={devis.prestations.includes(p)}
                  onChange={() => togglePrestation(p)}
                  className="accent-teal-600"
                />
                <span className="text-sm">{p}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tarif horaire (€)
              </label>
              <input
                type="number"
                value={devis.tarifHoraire}
                onChange={(e) => setDevis({ ...devis, tarifHoraire: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Heures / semaine
              </label>
              <input
                type="number"
                value={devis.heuresParSemaine}
                onChange={(e) => setDevis({ ...devis, heuresParSemaine: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Frais de déplacement (€/mois)
            </label>
            <input
              type="number"
              value={devis.fraisDeplacement}
              onChange={(e) => setDevis({ ...devis, fraisDeplacement: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes (optionnel)
          </label>
          <textarea
            value={devis.notes}
            onChange={(e) => setDevis({ ...devis, notes: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            rows={2}
            placeholder="Conditions particulières..."
          />
        </div>

        <div className="bg-teal-50 p-4 rounded-xl border border-teal-200">
          <p className="text-lg font-semibold text-teal-700">
            Total estimé : {totalMensuel} €/mois
          </p>
          <p className="text-sm text-teal-600">
            ({devis.tarifHoraire}€ × {devis.heuresParSemaine}h × 4 sem. + {devis.fraisDeplacement}€ frais)
          </p>
        </div>

        <button
          onClick={genererPDF}
          className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition"
        >
          📥 Générer le PDF
        </button>

        <Link
          to="/contrat"
          className="block text-center text-teal-600 hover:underline"
        >
          📋 Générer un contrat CESU →
        </Link>
      </main>
    </div>
  )
}