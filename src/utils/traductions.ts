// Traductions Français / Arabe dialectal (Darija)
// L'arabe dialectal est écrit en caractères arabes simplifiés + translittération

export type Langue = 'fr' | 'ar'

interface Traduction {
  fr: string
  ar: string
}

interface TraductionAvecExemple {
  text: Traduction
  example?: Traduction
}

export const TRADUCTIONS: Record<string, TraductionAvecExemple> = {
  // === ÉTAPE 1 : Employeur & Salarié ===
  employeur: {
    text: {
      fr: "C'est la personne (ou famille) qui vous emploie — celle chez qui vous travaillez.",
      ar: "هذا هو الشخص (أو العائلة) اللي كيخدمك — اللي كتخدم عندو."
    },
    example: {
      fr: "Mme Dupont qui vous a embauché",
      ar: "مثلا: مدام دوبون اللي خدماتك"
    }
  },
  
  nomNaissance: {
    text: {
      fr: "Le nom de famille à la naissance, écrit sur la carte d'identité",
      ar: "السمية ديال العائلة اللي كانت فالولادة، مكتوبة فالكارط"
    },
    example: {
      fr: "MARTIN",
      ar: "مثلا: مارتان"
    }
  },
  
  nomUsage: {
    text: {
      fr: "Si la personne a changé de nom (mariage), sinon laisser vide",
      ar: "إلا بدل السمية (بالزواج)، إلا لا خليها فارغة"
    },
    example: {
      fr: "DUPONT (après mariage)",
      ar: "مثلا: دوبون (من بعد الزواج)"
    }
  },
  
  prenom: {
    text: {
      fr: "Le prénom de la personne",
      ar: "الاسم الشخصي"
    }
  },
  
  numeroCesu: {
    text: {
      fr: "Numéro donné par l'URSSAF quand on s'inscrit au CESU. Il commence souvent par des chiffres.",
      ar: "الرقم اللي عطاتو URSSAF ملي تسجل فـ CESU. كيبدا بالأرقام."
    },
    example: {
      fr: "1234567890123",
      ar: "مثلا: 1234567890123"
    }
  },
  
  adresse: {
    text: {
      fr: "L'adresse complète avec numéro et nom de rue",
      ar: "العنوان كامل بالرقم واسم الزنقة"
    },
    example: {
      fr: "12 rue des Lilas",
      ar: "مثلا: 12 زنقة الليلا"
    }
  },
  
  ville: {
    text: {
      fr: "Le nom de la ville",
      ar: "اسم المدينة"
    }
  },
  
  codePostal: {
    text: {
      fr: "Les 5 chiffres du code postal",
      ar: "5 أرقام ديال الكود بوسطال"
    },
    example: {
      fr: "75012",
      ar: "مثلا: 75012"
    }
  },
  
  telephone: {
    text: {
      fr: "Le numéro de téléphone",
      ar: "رقم التيليفون"
    }
  },
  
  email: {
    text: {
      fr: "L'adresse email",
      ar: "الإيميل"
    }
  },
  
  salarie: {
    text: {
      fr: "C'est vous ! La personne qui travaille comme auxiliaire de vie.",
      ar: "هذا نتا/نتي! الشخص اللي كيخدم مساعد/ة للحياة."
    }
  },
  
  numeroSecu: {
    text: {
      fr: "Votre numéro de sécurité sociale (15 chiffres). Il est sur votre carte Vitale.",
      ar: "رقم الضمان الاجتماعي ديالك (15 رقم). مكتوب فكارط فيطال."
    },
    example: {
      fr: "2 85 12 75 108 234 56",
      ar: "مثلا: 2 85 12 75 108 234 56"
    }
  },
  
  // === ÉTAPE 2 : Contrat & Lieu ===
  dateEmbauche: {
    text: {
      fr: "Le premier jour de travail",
      ar: "أول نهار ديال الخدمة"
    }
  },
  
  periodeEssai: {
    text: {
      fr: "Période pour voir si le travail convient aux deux parties. On peut arrêter plus facilement pendant cette période.",
      ar: "فترة باش نشوفو واش الخدمة مزيانة للزوج. نقدرو نوقفو بسهولة فهاد الفترة."
    },
    example: {
      fr: "1 mois = 30 jours pour tester",
      ar: "شهر واحد = 30 يوم للتجربة"
    }
  },
  
  lieuTravail: {
    text: {
      fr: "L'adresse où vous travaillez — le domicile de l'employeur",
      ar: "العنوان فين كتخدم — الدار ديال المشغل"
    }
  },
  
  residenceSecondaire: {
    text: {
      fr: "Une deuxième maison où vous pourriez parfois travailler (vacances, week-ends...)",
      ar: "دار ثانية فين يمكن تخدم شي مرات (عطلة، ويكاند...)"
    }
  },
  
  // === ÉTAPE 3 : Nature de l'emploi ===
  emploi: {
    text: {
      fr: "Le nom de votre travail",
      ar: "اسم الخدمة ديالك"
    },
    example: {
      fr: "Assistant(e) de vie, Garde à domicile, Aide ménager(ère)",
      ar: "مثلا: مساعد/ة للحياة، حارس/ة فالدار"
    }
  },
  
  classification: {
    text: {
      fr: "Le niveau de votre emploi selon la convention collective. Plus le niveau est haut, plus le salaire minimum est élevé.",
      ar: "المستوى ديال الخدمة حسب القانون. كلما المستوى عالي، كلما الصالير الأدنى عالي."
    },
    example: {
      fr: "Niveau 3 = aide à une personne dépendante",
      ar: "مثلا: المستوى 3 = مساعدة شخص محتاج"
    }
  },
  
  activitesComplementaires: {
    text: {
      fr: "Les tâches en plus de votre travail principal",
      ar: "الخدمات الزايدة على الخدمة الأساسية"
    },
    example: {
      fr: "Courses, accompagnement RDV médicaux, petit jardinage...",
      ar: "مثلا: التسوق، المرافقة للطبيب، الجردا..."
    }
  },
  
  // === ÉTAPE 4 : Durée et horaires ===
  typeDuree: {
    text: {
      fr: "Choisissez selon ce que vous savez au moment de signer le contrat",
      ar: "ختار حسب اللي كتعرف وقت التوقيع على الكونترا"
    }
  },
  
  heuresHebdo: {
    text: {
      fr: "Le total d'heures travaillées chaque semaine",
      ar: "مجموع الساعات اللي كتخدم كل سيمانة"
    },
    example: {
      fr: "20h = environ 4h par jour sur 5 jours",
      ar: "20 ساعة = تقريبا 4 ساعات فالنهار على 5 أيام"
    }
  },
  
  presenceResponsable: {
    text: {
      fr: "Heures où vous restez vigilant mais pouvez faire vos affaires (1h = 2/3 d'heure payée)",
      ar: "الساعات اللي كتبقى فيهم يقظ ولكن تقدر دير حوايجك (1 ساعة = 2/3 ساعة مخلوصة)"
    }
  },
  
  presenceNuit: {
    text: {
      fr: "Si vous dormez sur place la nuit (entre 20h et 6h30)",
      ar: "إلا كتنعس فالبلاصة بالليل (بين 8 ديال الليل و 6:30 ديال الصباح)"
    }
  },
  
  // === ÉTAPE 5 : Repos & Rémunération ===
  reposHebdo: {
    text: {
      fr: "Votre jour de repos obligatoire chaque semaine",
      ar: "نهار الراحة الواجب كل سيمانة"
    }
  },
  
  premier1erMai: {
    text: {
      fr: "Le 1er mai est spécial : si vous travaillez, vous êtes payé DOUBLE (×2)",
      ar: "1 ماي خاص: إلا خدمتي، كتخلص الضعف (×2)"
    }
  },
  
  joursFeries: {
    text: {
      fr: "Les jours fériés que vous travaillez ou pas",
      ar: "أيام العطل اللي كتخدم فيها ولا لا"
    }
  },
  
  salaireHoraireBrut: {
    text: {
      fr: "Le salaire avant les charges. L'employeur déclare ce montant.",
      ar: "الصالير قبل الضرائب. المشغل كيصرح بهاد المبلغ."
    },
    example: {
      fr: "14,50€ brut",
      ar: "مثلا: 14.50€ خام"
    }
  },
  
  salaireHoraireNet: {
    text: {
      fr: "Ce que vous recevez vraiment sur votre compte",
      ar: "اللي كتوصل فالحقيقة للكونط ديالك"
    },
    example: {
      fr: "11,35€ net ≈ ce que vous touchez",
      ar: "مثلا: 11.35€ صافي ≈ اللي كتاخد"
    }
  },
  
  heuresSup: {
    text: {
      fr: "Comment sont payées les heures au-delà de 40h/semaine",
      ar: "كيفاش كيتخلصو الساعات الزايدة على 40 ساعة فالسيمانة"
    }
  },
  
  indemnitesNuit: {
    text: {
      fr: "Montant si vous êtes appelé pendant la nuit",
      ar: "المبلغ إلا عيطو عليك فالليل"
    }
  },
  
  avantagesNature: {
    text: {
      fr: "Si l'employeur vous offre des repas ou un logement, ça se déduit du salaire",
      ar: "إلا المشغل عطاك الماكلة ولا السكن، كيتنقص من الصالير"
    }
  },
  
  transport: {
    text: {
      fr: "L'employeur doit rembourser 50% de vos transports en commun (métro, bus...)",
      ar: "المشغل خاصو يرجعلك 50% ديال الترانسبور (الميترو، الطوبيس...)"
    }
  },
  
  conduite: {
    text: {
      fr: "Si vous conduisez la voiture de l'employeur ou la vôtre pour les courses, RDV médicaux...",
      ar: "إلا كتسوق الطوموبيل ديال المشغل ولا ديالك للتسوق، الطبيب..."
    }
  },
  
  indemniteKm: {
    text: {
      fr: "Si vous utilisez VOTRE voiture. Minimum légal : 0,52€/km",
      ar: "إلا كتستعمل الطوموبيل ديالك. الحد الأدنى: 0.52€/كم"
    }
  },
  
  // === ÉTAPE 6 : Congés & Signature ===
  delaiConges: {
    text: {
      fr: "Combien de temps à l'avance l'employeur doit vous dire quand prendre vos congés. Minimum 2 mois.",
      ar: "شحال قبل المشغل خاصو يقولك وقتاش تاخد العطلة. على الأقل 2 شهور."
    }
  },
  
  conditionsParticulieres: {
    text: {
      fr: "Tout ce qui est spécial dans votre travail",
      ar: "كلشي خاص فالخدمة ديالك"
    }
  },
  
  signature: {
    text: {
      fr: "La ville et la date où vous signez le contrat",
      ar: "المدينة والتاريخ فين كتوقع الكونترا"
    }
  },
}

