import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Langue } from '../utils/traductions'
import jsPDF from 'jspdf'

// Constantes pour les calculs CESU (basé sur simulateur officiel)
// Pour un salaire net, les charges patronales représentent ~75% du net
const TAUX_CHARGES_SUR_NET = 0.754 // Charges patronales ≈ 75,4% du salaire net

interface DevisData {
  // Client
  clientNom: string
  clientPrenom: string
  clientAdresse: string
  clientVille: string
  clientCodePostal: string
  clientTelephone: string
  clientEmail: string
  
  // Prestation
  mode: 'simple' | 'detaille'
  heuresTotal: number
  tauxHoraireNet: number // Ce que l'auxiliaire veut toucher
  
  // Mode détaillé
  frequence: 'semaine' | 'mois' | 'ponctuel'
  joursParSemaine: number
  heuresParJour: number
  
  // Frais additionnels
  fraisKm: number
  kmEstimes: number
  fraisRepas: number
  autresFrais: number
  autresFraisDescription: string
  
  // Infos devis
  dateDevis: string
  validiteJours: number
  commentaires: string
}

// Calcul du coût employeur (ce que le client paie)
function calculerCoutEmployeur(tauxNet: number): number {
  // Coût employeur = Net + charges patronales (~75,4% du net)
  return tauxNet * (1 + TAUX_CHARGES_SUR_NET)
}

