// LST Videos Database - Based on your actual videos
export const VIDEO_ANIMATIONS = {
  // Medical/Health Terms
  "تحليل": { // analyse.mp4
    id: "analyse",
    arabic: "تحليل",
    english: "analysis",
    french: "analyse",
    videoFile: "/videos/analyse.mp4",
    duration: 2.0,
    category: "medical",
    description: "Medical analysis or test"
  },
  
  "انتباه": { // attention.mp4
    id: "attention",
    arabic: "انتباه",
    english: "attention",
    french: "attention",
    videoFile: "/videos/attention.mp4",
    duration: 1.5,
    category: "communication",
    description: "Pay attention"
  },
  
  "الصندوق الوطني للتأمين على المرض": { // caisse nationale d'assurance-maladie.mp4
    id: "cnam",
    arabic: "الصندوق الوطني للتأمين على المرض",
    english: "National Health Insurance Fund",
    french: "Caisse Nationale d'Assurance-Maladie",
    videoFile: "/videos/caisse nationale d'assurance-maladie.mp4",
    duration: 3.0,
    category: "administrative",
    description: "Tunisian National Health Insurance"
  },
  
  "بطاقة تعريف وطنية": { // CIN.mp4
    id: "cin",
    arabic: "بطاقة تعريف وطنية",
    english: "National ID Card",
    french: "Carte d'Identité Nationale",
    videoFile: "/videos/CIN.mp4",
    duration: 2.0,
    category: "administrative",
    description: "National identification card"
  },
  
  "تاريخ الميلاد": { // date de naissance.mp4
    id: "birthdate",
    arabic: "تاريخ الميلاد",
    english: "birth date",
    french: "date de naissance",
    videoFile: "/videos/date de naissance.mp4",
    duration: 2.0,
    category: "personal",
    description: "Date of birth"
  },
  
  "بصحة جيدة": { // en pleine forme.mp4
    id: "healthy",
    arabic: "بصحة جيدة",
    english: "in good health",
    french: "en pleine forme",
    videoFile: "/videos/en pleine forme.mp4",
    duration: 2.0,
    category: "medical",
    description: "Good health condition"
  },
  
  "تقييم": { // évaluation.mp4
    id: "evaluation",
    arabic: "تقييم",
    english: "evaluation",
    french: "évaluation",
    videoFile: "/videos/évaluation.mp4",
    duration: 2.0,
    category: "medical",
    description: "Medical evaluation"
  },
  
  "مطهر كحولي": { // gel hydroalcoolique.mp4
    id: "sanitizer",
    arabic: "مطهر كحولي",
    english: "hand sanitizer",
    french: "gel hydroalcoolique",
    videoFile: "/videos/gel hydroalcoolique.mp4",
    duration: 2.0,
    category: "medical",
    description: "Alcohol-based hand sanitizer"
  },
  
  "إعاقة": { // handicap.mp4
    id: "disability",
    arabic: "إعاقة",
    english: "disability",
    french: "handicap",
    videoFile: "/videos/handicap.mp4",
    duration: 2.0,
    category: "medical",
    description: "Disability or handicap"
  },
  
  "زرع قوقعة": { // implant cochléaire.mp4
    id: "cochlear",
    arabic: "زرع قوقعة",
    english: "cochlear implant",
    french: "implant cochléaire",
    videoFile: "/videos/implant cochléaire.mp4",
    duration: 2.5,
    category: "medical",
    description: "Cochlear hearing implant"
  },
  
  "معلومات": { // information et .mp4
    id: "information",
    arabic: "معلومات",
    english: "information",
    french: "information",
    videoFile: "/videos/information et .mp4",
    duration: 2.0,
    category: "communication",
    description: "Information"
  },
  
  "مترجم": { // interprète.mp4
    id: "interpreter",
    arabic: "مترجم",
    english: "interpreter",
    french: "interprète",
    videoFile: "/videos/interprète.mp4",
    duration: 2.0,
    category: "communication",
    description: "Sign language interpreter"
  },
  
  "لغة الإشارة": { // langue des signes.mp4
    id: "signlanguage",
    arabic: "لغة الإشارة",
    english: "sign language",
    french: "langue des signes",
    videoFile: "/videos/langue des signes.mp4",
    duration: 2.0,
    category: "communication",
    description: "Sign language"
  },
  
  "ضعيف السمع": { // malentendant.mp4
    id: "hearingimpaired",
    arabic: "ضعيف السمع",
    english: "hearing impaired",
    french: "malentendant",
    videoFile: "/videos/malentendant.mp4",
    duration: 2.0,
    category: "medical",
    description: "Hard of hearing"
  },
  
  "دواء": { // médicament.mp4
    id: "medicine",
    arabic: "دواء",
    english: "medicine",
    french: "médicament",
    videoFile: "/videos/médicament.mp4",
    duration: 2.0,
    category: "medical",
    description: "Medication"
  }
};

// Helper functions
export function getVideoAnimation(arabicText) {
  // Try exact match first
  if (VIDEO_ANIMATIONS[arabicText]) {
    return VIDEO_ANIMATIONS[arabicText];
  }
  
  // Try partial match (for long phrases)
  for (const key in VIDEO_ANIMATIONS) {
    if (arabicText.includes(key) || key.includes(arabicText)) {
      return VIDEO_ANIMATIONS[key];
    }
  }
  
  // Try English match
  for (const key in VIDEO_ANIMATIONS) {
    const anim = VIDEO_ANIMATIONS[key];
    if (anim.english.toLowerCase().includes(arabicText.toLowerCase()) ||
        anim.french.toLowerCase().includes(arabicText.toLowerCase())) {
      return anim;
    }
  }
  
  return null;
}

export function getAllVideoAnimations() {
  return Object.values(VIDEO_ANIMATIONS);
}

export function getAnimationsByCategory(category) {
  return Object.values(VIDEO_ANIMATIONS)
    .filter(anim => anim.category === category)
    .sort((a, b) => a.arabic.localeCompare(b.arabic));
}

export function searchAnimations(query) {
  const lowerQuery = query.toLowerCase();
  return Object.values(VIDEO_ANIMATIONS).filter(anim =>
    anim.arabic.includes(query) ||
    anim.english.toLowerCase().includes(lowerQuery) ||
    anim.french.toLowerCase().includes(lowerQuery) ||
    anim.description.toLowerCase().includes(lowerQuery)
  );
}