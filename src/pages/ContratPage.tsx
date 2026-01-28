import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useProfil } from '../store/useProfil'
import TooltipBilingue from '../components/TooltipBilingue'
import { getTooltip, t } from '../utils/traductions'
import type { Langue } from '../utils/traductions'
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

// Composant Champ avec infobulle bilingue
function ChampBilingue({
  label,
  labelAr,
  value,
  onChange,
  tooltipKey,
  langue,
  placeholder,
  type = 'text',
}: {
  label: string
  labelAr?: string
  value: string
  onChange: (v: string) => void
  tooltipKey?: string
  langue: Langue
  placeholder?: string
  type?: string
}) {
  const tooltip = tooltipKey ? getTooltip(tooltipKey, langue) : null
  const displayLabel = langue === 'ar' && labelAr ? labelAr : label

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {displayLabel}
        {tooltip && <TooltipBilingue text={tooltip.text} example={tooltip.example} />}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 focus:outline-none transition"
      />
    </div>
  )
}

export default function ContratPage() {
  const { profil } = useProfil()
  const [etape, setEtape] = useState(1)
  const [langue, setLangue] = useState<Langue>('fr')
  const totalEtapes = 6

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
    salaireHoraireBrut: 14.50,
    salaireHoraireNet: 11.35,
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

  // Pré-remplir avec les données du profil
  useEffect(() => {
    if (profil) {
      setContrat(prev => ({
        ...prev,
        salarie: {
          ...prev.salarie,
          nomNaissance: profil.nom || '',
          prenom: profil.prenom || '',
          adresse: profil.adresse || '',
          ville: profil.ville || '',
          codePostal: profil.codePostal || '',
          telephone: profil.telephone || '',
          email: profil.email || '',
          numeroSecu: profil.numeroSecu || '',
        }
      }))
    }
  }, [profil])

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

  // Navigation entre étapes
  const nextEtape = () => setEtape(e => Math.min(e + 1, totalEtapes))
  const prevEtape = () => setEtape(e => Math.max(e - 1, 1))

  // Génération PDF complète
  const genererPDF = () => {
    const doc = new jsPDF()
    
    // Titre
    doc.setFontSize(18)
    doc.text('CONTRAT DE TRAVAIL À DURÉE INDÉTERMINÉE', 105, 20, { align: 'center' })
    doc.setFontSize(12)
    doc.text('CESU - Convention collective des particuliers employeurs', 105, 28, { align: 'center' })
    
    doc.setDrawColor(13, 148, 136)
    doc.line(20, 33, 190, 33)

    let y = 45

    // Employeur
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

    // Salarié
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

    // Convention collective
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

    // Date d'effet
    doc.setFont('helvetica', 'bold')
    doc.text('2. DATE D\'EFFET', 20, y)
    y += 6
    doc.setFont('helvetica', 'normal')
    doc.text(`Date d'embauche : ${contrat.dateEmbauche}`, 25, y)
    y += 6
    doc.text(`Période d'essai : ${contrat.periodeEssai || 'Aucune'}`, 25, y)

    y += 10

    // Lieu de travail
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

    // Nature de l'emploi
    doc.setFont('helvetica', 'bold')
    doc.text('4. NATURE DE L\'EMPLOI', 20, y)
    y += 6
    doc.setFont('helvetica', 'normal')
    doc.text(`Poste : ${contrat.emploi}`, 25, y)
    y += 6
    doc.text(`Classification : ${contrat.classification}`, 25, y)
    if (contrat.activitesComplementaires) {
      y += 6
      doc.text(`Activités complémentaires : ${contrat.activitesComplementaires}`, 25, y)
    }

    y += 10

    // Durée du travail
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

    // Rémunération
    doc.setFont('helvetica', 'bold')
    doc.text('6. RÉMUNÉRATION', 20, y)
    y += 6
    doc.setFont('helvetica', 'normal')
    doc.text(`Salaire horaire brut : ${contrat.salaireHoraireBrut.toFixed(2)}€`, 25, y)
    y += 6
    doc.text(`Salaire horaire net : ${contrat.salaireHoraireNet.toFixed(2)}€`, 25, y)
    y += 6
    doc.text('(inclut +10% de congés payés)', 25, y)

    // Page 2
    doc.addPage()
    y = 20

    // Repos hebdomadaire
    doc.setFont('helvetica', 'bold')
    doc.text('7. REPOS HEBDOMADAIRE', 20, y)
    y += 6
    doc.setFont('helvetica', 'normal')
    doc.text(`Jour de repos : ${contrat.reposHebdo}`, 25, y)
    y += 6
    doc.text('Repos quotidien : 11 heures consécutives minimum', 25, y)

    y += 10

    // Congés payés
    doc.setFont('helvetica', 'bold')
    doc.text('8. CONGÉS PAYÉS', 20, y)
    y += 6
    doc.setFont('helvetica', 'normal')
    doc.text(`Délai de prévenance : ${contrat.delaiConges} mois minimum`, 25, y)
    y += 6
    doc.text('Acquisition : 2,5 jours ouvrables par mois travaillé (30 jours/an)', 25, y)

    y += 10

    // Conditions particulières
    if (contrat.conditionsParticulieres) {
      doc.setFont('helvetica', 'bold')
      doc.text('9. CONDITIONS PARTICULIÈRES', 20, y)
      y += 6
      doc.setFont('helvetica', 'normal')
      const lignes = doc.splitTextToSize(contrat.conditionsParticulieres, 160)
      doc.text(lignes, 25, y)
      y += lignes.length * 5 + 5
    }

    // Mentions légales
    y = Math.max(y + 20, 180)
    doc.setFontSize(9)
    doc.text('Le salarié déclare avoir reçu un exemplaire de ce contrat et en accepter les termes.', 20, y)
    y += 5
    doc.text('Il déclare également avoir été informé de l\'identité de la caisse de retraite complémentaire (IRCEM).', 20, y)

    // Signature
    y += 20
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text(`Fait à ${contrat.lieuSignature}, le ${contrat.dateSignature}`, 20, y)
    y += 8
    doc.text('En deux exemplaires originaux', 20, y)

    y += 15
    doc.setFont('helvetica', 'normal')
    doc.text('Le particulier employeur', 40, y)
    doc.text('Le salarié', 140, y)
    y += 5
    doc.text('(signature précédée de', 40, y)
    doc.text('(signature précédée de', 140, y)
    y += 5
    doc.text('"Lu et approuvé")', 40, y)
    doc.text('"Lu et approuvé")', 140, y)

    // Espace pour signatures
    y += 25
    doc.setDrawColor(200, 200, 200)
    doc.rect(25, y, 60, 30)
    doc.rect(125, y, 60, 30)

    // Sauvegarde
    doc.save(`contrat-cesu-${contrat.salarie.nomNaissance || 'salarie'}.pdf`)
  }

  // Labels des étapes
  const etapesTitres = [
    { fr: 'Identités', ar: 'الهويات' },
    { fr: 'Lieu & Date', ar: 'المكان والتاريخ' },
    { fr: 'Emploi', ar: 'الخدمة' },
    { fr: 'Horaires', ar: 'الأوقات' },
    { fr: 'Salaire', ar: 'الصالير' },
    { fr: 'Signature', ar: 'التوقيع' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 via-white to-teal-50">
      {/* Header sticky */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/documents" className="text-teal-600 hover:text-teal-700 font-medium">
              ← {t('retour', langue)}
            </Link>
            
            {/* Switch de langue */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
              <button
                onClick={() => setLangue('fr')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                  langue === 'fr'
                    ? 'bg-white text-teal-700 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                🇫🇷 FR
              </button>
              <button
                onClick={() => setLangue('ar')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                  langue === 'ar'
                    ? 'bg-white text-teal-700 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                🇲🇦 عربي
              </button>
            </div>
          </div>
          
          <h1 className="text-center text-lg font-bold text-gray-900 mt-2">
            📋 {langue === 'fr' ? 'Contrat CESU' : 'كونترا CESU'}
          </h1>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 pb-32">
        {/* Barre de progression */}
        <div className="mb-6">
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
                  {index + 1 < etape ? '✓' : index + 1}
                </div>
                <span className={`text-xs mt-1 ${index + 1 === etape ? 'text-teal-700 font-medium' : 'text-gray-400'}`}>
                  {langue === 'ar' ? titre.ar : titre.fr}
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

        {/* Indicateur de langue */}
        {langue === 'ar' && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800 text-center">
            💡 {langue === 'ar' 
              ? 'الأسئلة بالدارجة باش تفهم مزيان' 
              : 'Les infobulles sont en arabe dialectal pour mieux comprendre'}
          </div>
        )}

        {/* ÉTAPE 1 : Employeur & Salarié */}
        {etape === 1 && (
          <div className="space-y-6">
            {/* Employeur */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-teal-700 mb-4 flex items-center gap-2">
                {t('employeurTitre', langue)}
                <TooltipBilingue {...getTooltip('employeur', langue)} />
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                <ChampBilingue
                  label="Nom de naissance"
                  labelAr="السمية ديال الولادة"
                  value={contrat.employeur.nomNaissance}
                  onChange={(v) => updateEmployeur('nomNaissance', v)}
                  tooltipKey="nomNaissance"
                  langue={langue}
                  placeholder="MARTIN"
                />
                <ChampBilingue
                  label="Nom d'usage"
                  labelAr="السمية المستعملة"
                  value={contrat.employeur.nomUsage}
                  onChange={(v) => updateEmployeur('nomUsage', v)}
                  tooltipKey="nomUsage"
                  langue={langue}
                  placeholder="Optionnel"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <ChampBilingue
                  label="Prénom"
                  labelAr="الاسم"
                  value={contrat.employeur.prenom}
                  onChange={(v) => updateEmployeur('prenom', v)}
                  tooltipKey="prenom"
                  langue={langue}
                  placeholder="Marie"
                />
                <ChampBilingue
                  label="N° CESU"
                  labelAr="رقم CESU"
                  value={contrat.employeur.numeroCesu}
                  onChange={(v) => updateEmployeur('numeroCesu', v)}
                  tooltipKey="numeroCesu"
                  langue={langue}
                  placeholder="1234567890123"
                />
              </div>

              <ChampBilingue
                label="Adresse"
                labelAr="العنوان"
                value={contrat.employeur.adresse}
                onChange={(v) => updateEmployeur('adresse', v)}
                tooltipKey="adresse"
                langue={langue}
                placeholder="12 rue des Lilas"
              />

              <div className="grid grid-cols-2 gap-3">
                <ChampBilingue
                  label="Ville"
                  labelAr="المدينة"
                  value={contrat.employeur.ville}
                  onChange={(v) => updateEmployeur('ville', v)}
                  tooltipKey="ville"
                  langue={langue}
                  placeholder="Paris"
                />
                <ChampBilingue
                  label="Code postal"
                  labelAr="الكود بوسطال"
                  value={contrat.employeur.codePostal}
                  onChange={(v) => updateEmployeur('codePostal', v)}
                  tooltipKey="codePostal"
                  langue={langue}
                  placeholder="75012"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <ChampBilingue
                  label="Téléphone"
                  labelAr="التيليفون"
                  value={contrat.employeur.telephone}
                  onChange={(v) => updateEmployeur('telephone', v)}
                  tooltipKey="telephone"
                  langue={langue}
                  placeholder="06 12 34 56 78"
                />
                <ChampBilingue
                  label="Email"
                  labelAr="الإيميل"
                  value={contrat.employeur.email}
                  onChange={(v) => updateEmployeur('email', v)}
                  tooltipKey="email"
                  langue={langue}
                  placeholder="email@exemple.fr"
                  type="email"
                />
              </div>
            </div>

            {/* Salarié */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-teal-700 mb-4 flex items-center gap-2">
                {t('salarieTitre', langue)}
                <TooltipBilingue {...getTooltip('salarie', langue)} />
              </h3>

              {/* Info pré-remplissage */}
              {profil.prenom && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-sm text-green-800">
                  ✅ {langue === 'fr' 
                    ? 'Pré-rempli avec les infos de ton profil !' 
                    : 'معمّر من البروفيل ديالك!'}
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-3">
                <ChampBilingue
                  label="Nom de naissance"
                  labelAr="السمية ديال الولادة"
                  value={contrat.salarie.nomNaissance}
                  onChange={(v) => updateSalarie('nomNaissance', v)}
                  tooltipKey="nomNaissance"
                  langue={langue}
                  placeholder="BENALI"
                />
                <ChampBilingue
                  label="Nom d'usage"
                  labelAr="السمية المستعملة"
                  value={contrat.salarie.nomUsage}
                  onChange={(v) => updateSalarie('nomUsage', v)}
                  tooltipKey="nomUsage"
                  langue={langue}
                  placeholder="Optionnel"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <ChampBilingue
                  label="Prénom"
                  labelAr="الاسم"
                  value={contrat.salarie.prenom}
                  onChange={(v) => updateSalarie('prenom', v)}
                  tooltipKey="prenom"
                  langue={langue}
                  placeholder="Fatima"
                />
                <ChampBilingue
                  label="N° Sécurité sociale"
                  labelAr="رقم الضمان الاجتماعي"
                  value={contrat.salarie.numeroSecu}
                  onChange={(v) => updateSalarie('numeroSecu', v)}
                  tooltipKey="numeroSecu"
                  langue={langue}
                  placeholder="2 85 12 75 108 234 56"
                />
              </div>

              <ChampBilingue
                label="Adresse"
                labelAr="العنوان"
                value={contrat.salarie.adresse}
                onChange={(v) => updateSalarie('adresse', v)}
                tooltipKey="adresse"
                langue={langue}
                placeholder="25 avenue de la République"
              />

              <div className="grid grid-cols-2 gap-3">
                <ChampBilingue
                  label="Ville"
                  labelAr="المدينة"
                  value={contrat.salarie.ville}
                  onChange={(v) => updateSalarie('ville', v)}
                  tooltipKey="ville"
                  langue={langue}
                  placeholder="Lyon"
                />
                <ChampBilingue
                  label="Code postal"
                  labelAr="الكود بوسطال"
                  value={contrat.salarie.codePostal}
                  onChange={(v) => updateSalarie('codePostal', v)}
                  tooltipKey="codePostal"
                  langue={langue}
                  placeholder="69003"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <ChampBilingue
                  label="Téléphone"
                  labelAr="التيليفون"
                  value={contrat.salarie.telephone}
                  onChange={(v) => updateSalarie('telephone', v)}
                  tooltipKey="telephone"
                  langue={langue}
                  placeholder="07 98 76 54 32"
                />
                <ChampBilingue
                  label="Email"
                  labelAr="الإيميل"
                  value={contrat.salarie.email}
                  onChange={(v) => updateSalarie('email', v)}
                  tooltipKey="email"
                  langue={langue}
                  placeholder="email@exemple.fr"
                  type="email"
                />
              </div>
            </div>
          </div>
        )}

        {/* ÉTAPE 2 : Date et lieu */}
        {etape === 2 && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-teal-700 mb-4 flex items-center gap-2">
                {t('dateTitre', langue)}
                <TooltipBilingue {...getTooltip('dateEmbauche', langue)} />
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <ChampBilingue
                  label="Date d'embauche"
                  labelAr="تاريخ التشغيل"
                  value={contrat.dateEmbauche}
                  onChange={(v) => setContrat(prev => ({ ...prev, dateEmbauche: v }))}
                  tooltipKey="dateEmbauche"
                  langue={langue}
                  type="date"
                />
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {langue === 'fr' ? 'Période d\'essai' : 'فترة التجربة'}
                    <TooltipBilingue {...getTooltip('periodeEssai', langue)} />
                  </label>
                  <select
                    value={contrat.periodeEssai}
                    onChange={(e) => setContrat(prev => ({ ...prev, periodeEssai: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none bg-white"
                  >
                    <option value="">{langue === 'fr' ? 'Pas de période' : 'بلا فترة'}</option>
                    <option value="1 semaine">{langue === 'fr' ? '1 semaine' : 'سيمانة'}</option>
                    <option value="2 semaines">{langue === 'fr' ? '2 semaines' : 'سيمانتين'}</option>
                    <option value="1 mois">{langue === 'fr' ? '1 mois' : 'شهر'}</option>
                    <option value="2 mois">{langue === 'fr' ? '2 mois' : 'شهرين'}</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-800">
                <strong>{t('bonASavoir', langue)} :</strong> {langue === 'fr' 
                  ? 'Ce contrat est un CDI (durée indéterminée).' 
                  : 'هاد الكونترا CDI (مدة غير محددة).'}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-teal-700 mb-4 flex items-center gap-2">
                {t('lieuTitre', langue)}
                <TooltipBilingue {...getTooltip('lieuTravail', langue)} />
              </h3>

              <p className="text-sm text-gray-600 mb-3">
                {langue === 'fr' ? 'Domicile principal de l\'employeur :' : 'الدار الرئيسية ديال المشغل:'}
              </p>
              
              <ChampBilingue
                label="Adresse"
                labelAr="العنوان"
                value={contrat.lieuPrincipal.adresse}
                onChange={(v) => updateLieuPrincipal('adresse', v)}
                langue={langue}
                placeholder="12 rue des Lilas"
              />

              <div className="grid grid-cols-2 gap-3">
                <ChampBilingue
                  label="Ville"
                  labelAr="المدينة"
                  value={contrat.lieuPrincipal.ville}
                  onChange={(v) => updateLieuPrincipal('ville', v)}
                  langue={langue}
                  placeholder="Paris"
                />
                <ChampBilingue
                  label="Code postal"
                  labelAr="الكود بوسطال"
                  value={contrat.lieuPrincipal.codePostal}
                  onChange={(v) => updateLieuPrincipal('codePostal', v)}
                  langue={langue}
                  placeholder="75012"
                />
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={contrat.aResidenceSecondaire}
                    onChange={(e) => setContrat(prev => ({ ...prev, aResidenceSecondaire: e.target.checked }))}
                    className="w-5 h-5 rounded text-teal-600"
                  />
                  <span className="text-sm text-gray-700">
                    {langue === 'fr' ? 'L\'employeur a une résidence secondaire' : 'المشغل عندو دار ثانية'}
                    <TooltipBilingue {...getTooltip('residenceSecondaire', langue)} />
                  </span>
                </label>

                {contrat.aResidenceSecondaire && (
                  <div className="mt-4 pl-4 border-l-4 border-teal-200">
                    <ChampBilingue
                      label="Adresse"
                      labelAr="العنوان"
                      value={contrat.lieuSecondaire.adresse}
                      onChange={(v) => updateLieuSecondaire('adresse', v)}
                      langue={langue}
                      placeholder="5 chemin de la Mer"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <ChampBilingue
                        label="Ville"
                        labelAr="المدينة"
                        value={contrat.lieuSecondaire.ville}
                        onChange={(v) => updateLieuSecondaire('ville', v)}
                        langue={langue}
                        placeholder="La Baule"
                      />
                      <ChampBilingue
                        label="Code postal"
                        labelAr="الكود بوسطال"
                        value={contrat.lieuSecondaire.codePostal}
                        onChange={(v) => updateLieuSecondaire('codePostal', v)}
                        langue={langue}
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
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-teal-700 mb-4 flex items-center gap-2">
                {t('emploiTitre', langue)}
                <TooltipBilingue {...getTooltip('emploi', langue)} />
              </h3>

              <ChampBilingue
                label="Intitulé du poste"
                labelAr="اسم الخدمة"
                value={contrat.emploi}
                onChange={(v) => setContrat(prev => ({ ...prev, emploi: v }))}
                tooltipKey="emploi"
                langue={langue}
                placeholder="Assistant(e) de vie"
              />

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {langue === 'fr' ? 'Classification' : 'المستوى'}
                  <TooltipBilingue {...getTooltip('classification', langue)} />
                </label>
                <select
                  value={contrat.classification}
                  onChange={(e) => setContrat(prev => ({ ...prev, classification: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none bg-white"
                >
                  <option value="">{langue === 'fr' ? 'Choisir...' : 'ختار...'}</option>
                  <option value="Niveau 1">Niveau 1 - {langue === 'fr' ? 'Employé familial' : 'خدام عائلي'}</option>
                  <option value="Niveau 2">Niveau 2 - {langue === 'fr' ? 'Garde d\'enfants' : 'حارس/ة الدراري'}</option>
                  <option value="Niveau 3">Niveau 3 - {langue === 'fr' ? 'Assistant de vie A' : 'مساعد/ة A'}</option>
                  <option value="Niveau 4">Niveau 4 - {langue === 'fr' ? 'Assistant de vie B' : 'مساعد/ة B'}</option>
                  <option value="Niveau 5">Niveau 5 - {langue === 'fr' ? 'Assistant de vie C' : 'مساعد/ة C'}</option>
                </select>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
                <strong>{t('astuce', langue)} :</strong> {langue === 'fr' 
                  ? 'Utilisez le simulateur officiel pour trouver votre niveau.' 
                  : 'استعمل الموقع الرسمي باش تلقى المستوى ديالك.'}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {langue === 'fr' ? 'Activités complémentaires' : 'الأنشطة الزايدة'}
                  <TooltipBilingue {...getTooltip('activitesComplementaires', langue)} />
                </label>
                <textarea
                  value={contrat.activitesComplementaires}
                  onChange={(e) => setContrat(prev => ({ ...prev, activitesComplementaires: e.target.value }))}
                  placeholder={langue === 'fr' 
                    ? 'Courses, repas, accompagnement RDV...' 
                    : 'التسوق، الماكلة، المرافقة...'}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ÉTAPE 4 : Horaires - Simplifiée */}
        {etape === 4 && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-teal-700 mb-4 flex items-center gap-2">
                {t('horairesTitre', langue)}
                <TooltipBilingue {...getTooltip('typeDuree', langue)} />
              </h3>

              <div className="space-y-3 mb-4">
                {[
                  { value: 'cas1', fr: 'Horaires fixes', ar: 'أوقات ثابتة' },
                  { value: 'cas2', fr: 'Heures fixes, jours variables', ar: 'ساعات ثابتة، أيام متغيرة' },
                  { value: 'cas3', fr: 'Durée irrégulière', ar: 'مدة غير منتظمة' },
                ].map(option => (
                  <label
                    key={option.value}
                    className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition ${
                      contrat.typeDuree === option.value
                        ? 'border-teal-500 bg-teal-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <input
                      type="radio"
                      checked={contrat.typeDuree === option.value}
                      onChange={() => setContrat(prev => ({ ...prev, typeDuree: option.value as 'cas1' | 'cas2' | 'cas3' }))}
                      className="w-5 h-5 text-teal-600"
                    />
                    <span className="font-medium">
                      {langue === 'ar' ? option.ar : option.fr}
                    </span>
                  </label>
                ))}
              </div>

              {(contrat.typeDuree === 'cas1' || contrat.typeDuree === 'cas2') && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {langue === 'fr' ? 'Heures par semaine' : 'ساعات فالسيمانة'}
                    <TooltipBilingue {...getTooltip('heuresHebdo', langue)} />
                  </label>
                  <input
                    type="number"
                    value={contrat.heuresHebdo}
                    onChange={(e) => setContrat(prev => ({ ...prev, heuresHebdo: Number(e.target.value) }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                    min={1}
                    max={48}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* ÉTAPE 5 : Salaire */}
        {etape === 5 && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-teal-700 mb-4 flex items-center gap-2">
                {t('remunerationTitre', langue)}
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {langue === 'fr' ? 'Salaire horaire BRUT (€)' : 'الصالير بالساعة خام (€)'}
                    <TooltipBilingue {...getTooltip('salaireHoraireBrut', langue)} />
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={contrat.salaireHoraireBrut}
                    onChange={(e) => setContrat(prev => ({ ...prev, salaireHoraireBrut: Number(e.target.value) }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {langue === 'fr' ? 'Salaire horaire NET (€)' : 'الصالير بالساعة صافي (€)'}
                    <TooltipBilingue {...getTooltip('salaireHoraireNet', langue)} />
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={contrat.salaireHoraireNet}
                    onChange={(e) => setContrat(prev => ({ ...prev, salaireHoraireNet: Number(e.target.value) }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-sm text-teal-800">
                💡 {langue === 'fr' 
                  ? 'Le salaire inclut +10% pour les congés payés.' 
                  : 'الصالير فيه +10% ديال العطلة المخلوصة.'}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {langue === 'fr' ? 'Jour de repos' : 'نهار الراحة'}
                  <TooltipBilingue {...getTooltip('reposHebdo', langue)} />
                </label>
                <select
                  value={contrat.reposHebdo}
                  onChange={(e) => setContrat(prev => ({ ...prev, reposHebdo: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white"
                >
                  {JOURS.map(jour => (
                    <option key={jour} value={jour}>{jour}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* ÉTAPE 6 : Signature */}
        {etape === 6 && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-teal-700 mb-4 flex items-center gap-2">
                {t('signatureTitre', langue)}
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <ChampBilingue
                  label="Fait à (ville)"
                  labelAr="فين (المدينة)"
                  value={contrat.lieuSignature}
                  onChange={(v) => setContrat(prev => ({ ...prev, lieuSignature: v }))}
                  langue={langue}
                  placeholder="Paris"
                />
                <ChampBilingue
                  label="Le (date)"
                  labelAr="النهار"
                  value={contrat.dateSignature}
                  onChange={(v) => setContrat(prev => ({ ...prev, dateSignature: v }))}
                  langue={langue}
                  type="date"
                />
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
                <strong>{t('important', langue)} :</strong> {langue === 'fr' 
                  ? 'Imprimez en 2 exemplaires et signez avec "Lu et approuvé".' 
                  : 'طبعها 2 مرات ووقع مع "قريت وموافق".'}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer fixe avec navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40">
        <div className="max-w-lg mx-auto flex gap-3">
          <button
            onClick={prevEtape}
            disabled={etape === 1}
            className={`flex-1 py-3 rounded-xl font-medium transition ${
              etape === 1
                ? 'bg-gray-100 text-gray-400'
                : 'border-2 border-teal-600 text-teal-600'
            }`}
          >
            {t('precedent', langue)}
          </button>

          {etape < totalEtapes ? (
            <button
              onClick={nextEtape}
              className="flex-1 py-3 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 transition"
            >
              {t('suivant', langue)}
            </button>
          ) : (
            <button
              onClick={genererPDF}
              className="flex-1 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold hover:from-green-600 hover:to-green-700 transition shadow-lg"
            >
              {t('genererPDF', langue)}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}