export default function DevisPage() {
  const [langue, setLangue] = useState<Langue>('fr')
  const [etape, setEtape] = useState(1)
  const totalEtapes = 4

  const [devis, setDevis] = useState<DevisData>({
    clientNom: '',
    clientPrenom: '',
    clientAdresse: '',
    clientVille: '',
    clientCodePostal: '',
    clientTelephone: '',
    clientEmail: '',
    
    mode: 'simple',
    heuresTotal: 20,
    tauxHoraireNet: 11.50,
    
    frequence: 'semaine',
    joursParSemaine: 5,
    heuresParJour: 4,
    
    fraisKm: 0.52,
    kmEstimes: 0,
    fraisRepas: 0,
    autresFrais: 0,
    autresFraisDescription: '',
    
    dateDevis: new Date().toISOString().split('T')[0],
    validiteJours: 30,
    commentaires: '',
  })

  // Calculs automatiques
  const coutEmployeur = calculerCoutEmployeur(devis.tauxHoraireNet)
  const chargesPatronales = devis.tauxHoraireNet * TAUX_CHARGES_SUR_NET
  
  const heuresCalculees = devis.mode === 'simple' 
    ? devis.heuresTotal 
    : devis.joursParSemaine * devis.heuresParJour * (devis.frequence === 'mois' ? 4 : 1)
  
  const totalPrestation = heuresCalculees * coutEmployeur
  const totalKm = devis.kmEstimes * devis.fraisKm
  const totalFrais = totalKm + devis.fraisRepas + devis.autresFrais
  const totalDevis = totalPrestation + totalFrais
  const totalApresCredit = totalDevis / 2 // Crédit d'impôt 50%

  // Navigation
  const nextEtape = () => setEtape(e => Math.min(e + 1, totalEtapes))
  const prevEtape = () => setEtape(e => Math.max(e - 1, 1))

  // Génération PDF
  const genererPDF = () => {
    const doc = new jsPDF()
    
    // En-tête
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text('DEVIS', 105, 20, { align: 'center' })
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('Services d\'aide à domicile - CESU', 105, 27, { align: 'center' })
    
    doc.setDrawColor(13, 148, 136)
    doc.setLineWidth(0.5)
    doc.line(20, 32, 190, 32)

    // Infos devis
    doc.setFontSize(9)
    doc.text(`Devis n° : ${Date.now().toString().slice(-8)}`, 150, 40)
    doc.text(`Date : ${devis.dateDevis}`, 150, 46)
    doc.text(`Validité : ${devis.validiteJours} jours`, 150, 52)

    // Client
    let y = 45
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('CLIENT', 20, y)
    y += 7
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.text(`${devis.clientPrenom} ${devis.clientNom}`, 20, y)
    y += 5
    doc.text(devis.clientAdresse, 20, y)
    y += 5
    doc.text(`${devis.clientCodePostal} ${devis.clientVille}`, 20, y)
    y += 5
    if (devis.clientTelephone) doc.text(`Tél : ${devis.clientTelephone}`, 20, y)

    // Tableau prestation
    y = 85
    doc.setFillColor(13, 148, 136)
    doc.rect(20, y, 170, 8, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.text('PRESTATION', 25, y + 5.5)
    doc.text('Qté', 110, y + 5.5)
    doc.text('Prix unit.', 135, y + 5.5)
    doc.text('Total', 170, y + 5.5)

    y += 8
    doc.setTextColor(0, 0, 0)
    doc.setFont('helvetica', 'normal')
    
    // Ligne prestation
    doc.setDrawColor(230, 230, 230)
    doc.rect(20, y, 170, 12)
    y += 4
    doc.text('Aide à domicile', 25, y + 4)
    doc.text(`${heuresCalculees}h`, 110, y + 4)
    doc.text(`${coutEmployeur.toFixed(2)}€/h`, 135, y + 4)
    doc.text(`${totalPrestation.toFixed(2)}€`, 170, y + 4)
    
    y += 12

    // Frais kilométriques si applicable
    if (devis.kmEstimes > 0) {
      doc.rect(20, y, 170, 10)
      doc.text('Frais kilométriques', 25, y + 6)
      doc.text(`${devis.kmEstimes} km`, 110, y + 6)
      doc.text(`${devis.fraisKm.toFixed(2)}€/km`, 135, y + 6)
      doc.text(`${totalKm.toFixed(2)}€`, 170, y + 6)
      y += 10
    }

    // Autres frais
    if (devis.fraisRepas > 0) {
      doc.rect(20, y, 170, 10)
      doc.text('Frais de repas', 25, y + 6)
      doc.text('', 110, y + 6)
      doc.text('', 135, y + 6)
      doc.text(`${devis.fraisRepas.toFixed(2)}€`, 170, y + 6)
      y += 10
    }

    if (devis.autresFrais > 0) {
      doc.rect(20, y, 170, 10)
      doc.text(devis.autresFraisDescription || 'Autres frais', 25, y + 6)
      doc.text('', 110, y + 6)
      doc.text('', 135, y + 6)
      doc.text(`${devis.autresFrais.toFixed(2)}€`, 170, y + 6)
      y += 10
    }

    // Total SANS avantage fiscal
    y += 5
    doc.setFillColor(230, 126, 34) // Orange
    doc.rect(90, y, 100, 12, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.text('SANS AVANTAGE FISCAL', 95, y + 8)
    doc.setFontSize(12)
    doc.text(`${totalDevis.toFixed(2)}€`, 175, y + 8)

    // Total AVEC crédit d'impôt
    y += 14
    doc.setFillColor(39, 174, 96) // Vert
    doc.rect(90, y, 100, 12, 'F')
    doc.setFontSize(10)
    doc.text('APRÈS CRÉDIT D\'IMPÔT 50%', 95, y + 8)
    doc.setFontSize(12)
    doc.text(`${(totalDevis / 2).toFixed(2)}€`, 175, y + 8)
    doc.setTextColor(0, 0, 0)

    // Encadré explicatif tarifs
    y += 25
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.text('DÉTAIL DE LA TARIFICATION', 20, y)
    y += 6
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    
    doc.setFillColor(250, 250, 250)
    doc.rect(20, y, 170, 22, 'F')
    doc.setDrawColor(200, 200, 200)
    doc.rect(20, y, 170, 22)
    
    y += 5
    doc.text(`• Salaire net à verser au salarié : ${devis.tauxHoraireNet.toFixed(2)}€/h (10% de congés payés inclus)`, 25, y)
    y += 5
    doc.text(`• Cotisations sociales prélevées à l'employeur : ${(devis.tauxHoraireNet * TAUX_CHARGES_SUR_NET).toFixed(2)}€/h`, 25, y)
    y += 5
    doc.text(`• Coût total employeur (charges incluses) : ${coutEmployeur.toFixed(2)}€/h`, 25, y)
    y += 5
    doc.text(`• Après crédit d'impôt 50% : ${(coutEmployeur / 2).toFixed(2)}€/h`, 25, y)

    // Commentaires
    if (devis.commentaires) {
      y += 15
      doc.setTextColor(0, 0, 0)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      doc.text('REMARQUES', 20, y)
      y += 5
      doc.setFont('helvetica', 'normal')
      const lignes = doc.splitTextToSize(devis.commentaires, 170)
      doc.text(lignes, 20, y)
    }

    // Pied de page avec mentions légales
    y = 245
    doc.setFontSize(7)
    doc.setTextColor(100, 100, 100)
    doc.setFont('helvetica', 'normal')
    
    const mentions = [
      `Ces montants sont communiqués à titre indicatif, au ${new Date().toLocaleDateString('fr-FR')}, 10% de congés payés inclus.`,
      'Coût réel de l\'emploi pour un particulier employeur (hors départements du Bas-Rhin, Haut-Rhin, Moselle et Outre-mer)',
      'après application de la déduction forfaitaire ou, le cas échéant, d\'une exonération.',
      'Ce montant ne tient pas compte du prélèvement à la source de l\'impôt sur le revenu.',
      'Le prélèvement à la source est sans incidence pour les montants dus par l\'employeur.',
      `Devis valable ${devis.validiteJours} jours. Crédit d'impôt : 50% des sommes versées (plafond annuel applicable).`
    ]
    
    mentions.forEach((ligne, i) => {
      doc.text(ligne, 105, y + (i * 4), { align: 'center' })
    })

    doc.save(`devis-${devis.clientNom || 'client'}-${devis.dateDevis}.pdf`)
  }

  // Labels des étapes
  const etapesTitres = [
    { fr: 'Client', ar: 'الزبون' },
    { fr: 'Prestation', ar: 'الخدمة' },
    { fr: 'Tarifs', ar: 'الأثمنة' },
    { fr: 'Résumé', ar: 'الملخص' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 via-white to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/documents" className="text-teal-600 hover:text-teal-700 font-medium">
              ← {langue === 'fr' ? 'Retour' : 'رجوع'}
            </Link>
            
            {/* Switch langue */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-full p-1">
              <button
                onClick={() => setLangue('fr')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                  langue === 'fr' ? 'bg-white text-teal-700 shadow-sm' : 'text-gray-500'
                }`}
              >
                🇫🇷 FR
              </button>
              <button
                onClick={() => setLangue('ar')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                  langue === 'ar' ? 'bg-white text-teal-700 shadow-sm' : 'text-gray-500'
                }`}
              >
                🇲🇦 عربي
              </button>
            </div>
          </div>
          
          <h1 className="text-center text-lg font-bold text-gray-900 mt-2">
            📝 {langue === 'fr' ? 'Générateur de devis' : 'صانع الديفي'}
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

        {/* ÉTAPE 1 : Client */}
        {etape === 1 && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-teal-700 mb-4">
                👤 {langue === 'fr' ? 'Informations du client' : 'معلومات الزبون'}
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {langue === 'fr' ? 'Nom' : 'السمية'}
                  </label>
                  <input
                    type="text"
                    value={devis.clientNom}
                    onChange={(e) => setDevis(prev => ({ ...prev, clientNom: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none"
                    placeholder="DUPONT"
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {langue === 'fr' ? 'Prénom' : 'الاسم'}
                  </label>
                  <input
                    type="text"
                    value={devis.clientPrenom}
                    onChange={(e) => setDevis(prev => ({ ...prev, clientPrenom: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none"
                    placeholder="Marie"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {langue === 'fr' ? 'Adresse' : 'العنوان'}
                </label>
                <input
                  type="text"
                  value={devis.clientAdresse}
                  onChange={(e) => setDevis(prev => ({ ...prev, clientAdresse: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none"
                  placeholder="12 rue des Lilas"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {langue === 'fr' ? 'Ville' : 'المدينة'}
                  </label>
                  <input
                    type="text"
                    value={devis.clientVille}
                    onChange={(e) => setDevis(prev => ({ ...prev, clientVille: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none"
                    placeholder="Paris"
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {langue === 'fr' ? 'Code postal' : 'الكود بوسطال'}
                  </label>
                  <input
                    type="text"
                    value={devis.clientCodePostal}
                    onChange={(e) => setDevis(prev => ({ ...prev, clientCodePostal: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none"
                    placeholder="75012"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {langue === 'fr' ? 'Téléphone' : 'التيليفون'}
                  </label>
                  <input
                    type="tel"
                    value={devis.clientTelephone}
                    onChange={(e) => setDevis(prev => ({ ...prev, clientTelephone: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none"
                    placeholder="06 12 34 56 78"
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={devis.clientEmail}
                    onChange={(e) => setDevis(prev => ({ ...prev, clientEmail: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none"
                    placeholder="email@exemple.fr"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ÉTAPE 2 : Prestation */}
        {etape === 2 && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-teal-700 mb-4">
                📋 {langue === 'fr' ? 'Type de devis' : 'نوع الديفي'}
              </h3>

              {/* Choix du mode */}
              <div className="space-y-3 mb-6">
                <label
                  className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition ${
                    devis.mode === 'simple' ? 'border-teal-500 bg-teal-50' : 'border-gray-200'
                  }`}
                >
                  <input
                    type="radio"
                    checked={devis.mode === 'simple'}
                    onChange={() => setDevis(prev => ({ ...prev, mode: 'simple' }))}
                    className="w-5 h-5 text-teal-600"
                  />
                  <div>
                    <p className="font-medium">
                      {langue === 'fr' ? '🎯 Mode simple' : '🎯 الطريقة البسيطة'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {langue === 'fr' 
                        ? 'Je rentre juste le nombre d\'heures total' 
                        : 'غير ندخل عدد الساعات'}
                    </p>
                  </div>
                </label>

                <label
                  className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition ${
                    devis.mode === 'detaille' ? 'border-teal-500 bg-teal-50' : 'border-gray-200'
                  }`}
                >
                  <input
                    type="radio"
                    checked={devis.mode === 'detaille'}
                    onChange={() => setDevis(prev => ({ ...prev, mode: 'detaille' }))}
                    className="w-5 h-5 text-teal-600"
                  />
                  <div>
                    <p className="font-medium">
                      {langue === 'fr' ? '📅 Mode détaillé' : '📅 الطريقة المفصلة'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {langue === 'fr' 
                        ? 'Je précise les jours et heures par jour' 
                        : 'نحدد الأيام والساعات'}
                    </p>
                  </div>
                </label>
              </div>

              {/* Mode simple */}
              {devis.mode === 'simple' && (
                <div className="p-4 bg-gray-50 rounded-xl">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {langue === 'fr' ? 'Nombre d\'heures total' : 'عدد الساعات الكلي'}
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setDevis(prev => ({ ...prev, heuresTotal: Math.max(1, prev.heuresTotal - 1) }))}
                      className="w-12 h-12 rounded-xl bg-gray-200 text-xl font-bold hover:bg-gray-300"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={devis.heuresTotal}
                      onChange={(e) => setDevis(prev => ({ ...prev, heuresTotal: Number(e.target.value) }))}
                      className="flex-1 text-center text-2xl font-bold py-3 border border-gray-200 rounded-xl"
                      min={1}
                    />
                    <button
                      onClick={() => setDevis(prev => ({ ...prev, heuresTotal: prev.heuresTotal + 1 }))}
                      className="w-12 h-12 rounded-xl bg-teal-500 text-white text-xl font-bold hover:bg-teal-600"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-center text-sm text-gray-500 mt-2">
                    {langue === 'fr' ? 'heures' : 'ساعة'}
                  </p>
                </div>
              )}

              {/* Mode détaillé */}
              {devis.mode === 'detaille' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {langue === 'fr' ? 'Fréquence' : 'التكرار'}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: 'semaine', fr: 'Par semaine', ar: 'فالسيمانة' },
                        { value: 'mois', fr: 'Par mois', ar: 'فالشهر' },
                        { value: 'ponctuel', fr: 'Ponctuel', ar: 'مرة وحدة' },
                      ].map(opt => (
                        <button
                          key={opt.value}
                          onClick={() => setDevis(prev => ({ ...prev, frequence: opt.value as 'semaine' | 'mois' | 'ponctuel' }))}
                          className={`py-2 px-3 rounded-xl text-sm font-medium transition ${
                            devis.frequence === opt.value
                              ? 'bg-teal-600 text-white'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {langue === 'ar' ? opt.ar : opt.fr}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {langue === 'fr' ? 'Jours / semaine' : 'أيام / سيمانة'}
                      </label>
                      <input
                        type="number"
                        value={devis.joursParSemaine}
                        onChange={(e) => setDevis(prev => ({ ...prev, joursParSemaine: Number(e.target.value) }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                        min={1}
                        max={7}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {langue === 'fr' ? 'Heures / jour' : 'ساعات / نهار'}
                      </label>
                      <input
                        type="number"
                        value={devis.heuresParJour}
                        onChange={(e) => setDevis(prev => ({ ...prev, heuresParJour: Number(e.target.value) }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                        min={1}
                        max={12}
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-teal-50 rounded-xl text-center">
                    <span className="text-sm text-teal-700">
                      {langue === 'fr' ? 'Total :' : 'المجموع:'}{' '}
                      <strong className="text-lg">{heuresCalculees}h</strong>
                      {devis.frequence === 'mois' && (langue === 'fr' ? ' / mois' : ' / شهر')}
                      {devis.frequence === 'semaine' && (langue === 'fr' ? ' / semaine' : ' / سيمانة')}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ÉTAPE 3 : Tarifs */}
        {etape === 3 && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-teal-700 mb-4">
                💰 {langue === 'fr' ? 'Votre tarification' : 'الأثمنة ديالك'}
              </h3>

              {/* Tarif horaire net */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {langue === 'fr' 
                    ? 'Combien voulez-vous toucher NET par heure ?' 
                    : 'شحال بغيتي تاخد صافي فالساعة؟'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.10"
                    value={devis.tauxHoraireNet}
                    onChange={(e) => setDevis(prev => ({ ...prev, tauxHoraireNet: Number(e.target.value) }))}
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-xl font-bold text-center"
                  />
                  <span className="text-xl font-bold text-gray-600">€/h</span>
                </div>
              </div>

              {/* Encadré explicatif */}
              <div className="p-4 bg-gradient-to-br from-blue-50 to-teal-50 rounded-xl border border-blue-200">
                <p className="text-sm font-medium text-blue-800 mb-3">
                  📊 {langue === 'fr' ? 'Calcul automatique (simulateur CESU) :' : 'الحساب الأوتوماتيكي:'}
                </p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center py-2 border-b border-blue-200">
                    <span className="text-gray-600">
                      {langue === 'fr' ? 'Salaire net à verser' : 'الصالير صافي'}
                      <span className="text-xs text-gray-400 block">(10% CP inclus)</span>
                    </span>
                    <span className="font-bold text-green-600">{devis.tauxHoraireNet.toFixed(2)}€/h</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 border-b border-blue-200">
                    <span className="text-gray-600">
                      {langue === 'fr' ? 'Cotisations sociales' : 'الاشتراكات'}
                    </span>
                    <span className="font-medium text-gray-700">+{chargesPatronales.toFixed(2)}€/h</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 bg-orange-50 -mx-2 px-2 rounded-lg">
                    <span className="text-orange-800 font-medium">
                      {langue === 'fr' ? 'Coût total employeur' : 'التكلفة الكلية'}
                    </span>
                    <span className="font-bold text-orange-700 text-lg">{coutEmployeur.toFixed(2)}€/h</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2 bg-green-50 -mx-2 px-2 rounded-lg mt-2">
                    <span className="text-green-800 font-medium">
                      {langue === 'fr' ? 'Après crédit d\'impôt 50%' : 'بعد الخصم 50%'}
                    </span>
                    <span className="font-bold text-green-700 text-lg">{(coutEmployeur / 2).toFixed(2)}€/h</span>
                  </div>
                </div>
              </div>

              {/* Frais additionnels */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-700 mb-3">
                  🚗 {langue === 'fr' ? 'Frais additionnels (optionnel)' : 'المصاريف الزايدة (اختياري)'}
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      {langue === 'fr' ? 'Km estimés' : 'الكيلومترات'}
                    </label>
                    <input
                      type="number"
                      value={devis.kmEstimes}
                      onChange={(e) => setDevis(prev => ({ ...prev, kmEstimes: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      {langue === 'fr' ? 'Indemnité/km' : 'التعويض/كم'}
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={devis.fraisKm}
                      onChange={(e) => setDevis(prev => ({ ...prev, fraisKm: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      {langue === 'fr' ? 'Frais repas (€)' : 'الماكلة (€)'}
                    </label>
                    <input
                      type="number"
                      value={devis.fraisRepas}
                      onChange={(e) => setDevis(prev => ({ ...prev, fraisRepas: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">
                      {langue === 'fr' ? 'Autres frais (€)' : 'مصاريف أخرى (€)'}
                    </label>
                    <input
                      type="number"
                      value={devis.autresFrais}
                      onChange={(e) => setDevis(prev => ({ ...prev, autresFrais: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ÉTAPE 4 : Résumé */}
        {etape === 4 && (
          <div className="space-y-6">
            {/* Récapitulatif */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-teal-700 mb-4">
                📋 {langue === 'fr' ? 'Récapitulatif du devis' : 'ملخص الديفي'}
              </h3>

              {/* Client */}
              <div className="mb-4 pb-4 border-b border-gray-200">
                <p className="text-sm text-gray-500 mb-1">{langue === 'fr' ? 'Client' : 'الزبون'}</p>
                <p className="font-medium">{devis.clientPrenom} {devis.clientNom}</p>
                <p className="text-sm text-gray-600">{devis.clientAdresse}</p>
                <p className="text-sm text-gray-600">{devis.clientCodePostal} {devis.clientVille}</p>
              </div>

              {/* Prestation */}
              <div className="mb-4 pb-4 border-b border-gray-200">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">{langue === 'fr' ? 'Heures' : 'الساعات'}</span>
                  <span className="font-medium">{heuresCalculees}h</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">{langue === 'fr' ? 'Votre NET/h' : 'صافي/ساعة'}</span>
                  <span className="font-medium text-green-600">{devis.tauxHoraireNet.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">{langue === 'fr' ? 'Coût client/h' : 'تكلفة الزبون/ساعة'}</span>
                  <span className="font-medium">{coutEmployeur.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{langue === 'fr' ? 'Sous-total prestation' : 'المجموع الفرعي'}</span>
                  <span className="font-bold">{totalPrestation.toFixed(2)}€</span>
                </div>
              </div>

              {/* Frais */}
              {totalFrais > 0 && (
                <div className="mb-4 pb-4 border-b border-gray-200">
                  {devis.kmEstimes > 0 && (
                    <div className="flex justify-between mb-1 text-sm">
                      <span className="text-gray-500">Frais km ({devis.kmEstimes} km)</span>
                      <span>{totalKm.toFixed(2)}€</span>
                    </div>
                  )}
                  {devis.fraisRepas > 0 && (
                    <div className="flex justify-between mb-1 text-sm">
                      <span className="text-gray-500">Frais repas</span>
                      <span>{devis.fraisRepas.toFixed(2)}€</span>
                    </div>
                  )}
                  {devis.autresFrais > 0 && (
                    <div className="flex justify-between mb-1 text-sm">
                      <span className="text-gray-500">Autres frais</span>
                      <span>{devis.autresFrais.toFixed(2)}€</span>
                    </div>
                  )}
                </div>
              )}

              {/* Total */}
              <div className="space-y-3">
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl text-white">
                  <span className="font-medium">
                    {langue === 'fr' ? 'Sans avantage fiscal' : 'بلا خصم ضريبي'}
                  </span>
                  <span className="text-2xl font-bold">{totalDevis.toFixed(2)}€</span>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-500 to-green-600 rounded-xl text-white">
                  <span className="font-medium">
                    {langue === 'fr' ? 'Après crédit d\'impôt 50%' : 'بعد الخصم 50%'}
                  </span>
                  <span className="text-2xl font-bold">{totalApresCredit.toFixed(2)}€</span>
                </div>
              </div>

              {/* Mentions légales */}
              <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-500 leading-relaxed">
                <p className="mb-2">
                  <strong>⚠️ Mentions :</strong> Ces montants sont communiqués à titre indicatif, au {new Date().toLocaleDateString('fr-FR')}, 10% de congés payés inclus.
                </p>
                <p className="mb-2">
                  Coût réel de l'emploi pour un particulier employeur (hors départements du Bas-Rhin, Haut-Rhin, Moselle et de l'Outre-mer) après application de la déduction forfaitaire.
                </p>
                <p>
                  Ce montant ne tient pas compte du prélèvement à la source de l'impôt sur le revenu. Le prélèvement à la source est sans incidence pour les montants dus par l'employeur.
                </p>
              </div>
            </div>

            {/* Options devis */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {langue === 'fr' ? 'Date du devis' : 'تاريخ الديفي'}
                  </label>
                  <input
                    type="date"
                    value={devis.dateDevis}
                    onChange={(e) => setDevis(prev => ({ ...prev, dateDevis: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {langue === 'fr' ? 'Validité (jours)' : 'الصلاحية (أيام)'}
                  </label>
                  <input
                    type="number"
                    value={devis.validiteJours}
                    onChange={(e) => setDevis(prev => ({ ...prev, validiteJours: Number(e.target.value) }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {langue === 'fr' ? 'Commentaires' : 'ملاحظات'}
                </label>
                <textarea
                  value={devis.commentaires}
                  onChange={(e) => setDevis(prev => ({ ...prev, commentaires: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl resize-none"
                  rows={3}
                  placeholder={langue === 'fr' ? 'Précisions, conditions...' : 'تفاصيل، شروط...'}
                />
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
            className={`flex-1 py-3 rounded-xl font-medium transition ${
              etape === 1 ? 'bg-gray-100 text-gray-400' : 'border-2 border-teal-600 text-teal-600'
            }`}
          >
            {langue === 'fr' ? '← Précédent' : '← السابق'}
          </button>

          {etape < totalEtapes ? (
            <button
              onClick={nextEtape}
              className="flex-1 py-3 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 transition"
            >
              {langue === 'fr' ? 'Suivant →' : 'التالي →'}
            </button>
          ) : (
            <button
              onClick={genererPDF}
              className="flex-1 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold hover:from-green-600 hover:to-green-700 transition shadow-lg"
            >
              📥 {langue === 'fr' ? 'Générer PDF' : 'صيفط PDF'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}