// Labels des boutons et sections
export const LABELS: Record<string, Traduction> = {
  // Navigation
  retour: { fr: "← Retour", ar: "← رجوع" },
  suivant: { fr: "Suivant →", ar: "التالي →" },
  precedent: { fr: "← Précédent", ar: "← السابق" },
  genererPDF: { fr: "📥 Générer le contrat PDF", ar: "📥 صيفط الكونترا PDF" },
  
  // Titres des étapes
  etape: { fr: "Étape", ar: "المرحلة" },
  
  // Étape 1
  employeurTitre: { fr: "👤 Le particulier employeur", ar: "👤 المشغل الخاص" },
  salarieTitre: { fr: "🧑‍⚕️ Le salarié (vous)", ar: "🧑‍⚕️ الأجير (نتا/نتي)" },
  
  // Étape 2  
  dateTitre: { fr: "📅 Date et période d'essai", ar: "📅 التاريخ وفترة التجربة" },
  lieuTitre: { fr: "🏠 Lieu de travail", ar: "🏠 بلاصة الخدمة" },
  
  // Étape 3
  emploiTitre: { fr: "💼 Nature de l'emploi", ar: "💼 نوع الخدمة" },
  
  // Étape 4
  horairesTitre: { fr: "⏰ Durée et horaires de travail", ar: "⏰ المدة والأوقات ديال الخدمة" },
  nuitTitre: { fr: "🌙 Présence de nuit", ar: "🌙 الحضور بالليل" },
  
  // Étape 5
  reposTitre: { fr: "😴 Repos hebdomadaire", ar: "😴 الراحة الأسبوعية" },
  feriesTitre: { fr: "🎉 Jours fériés", ar: "🎉 أيام العطل" },
  remunerationTitre: { fr: "💰 Rémunération", ar: "💰 الصالير" },
  
  // Étape 6
  congesTitre: { fr: "🏖️ Congés payés", ar: "🏖️ العطلة المخلوصة" },
  conditionsTitre: { fr: "📋 Conditions particulières", ar: "📋 الشروط الخاصة" },
  signatureTitre: { fr: "✍️ Signature du contrat", ar: "✍️ التوقيع على الكونترا" },
  
  // Champs
  nomNaissance: { fr: "Nom de naissance", ar: "السمية ديال الولادة" },
  nomUsage: { fr: "Nom d'usage", ar: "السمية المستعملة" },
  prenom: { fr: "Prénom", ar: "الاسم" },
  numeroCesu: { fr: "N° CESU", ar: "رقم CESU" },
  adresse: { fr: "Adresse", ar: "العنوان" },
  ville: { fr: "Ville", ar: "المدينة" },
  codePostal: { fr: "Code postal", ar: "الكود بوسطال" },
  telephone: { fr: "Téléphone", ar: "التيليفون" },
  email: { fr: "Email", ar: "الإيميل" },
  numeroSecu: { fr: "N° Sécurité sociale", ar: "رقم الضمان الاجتماعي" },
  dateEmbauche: { fr: "Date d'embauche", ar: "تاريخ التشغيل" },
  periodeEssai: { fr: "Période d'essai", ar: "فترة التجربة" },
  
  // Infos
  bonASavoir: { fr: "ℹ️ Bon à savoir", ar: "ℹ️ خاصك تعرف" },
  astuce: { fr: "💡 Astuce", ar: "💡 نصيحة" },
  important: { fr: "⚠️ Important", ar: "⚠️ مهم" },
  rappel: { fr: "✅ Rappel", ar: "✅ تذكير" },
}

// Helper pour obtenir une traduction
export function t(key: string, langue: Langue, labels: Record<string, Traduction> = LABELS): string {
  return labels[key]?.[langue] || key
}

// Helper pour obtenir une traduction d'infobulle
export function getTooltip(key: string, langue: Langue): { text: string; example?: string } {
  const trad = TRADUCTIONS[key]
  if (!trad) return { text: '' }
  
  return {
    text: trad.text[langue],
    example: trad.example?.[langue]
  }
}