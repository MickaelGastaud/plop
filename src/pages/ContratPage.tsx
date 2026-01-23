import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Tooltip from '../components/Tooltip'
import Champ from '../components/Champ'
import jsPDF from 'jspdf'

// Types
interface Personne {
  nomNaissance: string
  nomUsage: string
  prenom: string
  adresse: string
  ville: string
  codePostal: string
  telephone: string
  email: string
}

interface Employeur extends Personne {
  numeroCesu: string
}

interface Salarie extends Personne {
  numeroSecu: string
}

interface LieuTravail {
  adresse: string
  ville: string
  codePostal: string
}

interface HorairesJour {
  actif: boolean
  heureArrivee: string
  heureDepart: string
  presenceResponsable: boolean
}

interface ContratData {
  employeur: Employeur
  salarie: Salarie
  dateEmbauche: string
  periodeEssai: string
  lieuPrincipal: LieuTravail
  lieuSecondaire: LieuTravail
  aResidenceSecondaire: boolean
  emploi: string
  classification: string
  activitesComplementaires: string
  typeDuree: 'cas1' | 'cas2' | 'cas3'
  heuresHebdo: number
  horaires: Record<string, HorairesJour>
  presenceNuit: Record<string, { actif: boolean; debut: string; fin: string }>
  reposHebdo: string
  premier1erMai: 'chome' | 'travaille'
  joursFeriesTravailles: string[]
  salaireHoraireBrut: number
  salaireHoraireNet: number
  heuresSupRecup: 'remunere' | 'recupere'
  indemnitesNuit1: number
  indemnitesNuit2: number
  repas: number
  logement: number
  transportPourcent: number
  conduite: boolean
  primeForfaitaire: number
  indemniteKm: number
  delaiConges: number
  conditionsParticulieres: string
  lieuSignature: string
  dateSignature: string
}

const JOURS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']

const JOURS_FERIES = [
  '1er janvier',
  'Lundi de Pâques',
  '8 mai',
  'Jeudi de l\'Ascension',
  'Lundi de Pentecôte',
  '14 juillet',
  '15 août',
  '1er novembre',
  '11 novembre',
  '25 décembre',
]

// Constantes pour le calcul brut/net
const TAUX_CHARGES_SALARIALES = 0.22 // ~22% de charges salariales en CESU
const SMIC_HORAIRE_BRUT = 11.88 // SMIC 2025 (à mettre à jour si besoin)
const SMIC_HORAIRE_NET = SMIC_HORAIRE_BRUT * (1 - TAUX_CHARGES_SALARIALES)

