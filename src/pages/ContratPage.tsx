import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useBeneficiaires } from '../store/useBeneficiaires'
import jsPDF from 'jspdf'

export default function ContratPage() {
  const { beneficiaires } = useBeneficiaires()

  const [contrat, setContrat] = useState({
    beneficiaireId: '',
    typeContrat: 'CDI',
    dateDebut: '',
    dateFin: '',
    heuresHebdo: 10,
    tarifHoraire: 14,
    joursTravail: [] as string[],
    periodeEssai: 1,
    congesPayes: 2.5,
  })

  const beneficiaire = beneficiaires.find((b) => b.id === Number(contrat.beneficiaireId))

  const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']

  const toggleJour = (jour: string) => {
    if (contrat.joursTravail.includes(jour)) {
      setContrat({ ...contrat, joursTravail: contrat.joursTravail.filter((j) => j !== jour) })
    } else {
      setContrat({ ...contrat, joursTravail: [...contrat.joursTravail, jour] })
    }
  }

  const genererPDF = () => {
    if (!beneficiaire) {
      alert('Veuillez sélectionner un bénéficiaire')
      return
    }
    if (!contrat.dateDebut) {
      alert('Veuillez indiquer la date de début')
      return
    }

    const doc = new jsPDF()
    const date = new Date().toLocaleDateString('fr-FR')

    // En-tête
    doc.setFontSize(20)
    doc.setTextColor(0)
    doc.text('CONTRAT DE TRAVAIL', 105, 25, { align: 'center' })
    doc.setFontSize(14)
    doc.text(`${contrat.typeContrat} - CESU`, 105, 33, { align: 'center' })

    doc.setDrawColor(13, 148, 136)
    doc.line(20, 38, 190, 38)

    let y = 50

    // Employeur
    doc.setFontSize(12)
    doc.setTextColor(13, 148, 136)
    doc.text('EMPLOYEUR (Particulier)', 20, y)
    y += 8
    doc.setTextColor(0)
    doc.setFontSize(11)
    doc.text(`Nom : ${beneficiaire.nom} ${beneficiaire.prenom}`, 25, y)
    y += 6
    doc.text(`Adresse : ${beneficiaire.adresse || 'Non renseignée'}`, 25, y)
    y += 6
    doc.text(`N° CESU : ${beneficiaire.numeroCesu}`, 25, y)
    y += 6
    doc.text(`Téléphone : ${beneficiaire.telephone}`, 25, y)

    y += 15

    // Salarié
    doc.setFontSize(12)
    doc.setTextColor(13, 148, 136)
    doc.text('SALARIÉ (Auxiliaire de vie)', 20, y)
    y += 8
    doc.setTextColor(0)
    doc.setFontSize(11)
    doc.text('Nom : ___________________________', 25, y)
    y += 6
    doc.text('Adresse : ___________________________', 25, y)
    y += 6
    doc.text('N° Sécurité Sociale : ___________________________', 25, y)

    y += 15

    // Conditions
    doc.setFontSize(12)
    doc.setTextColor(13, 148, 136)
    doc.text('CONDITIONS DU CONTRAT', 20, y)
    y += 8
    doc.setTextColor(0)
    doc.setFontSize(11)
    doc.text(`Type de contrat : ${contrat.typeContrat}`, 25, y)
    y += 6
    doc.text(`Date de début : ${contrat.dateDebut}`, 25, y)
    y += 6
    if (contrat.typeContrat === 'CDD' && contrat.dateFin) {
      doc.text(`Date de fin : ${contrat.dateFin}`, 25, y)
      y += 6
    }
    doc.text(`Période d'essai : ${contrat.periodeEssai} mois`, 25, y)
    y += 6
    doc.text(`Durée hebdomadaire : ${contrat.heuresHebdo} heures`, 25, y)
    y += 6
    doc.text(`Jours travaillés : ${contrat.joursTravail.join(', ') || 'À définir'}`, 25, y)

    y += 15

    // Rémunération
    doc.setFontSize(12)
    doc.setTextColor(13, 148, 136)
    doc.text('RÉMUNÉRATION', 20, y)
    y += 8
    doc.setTextColor(0)
    doc.setFontSize(11)
    doc.text(`Salaire horaire brut : ${contrat.tarifHoraire} €`, 25, y)
    y += 6
    const salaireMensuel = contrat.tarifHoraire * contrat.heuresHebdo * 4
    doc.text(`Salaire mensuel estimé : ${salaireMensuel} € brut`, 25, y)
    y += 6
    doc.text(`Congés payés : ${contrat.congesPayes} jours ouvrables / mois travaillé`, 25, y)

    y += 20

    // Signatures
    doc.setFontSize(11)
    doc.text(`Fait à _______________, le ${date}`, 20, y)
    y += 15
    doc.text('Signature Employeur :', 25, y)
    doc.text('Signature Salarié :', 120, y)

    // Mentions légales
    doc.setFontSize(8)
    doc.setTextColor(130)
    doc.text('Contrat régi par la Convention Collective des salariés du particulier employeur.', 20, 280)
    doc.text('Document généré via CeSuCare', 20, 285)

    doc.save(`contrat-${beneficiaire.nom}-${contrat.typeContrat}.pdf`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-teal-600 text-white p-4 flex items-center gap-4">
        <Link to="/devis" className="hover:bg-teal-700 p-2 rounded">
          ← Retour
        </Link>
        <h1 className="text-xl font-bold">📋 Générateur de Contrat CESU</h1>
      </header>

      <main className="p-6 max-w-2xl mx-auto space-y-6">
        {/* Bénéficiaire */}
        <div className="bg-white p-4 rounded-xl shadow">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Employeur (Bénéficiaire)
          </label>
          <select
            value={contrat.beneficiaireId}
            onChange={(e) => setContrat({ ...contrat, beneficiaireId: e.target.value })}
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

        {/* Type de contrat */}
        <div className="bg-white p-4 rounded-xl shadow space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type de contrat
              </label>
              <select
                value={contrat.typeContrat}
                onChange={(e) => setContrat({ ...contrat, typeContrat: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="CDI">CDI</option>
                <option value="CDD">CDD</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Période d'essai (mois)
              </label>
              <input
                type="number"
                value={contrat.periodeEssai}
                onChange={(e) => setContrat({ ...contrat, periodeEssai: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de début
              </label>
              <input
                type="date"
                value={contrat.dateDebut}
                onChange={(e) => setContrat({ ...contrat, dateDebut: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            {contrat.typeContrat === 'CDD' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date de fin
                </label>
                <input
                  type="date"
                  value={contrat.dateFin}
                  onChange={(e) => setContrat({ ...contrat, dateFin: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            )}
          </div>
        </div>

        {/* Horaires */}
        <div className="bg-white p-4 rounded-xl shadow space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jours travaillés
            </label>
            <div className="flex flex-wrap gap-2">
              {JOURS.map((jour) => (
                <button
                  key={jour}
                  type="button"
                  onClick={() => toggleJour(jour)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    contrat.joursTravail.includes(jour)
                      ? 'bg-teal-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {jour}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Heures / semaine
              </label>
              <input
                type="number"
                value={contrat.heuresHebdo}
                onChange={(e) => setContrat({ ...contrat, heuresHebdo: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tarif horaire brut (€)
              </label>
              <input
                type="number"
                value={contrat.tarifHoraire}
                onChange={(e) => setContrat({ ...contrat, tarifHoraire: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Résumé */}
        <div className="bg-teal-50 p-4 rounded-xl border border-teal-200">
          <p className="text-lg font-semibold text-teal-700">
            Salaire mensuel estimé : {contrat.tarifHoraire * contrat.heuresHebdo * 4} € brut
          </p>
        </div>

        <button
          onClick={genererPDF}
          className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition"
        >
          📥 Générer le Contrat PDF
        </button>
      </main>
    </div>
  )
}