export default function ContratPage() {
  const [etape, setEtape] = useState(1)
  const totalEtapes = 6
  const [modeCalcul, setModeCalcul] = useState<'brut' | 'net'>('brut') // Quel champ pilote le calcul

  const [contrat, setContrat] = useState<ContratData>({
    employeur: {
      nomNaissance: '',
      nomUsage: '',
      prenom: '',
      adresse: '',
      ville: '',
      codePostal: '',
      telephone: '',
      email: '',
      numeroCesu: '',
    },
    salarie: {
      nomNaissance: '',
      nomUsage: '',
      prenom: '',
      adresse: '',
      ville: '',
      codePostal: '',
      telephone: '',
      email: '',
      numeroSecu: '',
    },
    dateEmbauche: '',
    periodeEssai: '1 mois',
    lieuPrincipal: { adresse: '', ville: '', codePostal: '' },
    lieuSecondaire: { adresse: '', ville: '', codePostal: '' },
    aResidenceSecondaire: false,
    emploi: '',
    classification: '',
    activitesComplementaires: '',
    typeDuree: 'cas1',
    heuresHebdo: 20,
    horaires: JOURS.reduce((acc, jour) => ({
      ...acc,
      [jour]: { actif: false, heureArrivee: '09:00', heureDepart: '12:00', presenceResponsable: false }
    }), {}),
    presenceNuit: JOURS.reduce((acc, jour) => ({
      ...acc,
      [jour]: { actif: false, debut: '20:00', fin: '06:30' }
    }), {}),
    reposHebdo: 'Dimanche',
    premier1erMai: 'chome',
    joursFeriesTravailles: [],
    salaireHoraireBrut: SMIC_HORAIRE_BRUT,
    salaireHoraireNet: SMIC_HORAIRE_NET,
    heuresSupRecup: 'remunere',
    indemnitesNuit1: 0,
    indemnitesNuit2: 0,
    repas: 0,
    logement: 0,
    transportPourcent: 50,
    conduite: false,
    primeForfaitaire: 0,
    indemniteKm: 0.52,
    delaiConges: 2,
    conditionsParticulieres: '',
    lieuSignature: '',
    dateSignature: '',
  })

  // Fonctions de conversion brut/net
  const brutToNet = (brut: number) => Math.round(brut * (1 - TAUX_CHARGES_SALARIALES) * 100) / 100
  const netToBrut = (net: number) => Math.round(net / (1 - TAUX_CHARGES_SALARIALES) * 100) / 100

  // Mise à jour du salaire brut (calcule automatiquement le net)
  const updateSalaireBrut = (brut: number) => {
    setModeCalcul('brut')
    setContrat(prev => ({
      ...prev,
      salaireHoraireBrut: brut,
      salaireHoraireNet: brutToNet(brut)
    }))
  }

  // Mise à jour du salaire net (calcule automatiquement le brut)
  const updateSalaireNet = (net: number) => {
    setModeCalcul('net')
    setContrat(prev => ({
      ...prev,
      salaireHoraireNet: net,
      salaireHoraireBrut: netToBrut(net)
    }))
  }

  // Helpers pour mettre à jour le state
  const updateEmployeur = (field: keyof Employeur, value: string) => {
    setContrat(prev => ({
      ...prev,
      employeur: { ...prev.employeur, [field]: value }
    }))
  }

  const updateSalarie = (field: keyof Salarie, value: string) => {
    setContrat(prev => ({
      ...prev,
      salarie: { ...prev.salarie, [field]: value }
    }))
  }

  const updateLieuPrincipal = (field: keyof LieuTravail, value: string) => {
    setContrat(prev => ({
      ...prev,
      lieuPrincipal: { ...prev.lieuPrincipal, [field]: value }
    }))
  }

  const updateLieuSecondaire = (field: keyof LieuTravail, value: string) => {
    setContrat(prev => ({
      ...prev,
      lieuSecondaire: { ...prev.lieuSecondaire, [field]: value }
    }))
  }

  const toggleJourFerie = (jour: string) => {
    setContrat(prev => ({
      ...prev,
      joursFeriesTravailles: prev.joursFeriesTravailles.includes(jour)
        ? prev.joursFeriesTravailles.filter(j => j !== jour)
        : [...prev.joursFeriesTravailles, jour]
    }))
  }

  const toggleHoraireJour = (jour: string) => {
    setContrat(prev => ({
      ...prev,
      horaires: {
        ...prev.horaires,
        [jour]: { ...prev.horaires[jour], actif: !prev.horaires[jour].actif }
      }
    }))
  }

  const updateHoraire = (jour: string, field: string, value: string | boolean) => {
    setContrat(prev => ({
      ...prev,
      horaires: {
        ...prev.horaires,
        [jour]: { ...prev.horaires[jour], [field]: value }
      }
    }))
  }

  // Navigation entre étapes
  const nextEtape = () => setEtape(e => Math.min(e + 1, totalEtapes))
  const prevEtape = () => setEtape(e => Math.max(e - 1, 1))

  // Génération PDF avec mentions légales complètes
  const genererPDF = () => {
    const doc = new jsPDF()
    
    doc.setFontSize(18)
    doc.text('CONTRAT DE TRAVAIL À DURÉE INDÉTERMINÉE', 105, 20, { align: 'center' })
    doc.setFontSize(12)
    doc.text('CESU - Convention collective des particuliers employeurs', 105, 28, { align: 'center' })
    
    doc.setDrawColor(13, 148, 136)
    doc.line(20, 33, 190, 33)

    let y = 45

    // --- EMPLOYEUR ---
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('ENTRE LE PARTICULIER EMPLOYEUR :', 20, y)
    y += 8
    doc.setFont('helvetica', 'normal')
    doc.text(`Nom : ${contrat.employeur.nomNaissance} ${contrat.employeur.nomUsage ? '(usage : ' + contrat.employeur.nomUsage + ')' : ''}`, 25, y)
    y += 6
    doc.text(`Prénom : ${contrat.employeur.prenom}`, 25, y)
    y += 6
    doc.text(`Adresse : ${contrat.employeur.adresse}, ${contrat.employeur.codePostal} ${contrat.employeur.ville}`, 25, y)
    y += 6
    doc.text(`Tél : ${contrat.employeur.telephone} | Email : ${contrat.employeur.email}`, 25, y)
    y += 6
    doc.text(`N° CESU : ${contrat.employeur.numeroCesu}`, 25, y)

    y += 12

    // --- SALARIÉ ---
    doc.setFont('helvetica', 'bold')
    doc.text('ET LE SALARIÉ :', 20, y)
    y += 8
    doc.setFont('helvetica', 'normal')
    doc.text(`Nom : ${contrat.salarie.nomNaissance} ${contrat.salarie.nomUsage ? '(usage : ' + contrat.salarie.nomUsage + ')' : ''}`, 25, y)
    y += 6
    doc.text(`Prénom : ${contrat.salarie.prenom}`, 25, y)
    y += 6
    doc.text(`Adresse : ${contrat.salarie.adresse}, ${contrat.salarie.codePostal} ${contrat.salarie.ville}`, 25, y)
    y += 6
    doc.text(`Tél : ${contrat.salarie.telephone} | Email : ${contrat.salarie.email}`, 25, y)
    y += 6
    doc.text(`N° Sécurité sociale : ${contrat.salarie.numeroSecu}`, 25, y)

    y += 12

    // --- 1. CONVENTION COLLECTIVE ---
    doc.setFont('helvetica', 'bold')
    doc.text('1. CONVENTION COLLECTIVE', 20, y)
    y += 6
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.text('Ce contrat est régi par la Convention collective nationale du secteur des particuliers', 25, y)
    y += 5
    doc.text('employeurs et de l\'emploi à domicile (consultable sur legifrance.gouv.fr).', 25, y)
    y += 5
    doc.text('Retraite/Prévoyance : IRCEM, 261 av. des Nations-Unies, 59060 Roubaix', 25, y)

    y += 10
    doc.setFontSize(11)

    // --- 2. DATE D'EFFET ---
    doc.setFont('helvetica', 'bold')
    doc.text('2. DATE D\'EFFET', 20, y)
    y += 6
    doc.setFont('helvetica', 'normal')
    doc.text(`Date d'embauche : ${contrat.dateEmbauche}`, 25, y)
    y += 6
    doc.text(`Période d'essai : ${contrat.periodeEssai || 'Aucune'}`, 25, y)

    y += 10

    // --- 3. LIEU DE TRAVAIL ---
    doc.setFont('helvetica', 'bold')
    doc.text('3. LIEU DE TRAVAIL', 20, y)
    y += 6
    doc.setFont('helvetica', 'normal')
    doc.text(`${contrat.lieuPrincipal.adresse}, ${contrat.lieuPrincipal.codePostal} ${contrat.lieuPrincipal.ville}`, 25, y)
    if (contrat.aResidenceSecondaire) {
      y += 6
      doc.text(`Résidence secondaire : ${contrat.lieuSecondaire.adresse}, ${contrat.lieuSecondaire.codePostal} ${contrat.lieuSecondaire.ville}`, 25, y)
    }

    y += 10

    // --- 4. NATURE DE L'EMPLOI ---
    doc.setFont('helvetica', 'bold')
    doc.text('4. NATURE DE L\'EMPLOI', 20, y)
    y += 6
    doc.setFont('helvetica', 'normal')
    doc.text(`Poste : ${contrat.emploi}`, 25, y)
    y += 6
    doc.text(`Classification : ${contrat.classification}`, 25, y)
    if (contrat.activitesComplementaires) {
      y += 6
      doc.setFontSize(9)
      const activites = doc.splitTextToSize(`Activités complémentaires : ${contrat.activitesComplementaires}`, 160)
      doc.text(activites, 25, y)
      y += activites.length * 4
      doc.setFontSize(11)
    }

    y += 10

    // --- 5. DURÉE DU TRAVAIL ---
    doc.setFont('helvetica', 'bold')
    doc.text('5. DURÉE DU TRAVAIL', 20, y)
    y += 6
    doc.setFont('helvetica', 'normal')
    if (contrat.typeDuree === 'cas1' || contrat.typeDuree === 'cas2') {
      doc.text(`${contrat.heuresHebdo} heures par semaine`, 25, y)
    } else {
      doc.text('Durée irrégulière (planning communiqué 5 jours à l\'avance)', 25, y)
    }

    y += 10

    // --- 6. RÉMUNÉRATION ---
    doc.setFont('helvetica', 'bold')
    doc.text('6. RÉMUNÉRATION', 20, y)
    y += 6
    doc.setFont('helvetica', 'normal')
    doc.text(`Salaire horaire brut : ${contrat.salaireHoraireBrut.toFixed(2)}€`, 25, y)
    y += 6
    doc.text(`Salaire horaire net : ${contrat.salaireHoraireNet.toFixed(2)}€`, 25, y)
    y += 6
    doc.text('Le salaire net est majoré de 10% au titre des congés payés.', 25, y)

    // ========== PAGE 2 ==========
    doc.addPage()
    y = 20

    // --- 7. REPOS HEBDOMADAIRE ---
    doc.setFont('helvetica', 'bold')
    doc.text('7. REPOS HEBDOMADAIRE', 20, y)
    y += 6
    doc.setFont('helvetica', 'normal')
    doc.text(`Jour de repos : ${contrat.reposHebdo}`, 25, y)
    y += 5
    doc.setFontSize(9)
    doc.text('Le repos hebdomadaire comprend un minimum de 35 heures consécutives (24h + 11h de repos quotidien).', 25, y)
    doc.setFontSize(11)

    y += 10

    // --- 8. JOURS FÉRIÉS ---
    doc.setFont('helvetica', 'bold')
    doc.text('8. JOURS FÉRIÉS', 20, y)
    y += 6
    doc.setFont('helvetica', 'normal')
    doc.text(`1er mai : ${contrat.premier1erMai === 'chome' ? 'Chômé' : 'Travaillé (rémunération majorée de 100%)'}`, 25, y)
    if (contrat.joursFeriesTravailles.length > 0) {
      y += 6
      doc.setFontSize(9)
      doc.text(`Jours fériés travaillés (majoration 10%) : ${contrat.joursFeriesTravailles.join(', ')}`, 25, y)
      doc.setFontSize(11)
    }

    y += 10

    // --- 9. CONGÉS PAYÉS ---
    doc.setFont('helvetica', 'bold')
    doc.text('9. CONGÉS PAYÉS', 20, y)
    y += 6
    doc.setFont('helvetica', 'normal')
    doc.text(`Délai de prévenance : ${contrat.delaiConges} mois minimum`, 25, y)
    y += 5
    doc.setFontSize(9)
    doc.text('Le salarié acquiert 2,5 jours ouvrables de congés payés par mois de travail effectif.', 25, y)
    doc.setFontSize(11)

    y += 10

    // --- 10. TRANSPORT ---
    doc.setFont('helvetica', 'bold')
    doc.text('10. TRANSPORT', 20, y)
    y += 6
    doc.setFont('helvetica', 'normal')
    doc.text(`Remboursement transport en commun : ${contrat.transportPourcent}%`, 25, y)
    
    // Conduite véhicule
    if (contrat.conduite) {
      y += 8
      doc.setFont('helvetica', 'bold')
      doc.text('Conduite de véhicule :', 25, y)
      y += 5
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      if (contrat.primeForfaitaire > 0) {
        doc.text(`Prime forfaitaire : ${contrat.primeForfaitaire.toFixed(2)}€/mois`, 30, y)
        y += 4
      }
      if (contrat.indemniteKm > 0) {
        doc.text(`Indemnité kilométrique : ${contrat.indemniteKm.toFixed(2)}€/km`, 30, y)
        y += 4
      }
      doc.text('En cas de conduite d\'un véhicule pour la réalisation des activités professionnelles, le particulier', 25, y)
      y += 4
      doc.text('employeur s\'assure que le salarié est titulaire du permis de conduire et d\'une attestation', 25, y)
      y += 4
      doc.text('d\'assurance en cours de validité en cas d\'usage du véhicule du salarié.', 25, y)
      doc.setFontSize(11)
    }

    y += 10

    // --- 11. CONDITIONS PARTICULIÈRES ---
    if (contrat.conditionsParticulieres) {
      doc.setFont('helvetica', 'bold')
      doc.text('11. CONDITIONS PARTICULIÈRES', 20, y)
      y += 6
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      const lignes = doc.splitTextToSize(contrat.conditionsParticulieres, 160)
      doc.text(lignes, 25, y)
      y += lignes.length * 4 + 5
      doc.setFontSize(11)
    }

    // --- 12. CONFIDENTIALITÉ ---
    doc.setFont('helvetica', 'bold')
    doc.text('12. CONFIDENTIALITÉ', 20, y)
    y += 6
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.text('Les parties s\'engagent à conserver confidentielles les informations personnelles transmises', 25, y)
    y += 4
    doc.text('entre elles dans le cadre de l\'exécution du présent contrat. Elles prennent les mesures', 25, y)
    y += 4
    doc.text('nécessaires pour garantir cette confidentialité.', 25, y)
    doc.setFontSize(11)

    y += 10

    // --- 13. ASSURANCE ---
    doc.setFont('helvetica', 'bold')
    doc.text('13. ASSURANCE RESPONSABILITÉ CIVILE', 20, y)
    y += 6
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.text('En plus de son assurance responsabilité civile personnelle, l\'employeur peut prendre une', 25, y)
    y += 4
    doc.text('assurance responsabilité civile professionnelle pour se garantir des dommages causés', 25, y)
    y += 4
    doc.text('par son salarié dans l\'exercice de ses fonctions.', 25, y)
    doc.setFontSize(11)

    // ========== PAGE 3 - SIGNATURES ==========
    doc.addPage()
    y = 20

    // Rappel légal
    doc.setFontSize(10)
    doc.setFont('helvetica', 'italic')
    doc.text('Ce contrat est établi conformément à la Convention collective nationale de la branche du secteur', 20, y)
    y += 5
    doc.text('des particuliers employeurs et de l\'emploi à domicile (IDCC 3239).', 20, y)
    y += 15

    // Signatures
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.text(`Fait à ${contrat.lieuSignature}, le ${contrat.dateSignature}`, 20, y)
    y += 8
    doc.text('En deux exemplaires originaux, dont un remis à chaque partie.', 20, y)

    y += 25
    doc.setFont('helvetica', 'normal')
    
    // Colonnes pour les signatures
    doc.text('Le particulier employeur', 40, y)
    doc.text('Le salarié', 140, y)
    y += 8
    doc.setFontSize(9)
    doc.text('(signature précédée de la mention', 40, y)
    doc.text('(signature précédée de la mention', 140, y)
    y += 5
    doc.text('manuscrite "Lu et approuvé")', 40, y)
    doc.text('manuscrite "Lu et approuvé")', 140, y)

    // Encadrés pour les signatures
    y += 10
    doc.setDrawColor(150, 150, 150)
    doc.rect(25, y, 70, 40)
    doc.rect(115, y, 70, 40)

    doc.save(`contrat-cesu-${contrat.salarie.nomNaissance || 'salarie'}.pdf`)
  }

  // RENDU PRINCIPAL
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-teal-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/dashboard" className="text-teal-600 hover:text-teal-700">
            ← Retour
          </Link>
          <h1 className="text-xl font-bold text-gray-900">📋 Contrat CESU</h1>
          <div className="w-16" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Barre de progression */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4, 5, 6].map(num => (
              <button
                key={num}
                onClick={() => setEtape(num)}
                className={`w-10 h-10 rounded-full font-bold transition ${
                  num === etape
                    ? 'bg-teal-600 text-white'
                    : num < etape
                    ? 'bg-teal-200 text-teal-700'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div 
              className="h-2 bg-teal-500 rounded-full transition-all"
              style={{ width: `${((etape - 1) / (totalEtapes - 1)) * 100}%` }}
            />
          </div>
          <p className="text-center text-sm text-gray-500 mt-2">
            Étape {etape} / {totalEtapes}
          </p>
        </div>

        {/* ÉTAPE 1 : Employeur & Salarié */}
        {etape === 1 && (
          <div className="space-y-8">
            {/* Employeur */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-teal-700 mb-4 flex items-center gap-2">
                👤 Le particulier employeur
                <Tooltip 
                  text="C'est la personne (ou famille) qui vous emploie — celle chez qui vous travaillez." 
                  example="Mme Dupont qui vous a embauché"
                />
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <Champ
                  label="Nom de naissance"
                  value={contrat.employeur.nomNaissance}
                  onChange={(v) => updateEmployeur('nomNaissance', v)}
                  tooltip="Le nom de famille à la naissance, écrit sur la carte d'identité"
                  example="MARTIN"
                  placeholder="MARTIN"
                />
                <Champ
                  label="Nom d'usage"
                  value={contrat.employeur.nomUsage}
                  onChange={(v) => updateEmployeur('nomUsage', v)}
                  tooltip="Si la personne a changé de nom (mariage), sinon laisser vide"
                  example="DUPONT (après mariage)"
                  placeholder="Optionnel"
                />
                <Champ
                  label="Prénom"
                  value={contrat.employeur.prenom}
                  onChange={(v) => updateEmployeur('prenom', v)}
                  tooltip="Le prénom de l'employeur"
                  example="Marie"
                  placeholder="Marie"
                />
                <Champ
                  label="N° CESU"
                  value={contrat.employeur.numeroCesu}
                  onChange={(v) => updateEmployeur('numeroCesu', v)}
                  tooltip="Numéro donné par l'URSSAF quand on s'inscrit au CESU. Il commence souvent par des chiffres."
                  example="1234567890123"
                  placeholder="1234567890123"
                />
              </div>

              <Champ
                label="Adresse"
                value={contrat.employeur.adresse}
                onChange={(v) => updateEmployeur('adresse', v)}
                tooltip="L'adresse complète avec numéro et nom de rue"
                example="12 rue des Lilas"
                placeholder="12 rue des Lilas"
              />

              <div className="grid md:grid-cols-2 gap-4">
                <Champ
                  label="Ville"
                  value={contrat.employeur.ville}
                  onChange={(v) => updateEmployeur('ville', v)}
                  tooltip="Le nom de la ville"
                  example="Paris"
                  placeholder="Paris"
                />
                <Champ
                  label="Code postal"
                  value={contrat.employeur.codePostal}
                  onChange={(v) => updateEmployeur('codePostal', v)}
                  tooltip="Les 5 chiffres du code postal"
                  example="75012"
                  placeholder="75012"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Champ
                  label="Téléphone"
                  value={contrat.employeur.telephone}
                  onChange={(v) => updateEmployeur('telephone', v)}
                  tooltip="Le numéro de téléphone"
                  example="06 12 34 56 78"
                  placeholder="06 12 34 56 78"
                />
                <Champ
                  label="Email"
                  value={contrat.employeur.email}
                  onChange={(v) => updateEmployeur('email', v)}
                  tooltip="L'adresse email"
                  example="marie.dupont@email.fr"
                  placeholder="marie.dupont@email.fr"
                  type="email"
                />
              </div>
            </div>

            {/* Salarié */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-teal-700 mb-4 flex items-center gap-2">
                🧑‍⚕️ Le salarié (vous)
                <Tooltip 
                  text="C'est vous ! La personne qui travaille comme auxiliaire de vie." 
                />
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <Champ
                  label="Nom de naissance"
                  value={contrat.salarie.nomNaissance}
                  onChange={(v) => updateSalarie('nomNaissance', v)}
                  tooltip="Votre nom de famille à la naissance"
                  example="BENALI"
                  placeholder="BENALI"
                />
                <Champ
                  label="Nom d'usage"
                  value={contrat.salarie.nomUsage}
                  onChange={(v) => updateSalarie('nomUsage', v)}
                  tooltip="Si vous avez changé de nom, sinon laisser vide"
                  placeholder="Optionnel"
                />
                <Champ
                  label="Prénom"
                  value={contrat.salarie.prenom}
                  onChange={(v) => updateSalarie('prenom', v)}
                  tooltip="Votre prénom"
                  example="Fatima"
                  placeholder="Fatima"
                />
                <Champ
                  label="N° Sécurité sociale"
                  value={contrat.salarie.numeroSecu}
                  onChange={(v) => updateSalarie('numeroSecu', v)}
                  tooltip="Votre numéro de sécurité sociale (15 chiffres). Il est sur votre carte Vitale."
                  example="2 85 12 75 108 234 56"
                  placeholder="2 85 12 75 108 234 56"
                />
              </div>

              <Champ
                label="Adresse"
                value={contrat.salarie.adresse}
                onChange={(v) => updateSalarie('adresse', v)}
                tooltip="Votre adresse personnelle"
                example="25 avenue de la République"
                placeholder="25 avenue de la République"
              />

              <div className="grid md:grid-cols-2 gap-4">
                <Champ
                  label="Ville"
                  value={contrat.salarie.ville}
                  onChange={(v) => updateSalarie('ville', v)}
                  tooltip="Votre ville"
                  example="Lyon"
                  placeholder="Lyon"
                />
                <Champ
                  label="Code postal"
                  value={contrat.salarie.codePostal}
                  onChange={(v) => updateSalarie('codePostal', v)}
                  tooltip="Votre code postal"
                  example="69003"
                  placeholder="69003"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Champ
                  label="Téléphone"
                  value={contrat.salarie.telephone}
                  onChange={(v) => updateSalarie('telephone', v)}
                  tooltip="Votre numéro de téléphone"
                  example="07 98 76 54 32"
                  placeholder="07 98 76 54 32"
                />
                <Champ
                  label="Email"
                  value={contrat.salarie.email}
                  onChange={(v) => updateSalarie('email', v)}
                  tooltip="Votre adresse email"
                  example="fatima.benali@email.fr"
                  placeholder="fatima.benali@email.fr"
                  type="email"
                />
              </div>
            </div>
          </div>
        )}

        {/* ÉTAPE 2 : Contrat & Lieu de travail */}
        {etape === 2 && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-teal-700 mb-4 flex items-center gap-2">
                📅 Date et période d'essai
                <Tooltip text="Quand commence le travail et combien de temps dure la période d'essai" />
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <Champ
                  label="Date d'embauche"
                  value={contrat.dateEmbauche}
                  onChange={(v) => setContrat(prev => ({ ...prev, dateEmbauche: v }))}
                  tooltip="Le premier jour de travail"
                  type="date"
                />
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Période d'essai
                    <Tooltip 
                      text="Période pour voir si le travail convient aux deux parties. On peut arrêter plus facilement pendant cette période." 
                      example="1 mois = 30 jours pour tester"
                    />
                  </label>
                  <select
                    value={contrat.periodeEssai}
                    onChange={(e) => setContrat(prev => ({ ...prev, periodeEssai: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="">Pas de période d'essai</option>
                    <option value="1 semaine">1 semaine</option>
                    <option value="2 semaines">2 semaines</option>
                    <option value="1 mois">1 mois</option>
                    <option value="2 mois">2 mois (renouvelable)</option>
                  </select>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                <strong>ℹ️ Bon à savoir :</strong> Ce contrat est un CDI (durée indéterminée). Les institutions retraite et prévoyance sont IRCEM (c'est automatique, pas besoin de choisir).
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-teal-700 mb-4 flex items-center gap-2">
                🏠 Lieu de travail
                <Tooltip text="L'adresse où vous travaillez — le domicile de l'employeur" />
              </h3>

              <p className="text-sm text-gray-600 mb-4">Domicile principal de l'employeur :</p>
              
              <Champ
                label="Adresse"
                value={contrat.lieuPrincipal.adresse}
                onChange={(v) => updateLieuPrincipal('adresse', v)}
                tooltip="L'adresse où vous travaillez"
                placeholder="12 rue des Lilas"
              />

              <div className="grid md:grid-cols-2 gap-4">
                <Champ
                  label="Ville"
                  value={contrat.lieuPrincipal.ville}
                  onChange={(v) => updateLieuPrincipal('ville', v)}
                  tooltip="La ville"
                  placeholder="Paris"
                />
                <Champ
                  label="Code postal"
                  value={contrat.lieuPrincipal.codePostal}
                  onChange={(v) => updateLieuPrincipal('codePostal', v)}
                  tooltip="Le code postal"
                  placeholder="75012"
                />
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={contrat.aResidenceSecondaire}
                    onChange={(e) => setContrat(prev => ({ ...prev, aResidenceSecondaire: e.target.checked }))}
                    className="w-5 h-5 rounded text-teal-600"
                  />
                  <span className="text-sm text-gray-700">
                    L'employeur a une résidence secondaire
                    <Tooltip text="Une deuxième maison où vous pourriez parfois travailler (vacances, week-ends...)" />
                  </span>
                </label>

                {contrat.aResidenceSecondaire && (
                  <div className="mt-4 pl-4 border-l-4 border-teal-200">
                    <p className="text-sm text-gray-600 mb-4">Résidence secondaire :</p>
                    <Champ
                      label="Adresse"
                      value={contrat.lieuSecondaire.adresse}
                      onChange={(v) => updateLieuSecondaire('adresse', v)}
                      tooltip="L'adresse de la résidence secondaire"
                      placeholder="5 chemin de la Mer"
                    />
                    <div className="grid md:grid-cols-2 gap-4">
                      <Champ
                        label="Ville"
                        value={contrat.lieuSecondaire.ville}
                        onChange={(v) => updateLieuSecondaire('ville', v)}
                        tooltip="La ville"
                        placeholder="La Baule"
                      />
                      <Champ
                        label="Code postal"
                        value={contrat.lieuSecondaire.codePostal}
                        onChange={(v) => updateLieuSecondaire('codePostal', v)}
                        tooltip="Le code postal"
                        placeholder="44500"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ÉTAPE 3 : Nature de l'emploi */}
        {etape === 3 && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-teal-700 mb-4 flex items-center gap-2">
                💼 Nature de l'emploi
                <Tooltip text="Quel travail vous faites exactement" />
              </h3>

              <Champ
                label="Intitulé du poste"
                value={contrat.emploi}
                onChange={(v) => setContrat(prev => ({ ...prev, emploi: v }))}
                tooltip="Le nom de votre travail"
                example="Assistant(e) de vie, Garde à domicile, Aide ménager(ère)"
                placeholder="Assistant(e) de vie"
              />

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Classification
                  <Tooltip 
                    text="Le niveau de votre emploi selon la convention collective. Plus le niveau est haut, plus le salaire minimum est élevé." 
                    example="Niveau 3 = aide à une personne dépendante"
                  />
                </label>
                <select
                  value={contrat.classification}
                  onChange={(e) => setContrat(prev => ({ ...prev, classification: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Choisir une classification</option>
                  <option value="Niveau 1 - Employé familial">Niveau 1 - Employé familial (ménage, repassage)</option>
                  <option value="Niveau 2 - Employé familial auprès d'enfants">Niveau 2 - Garde d'enfants</option>
                  <option value="Niveau 3 - Assistant de vie A">Niveau 3 - Assistant de vie A (aide personne autonome)</option>
                  <option value="Niveau 4 - Assistant de vie B">Niveau 4 - Assistant de vie B (aide personne dépendante)</option>
                  <option value="Niveau 5 - Assistant de vie C">Niveau 5 - Assistant de vie C (aide personne très dépendante)</option>
                  <option value="Niveau 6 - Assistant de vie D">Niveau 6 - Assistant de vie D (aide technique médicale)</option>
                </select>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800 mb-4">
                <strong>💡 Astuce :</strong> Pour trouver votre classification, utilisez le simulateur officiel : 
                <a 
                  href="https://www.simulateur-emploisalarieduparticulieremployeur.fr/classification/simulateur/new/choix-type-domaine" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-teal-600 underline ml-1"
                >
                  simulateur-emploisalarieduparticulieremployeur.fr
                </a>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Activités complémentaires
                  <Tooltip 
                    text="Les tâches en plus de votre travail principal" 
                    example="Courses, accompagnement RDV médicaux, petit jardinage..."
                  />
                </label>
                <textarea
                  value={contrat.activitesComplementaires}
                  onChange={(e) => setContrat(prev => ({ ...prev, activitesComplementaires: e.target.value }))}
                  placeholder="Exemple : Accompagnement aux courses, préparation des repas, aide administrative..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* ÉTAPE 4 : Durée et horaires */}
        {etape === 4 && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-teal-700 mb-4 flex items-center gap-2">
                ⏰ Durée et horaires de travail
                <Tooltip text="Combien d'heures vous travaillez et quand" />
              </h3>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Comment sont organisées vos heures ?
                  <Tooltip text="Choisissez selon ce que vous savez au moment de signer le contrat" />
                </label>
                
                <div className="space-y-3">
                  <label className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition ${contrat.typeDuree === 'cas1' ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input
                      type="radio"
                      name="typeDuree"
                      checked={contrat.typeDuree === 'cas1'}
                      onChange={() => setContrat(prev => ({ ...prev, typeDuree: 'cas1' }))}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-medium">Cas 1 : Horaires fixes et connus</p>
                      <p className="text-sm text-gray-500">Je sais exactement quels jours et quelles heures je travaille</p>
                    </div>
                  </label>

                  <label className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition ${contrat.typeDuree === 'cas2' ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input
                      type="radio"
                      name="typeDuree"
                      checked={contrat.typeDuree === 'cas2'}
                      onChange={() => setContrat(prev => ({ ...prev, typeDuree: 'cas2' }))}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-medium">Cas 2 : Nombre d'heures fixe, jours variables</p>
                      <p className="text-sm text-gray-500">Je connais le nombre d'heures par semaine mais les jours changent</p>
                    </div>
                  </label>

                  <label className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition ${contrat.typeDuree === 'cas3' ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <input
                      type="radio"
                      name="typeDuree"
                      checked={contrat.typeDuree === 'cas3'}
                      onChange={() => setContrat(prev => ({ ...prev, typeDuree: 'cas3' }))}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-medium">Cas 3 : Durée irrégulière</p>
                      <p className="text-sm text-gray-500">Les heures changent chaque semaine (entre 0h et 48h max)</p>
                    </div>
                  </label>
                </div>
              </div>

              {(contrat.typeDuree === 'cas1' || contrat.typeDuree === 'cas2') && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre d'heures par semaine
                    <Tooltip text="Le total d'heures travaillées chaque semaine" example="20h = environ 4h par jour sur 5 jours" />
                  </label>
                  <input
                    type="number"
                    value={contrat.heuresHebdo}
                    onChange={(e) => setContrat(prev => ({ ...prev, heuresHebdo: Number(e.target.value) }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                    min={1}
                    max={48}
                  />
                </div>
              )}

              {contrat.typeDuree === 'cas1' && (
                <div className="overflow-x-auto">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Cochez les jours travaillés et indiquez les horaires :
                  </p>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="p-2 text-left">Jour</th>
                        <th className="p-2 text-center">Travaillé ?</th>
                        <th className="p-2 text-center">Arrivée</th>
                        <th className="p-2 text-center">Départ</th>
                        <th className="p-2 text-center">
                          Présence resp.
                          <Tooltip text="Heures où vous restez vigilant mais pouvez faire vos affaires (1h = 2/3 d'heure payée)" />
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {JOURS.map(jour => (
                        <tr key={jour} className={contrat.horaires[jour]?.actif ? 'bg-teal-50' : ''}>
                          <td className="p-2 font-medium">{jour}</td>
                          <td className="p-2 text-center">
                            <input
                              type="checkbox"
                              checked={contrat.horaires[jour]?.actif || false}
                              onChange={() => toggleHoraireJour(jour)}
                              className="w-5 h-5 rounded text-teal-600"
                            />
                          </td>
                          <td className="p-2 text-center">
                            <input
                              type="time"
                              value={contrat.horaires[jour]?.heureArrivee || '09:00'}
                              onChange={(e) => updateHoraire(jour, 'heureArrivee', e.target.value)}
                              disabled={!contrat.horaires[jour]?.actif}
                              className="px-2 py-1 border rounded disabled:opacity-50"
                            />
                          </td>
                          <td className="p-2 text-center">
                            <input
                              type="time"
                              value={contrat.horaires[jour]?.heureDepart || '12:00'}
                              onChange={(e) => updateHoraire(jour, 'heureDepart', e.target.value)}
                              disabled={!contrat.horaires[jour]?.actif}
                              className="px-2 py-1 border rounded disabled:opacity-50"
                            />
                          </td>
                          <td className="p-2 text-center">
                            <input
                              type="checkbox"
                              checked={contrat.horaires[jour]?.presenceResponsable || false}
                              onChange={(e) => updateHoraire(jour, 'presenceResponsable', e.target.checked)}
                              disabled={!contrat.horaires[jour]?.actif}
                              className="w-5 h-5 rounded text-amber-600 disabled:opacity-50"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {(contrat.typeDuree === 'cas2' || contrat.typeDuree === 'cas3') && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                  <strong>ℹ️ Délai de prévenance :</strong> L'employeur doit vous donner le planning au moins 5 jours à l'avance (par SMS, email ou papier).
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-teal-700 mb-4 flex items-center gap-2">
                🌙 Présence de nuit
                <Tooltip text="Si vous dormez sur place la nuit (entre 20h et 6h30)" />
              </h3>

              <p className="text-sm text-gray-600 mb-4">
                Cochez les nuits où vous restez dormir sur place :
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {JOURS.map(jour => (
                  <label 
                    key={jour}
                    className={`flex items-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition ${
                      contrat.presenceNuit[jour]?.actif ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={contrat.presenceNuit[jour]?.actif || false}
                      onChange={(e) => setContrat(prev => ({
                        ...prev,
                        presenceNuit: {
                          ...prev.presenceNuit,
                          [jour]: { ...prev.presenceNuit[jour], actif: e.target.checked }
                        }
                      }))}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">{jour}</span>
                  </label>
                ))}
              </div>

              {Object.values(contrat.presenceNuit).some(n => n?.actif) && (
                <div className="mt-4 bg-indigo-50 border border-indigo-200 rounded-lg p-4 text-sm text-indigo-800">
                  <strong>ℹ️ Conditions :</strong> Vous devez avoir une chambre séparée et des conditions décentes pour dormir.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ÉTAPE 5 : Repos, jours fériés, rémunération */}
        {etape === 5 && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-teal-700 mb-4 flex items-center gap-2">
                😴 Repos hebdomadaire
                <Tooltip text="Votre jour de repos obligatoire chaque semaine" />
              </h3>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jour de repos
                </label>
                <select
                  value={contrat.reposHebdo}
                  onChange={(e) => setContrat(prev => ({ ...prev, reposHebdo: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                >
                  {JOURS.map(jour => (
                    <option key={jour} value={jour}>{jour}</option>
                  ))}
                </select>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-800">
                <strong>✅ Automatique :</strong> Vous avez aussi 11h de repos quotidien obligatoire (la nuit entre deux journées).
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-teal-700 mb-4 flex items-center gap-2">
                🎉 Jours fériés
                <Tooltip text="Les jours fériés que vous travaillez ou pas" />
              </h3>

              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="font-medium text-red-800 mb-3">
                  1er Mai (fête du travail)
                  <Tooltip text="Le 1er mai est spécial : si vous travaillez, vous êtes payé DOUBLE (×2)" />
                </p>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="1erMai"
                      checked={contrat.premier1erMai === 'chome'}
                      onChange={() => setContrat(prev => ({ ...prev, premier1erMai: 'chome' }))}
                    />
                    <span>Repos (chômé)</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="1erMai"
                      checked={contrat.premier1erMai === 'travaille'}
                      onChange={() => setContrat(prev => ({ ...prev, premier1erMai: 'travaille' }))}
                    />
                    <span>Travaillé (payé ×2)</span>
                  </label>
                </div>
              </div>

              <p className="text-sm font-medium text-gray-700 mb-3">
                Autres jours fériés travaillés (+10% de salaire) :
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {JOURS_FERIES.map(jour => (
                  <label 
                    key={jour}
                    className={`flex items-center gap-2 p-3 border-2 rounded-lg cursor-pointer transition text-sm ${
                      contrat.joursFeriesTravailles.includes(jour) ? 'border-amber-500 bg-amber-50' : 'border-gray-200'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={contrat.joursFeriesTravailles.includes(jour)}
                      onChange={() => toggleJourFerie(jour)}
                      className="w-4 h-4"
                    />
                    <span>{jour}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* RÉMUNÉRATION avec calcul auto */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-teal-700 mb-4 flex items-center gap-2">
                💰 Rémunération
                <Tooltip text="Combien vous êtes payé" />
              </h3>

              {/* Info SMIC */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800 mb-6">
                <strong>📊 Référence SMIC 2025 :</strong>
                <div className="mt-2 flex gap-6">
                  <span>Brut : <strong>{SMIC_HORAIRE_BRUT.toFixed(2)}€/h</strong></span>
                  <span>Net : <strong>≈ {SMIC_HORAIRE_NET.toFixed(2)}€/h</strong></span>
                </div>
                <p className="text-xs mt-2 text-blue-600">Le salaire ne peut pas être inférieur au SMIC.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salaire horaire BRUT (€)
                    <Tooltip text="Le salaire avant les charges. Modifiez ce champ et le NET se calcule automatiquement." example="14,50€ brut" />
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      value={contrat.salaireHoraireBrut}
                      onChange={(e) => updateSalaireBrut(Number(e.target.value))}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 ${
                        contrat.salaireHoraireBrut < SMIC_HORAIRE_BRUT ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      min={SMIC_HORAIRE_BRUT}
                    />
                    {modeCalcul === 'brut' && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-teal-600">✏️</span>
                    )}
                  </div>
                  {contrat.salaireHoraireBrut < SMIC_HORAIRE_BRUT && (
                    <p className="text-xs text-red-600 mt-1">⚠️ Inférieur au SMIC !</p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salaire horaire NET (€)
                    <Tooltip text="Ce que vous recevez vraiment. Modifiez ce champ et le BRUT se calcule automatiquement." example="11,35€ net ≈ ce que vous touchez" />
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      value={contrat.salaireHoraireNet}
                      onChange={(e) => updateSalaireNet(Number(e.target.value))}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 ${
                        contrat.salaireHoraireNet < SMIC_HORAIRE_NET ? 'border-red-300 bg-red-50' : 'border-gray-300'
                      }`}
                      min={SMIC_HORAIRE_NET}
                    />
                    {modeCalcul === 'net' && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-teal-600">✏️</span>
                    )}
                  </div>
                  {contrat.salaireHoraireNet < SMIC_HORAIRE_NET && (
                    <p className="text-xs text-red-600 mt-1">⚠️ Inférieur au SMIC !</p>
                  )}
                </div>
              </div>

              <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 text-sm text-teal-800 mb-4">
                <strong>💡 Info :</strong> Le salaire inclut +10% pour les congés payés. Les heures sup (au-delà de 40h/semaine) sont majorées de 25%.
                <br />
                <span className="text-xs text-teal-600">Calcul automatique basé sur ~22% de charges salariales.</span>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Heures supplémentaires :
                  <Tooltip text="Comment sont payées les heures au-delà de 40h/semaine" />
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="heuresSup"
                      checked={contrat.heuresSupRecup === 'remunere'}
                      onChange={() => setContrat(prev => ({ ...prev, heuresSupRecup: 'remunere' }))}
                    />
                    <span>Payées (+25%)</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="heuresSup"
                      checked={contrat.heuresSupRecup === 'recupere'}
                      onChange={() => setContrat(prev => ({ ...prev, heuresSupRecup: 'recupere' }))}
                    />
                    <span>Récupérées en repos</span>
                  </label>
                </div>
              </div>

              {Object.values(contrat.presenceNuit).some(n => n?.actif) && (
                <div className="mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
                  <p className="font-medium text-indigo-800 mb-3">Indemnités de nuit :</p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">
                        Moins de 2 interventions/nuit (€)
                        <Tooltip text="Montant si vous êtes appelé 0 ou 1 fois dans la nuit" />
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={contrat.indemnitesNuit1}
                        onChange={(e) => setContrat(prev => ({ ...prev, indemnitesNuit1: Number(e.target.value) }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">
                        2-3 interventions/nuit (€)
                        <Tooltip text="Montant si vous êtes appelé 2 ou 3 fois dans la nuit" />
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={contrat.indemnitesNuit2}
                        onChange={(e) => setContrat(prev => ({ ...prev, indemnitesNuit2: Number(e.target.value) }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="font-medium text-gray-700 mb-3">
                  Avantages en nature (optionnel) :
                  <Tooltip text="Si l'employeur vous offre des repas ou un logement, ça se déduit du salaire" />
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Repas (€/jour)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={contrat.repas}
                      onChange={(e) => setContrat(prev => ({ ...prev, repas: Number(e.target.value) }))}
                      placeholder="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Logement (€/mois)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={contrat.logement}
                      onChange={(e) => setContrat(prev => ({ ...prev, logement: Number(e.target.value) }))}
                      placeholder="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="font-medium text-gray-700 mb-3">
                  Transport :
                  <Tooltip text="L'employeur doit rembourser 50% de vos transports en commun (métro, bus...)" />
                </p>
                <div className="mb-4">
                  <label className="block text-sm text-gray-700 mb-1">
                    Remboursement transport en commun (%)
                  </label>
                  <input
                    type="number"
                    value={contrat.transportPourcent}
                    onChange={(e) => setContrat(prev => ({ ...prev, transportPourcent: Number(e.target.value) }))}
                    min={50}
                    max={100}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <label className="flex items-center gap-3 mb-4">
                  <input
                    type="checkbox"
                    checked={contrat.conduite}
                    onChange={(e) => setContrat(prev => ({ ...prev, conduite: e.target.checked }))}
                    className="w-5 h-5 rounded text-teal-600"
                  />
                  <span className="text-sm text-gray-700">
                    Je conduis un véhicule pour le travail
                    <Tooltip text="Si vous conduisez la voiture de l'employeur ou la vôtre pour les courses, RDV médicaux..." />
                  </span>
                </label>

                {contrat.conduite && (
                  <div className="pl-4 border-l-4 border-teal-200">
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">
                          Prime forfaitaire conduite (€/mois)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={contrat.primeForfaitaire}
                          onChange={(e) => setContrat(prev => ({ ...prev, primeForfaitaire: Number(e.target.value) }))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">
                          Indemnité kilométrique (€/km)
                          <Tooltip text="Si vous utilisez VOTRE voiture. Minimum légal : 0,52€/km" />
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={contrat.indemniteKm}
                          onChange={(e) => setContrat(prev => ({ ...prev, indemniteKm: Number(e.target.value) }))}
                          min={0.52}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
                      <strong>⚠️ Rappel :</strong> L'employeur doit vérifier que vous avez le permis de conduire et une assurance valide si vous utilisez votre véhicule.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ÉTAPE 6 : Congés et signature */}
        {etape === 6 && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-teal-700 mb-4 flex items-center gap-2">
                🏖️ Congés payés
                <Tooltip text="Vos vacances payées" />
              </h3>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Délai de prévenance pour poser les congés (mois)
                  <Tooltip text="Combien de temps à l'avance l'employeur doit vous dire quand prendre vos congés. Minimum 2 mois." />
                </label>
                <input
                  type="number"
                  value={contrat.delaiConges}
                  onChange={(e) => setContrat(prev => ({ ...prev, delaiConges: Number(e.target.value) }))}
                  min={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-800">
                <strong>✅ Rappel :</strong> Vous gagnez 2,5 jours de congés par mois travaillé = 30 jours (5 semaines) par an.
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-teal-700 mb-4 flex items-center gap-2">
                📋 Conditions particulières
                <Tooltip text="Tout ce qui est spécial dans votre travail" />
              </h3>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes et conditions spéciales
                </label>
                <textarea
                  value={contrat.conditionsParticulieres}
                  onChange={(e) => setContrat(prev => ({ ...prev, conditionsParticulieres: e.target.value }))}
                  placeholder="Exemples :
- Mesures de sécurité : code alarme, clés...
- Absences prévues de l'employeur (vacances, hospitalisation...)
- Permis de conduire requis
- Animaux de compagnie
- Autres remarques..."
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Rappels légaux avant signature */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-amber-800 mb-4">⚠️ Rappels importants pour l'employeur</h3>
              <ul className="space-y-3 text-sm text-amber-900">
                <li className="flex items-start gap-2">
                  <span>🔒</span>
                  <span><strong>Confidentialité :</strong> Les deux parties doivent garder confidentielles les informations personnelles échangées.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>🛡️</span>
                  <span><strong>Assurance RC :</strong> En plus de votre assurance habitation, vous pouvez prendre une assurance responsabilité civile professionnelle pour vous protéger des dommages causés par votre salarié.</span>
                </li>
                {contrat.conduite && (
                  <li className="flex items-start gap-2">
                    <span>🚗</span>
                    <span><strong>Conduite :</strong> Vérifiez que votre salarié a le permis de conduire et une assurance valide s'il utilise son véhicule.</span>
                  </li>
                )}
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-teal-700 mb-4 flex items-center gap-2">
                ✍️ Signature du contrat
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                <Champ
                  label="Fait à (ville)"
                  value={contrat.lieuSignature}
                  onChange={(v) => setContrat(prev => ({ ...prev, lieuSignature: v }))}
                  tooltip="La ville où vous signez le contrat"
                  example="Paris"
                  placeholder="Paris"
                />
                <Champ
                  label="Le (date)"
                  value={contrat.dateSignature}
                  onChange={(v) => setContrat(prev => ({ ...prev, dateSignature: v }))}
                  tooltip="La date de signature"
                  type="date"
                />
              </div>

              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                <strong>📝 À faire :</strong> Le contrat sera généré en PDF. Imprimez-le en <strong>2 exemplaires</strong> et signez chacun avec la mention manuscrite <strong>"Lu et approuvé"</strong>.
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={prevEtape}
            disabled={etape === 1}
            className={`px-6 py-3 rounded-xl font-medium transition ${
              etape === 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-white text-teal-600 border-2 border-teal-600 hover:bg-teal-50'
            }`}
          >
            ← Précédent
          </button>

          {etape < totalEtapes ? (
            <button
              onClick={nextEtape}
              className="px-6 py-3 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 transition"
            >
              Suivant →
            </button>
          ) : (
            <button
              onClick={genererPDF}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold hover:from-green-600 hover:to-green-700 transition shadow-lg"
            >
              📥 Générer le contrat PDF
            </button>
          )}
        </div>
      </main>
    </div>
  )
}