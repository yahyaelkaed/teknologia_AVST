// signs/data/professionalAnimations.js
export const PROFESSIONAL_ANIMATIONS = {
  // === CORE ANIMATIONS ===
  'تحليل': {
    id: 'analyse',
    arabic: 'تحليل',
    english: 'Analyse',
    french: 'Analyser',
    duration: 3.5,
    animationFile: '/models/analyse_default.glb',
    animationClip: 'analyse',
    category: 'medical',
    description: 'تحليل أو تقييم طبي'
  },
  
  'موجات فوق صوتية': {
    id: 'ultrasound',
    arabic: 'موجات فوق صوتية',
    english: 'Ultrasound',
    french: 'Échographie',
    duration: 4.0,
    animationFile: '/models/fautallerfaireuneecho.glb',
    animationClip: 'ultrasound_animation',
    category: 'medical',
    description: 'عليك أن تذهب للحصول على الموجات فوق الصوتية'
  },
  
  'حساسية': {
    id: 'allergy',  
    arabic: 'حساسية',
    english: 'Allergy',
    french: 'Allergie',
    duration: 3.5,
    animationFile: '/models/avezvousunealergie.glb',
    animationClip: 'allergy_animation',
    category: 'medical',
    description: 'هل لديك حساسية؟'
  },
  
  'ضوء': {
    id: 'light',
    arabic: 'ضوء',
    english: 'Light',
    french: 'Lumière',
    duration: 3.0,
    animationFile: '/models/lucemie.glb',
    animationClip: 'light_animation',
    category: 'general',
    description: 'ضوء أو إضاءة'
  },
  
  'لا بأس': {
    id: 'good_health',
    arabic: 'لا بأس',
    english: 'Good Health',
    french: 'Bonne Santé',
    duration: 3.5,
    animationFile: '/models/bonne-sante_default.glb',
    animationClip: 'health_animation',
    category: 'greeting',
    description: 'انشاء الله لباس / لا باس عليك'
  },
  
  'سكتة قلبية': {
    id: 'cardiac_arrest',
    arabic: 'سكتة قلبية',
    english: 'Cardiac Arrest',
    french: 'Arrêt Cardiaque',
    duration: 4.0,
    animationFile: '/models/arretcardiaque_default.glb',
    animationClip: 'cardiac_animation',
    category: 'emergency',
    description: 'سكتة قلبية / قلب سكت'
  },
  
  'طبيب': {
    id: 'doctor',
    arabic: 'طبيب',
    english: 'Doctor',
    french: 'Médecin',
    duration: 3.2,
    animationFile: '/models/medecin_default.glb',
    animationClip: 'doctor_animation',
    category: 'medical',
    description: 'طبيب أو دكتور'
  },
  'هل تعاني من مرض السكري': {
    id: 'diabetes',
    arabic: 'هل تعاني من مرض السكري',
    english: 'Diabetes',
    french: 'Diabète',
    duration: 4.0,
    // UNCOMMENT THIS LINE:
    animationFile: '/models/Souffrezvousdediabete.glb',
    animationClip: 'diabetes_animation',
    category: 'medical',
    description: 'عندك السكر',
    
  },
  'متى كانت آخر مرة': {
  id: 'last_time',
  arabic: 'متى كانت آخر مرة',
  english: 'When was the last time',
  french: 'Quand est la dernière fois',
  duration: 3.5,
  animationFile: '/models/Quandestladernierefois.glb',
  animationClip: 'last_time_animation',
  category: 'question',
  description: 'متى كانت آخر مرة / متى آخر مرة'
},
  // === WORD MAPPINGS ===
  // متى كانت آخر مرة variations
'متى كانت': 'متى كانت آخر مرة',
'آخر مرة': 'متى كانت آخر مرة',
'متى آخر مرة': 'متى كانت آخر مرة',
'المرة الأخيرة': 'متى كانت آخر مرة',
'متى أخر مرة': 'متى كانت آخر مرة',

// English variations
'when was the last time': 'متى كانت آخر مرة',
'last time': 'متى كانت آخر مرة',
'when last': 'متى كانت آخر مرة',

// French variations
'quand est la dernière fois': 'متى كانت آخر مرة',
'quand est la derniere fois': 'متى كانت آخر مرة',
'dernière fois': 'متى كانت آخر مرة',
'derniere fois': 'متى كانت آخر مرة',
'quand était la dernière fois': 'متى كانت آخر مرة',

// Common combinations
'متى كانت آخر مرة لك': 'متى كانت آخر مرة',
'متى آخر مرة لك': 'متى كانت آخر مرة',
'متى كانت آخر مرة فعلت': 'متى كانت آخر مرة',
'اخر مره وقتاش': 'متى كانت آخر مرة',
'متى كانت آخر مرة عملت': 'متى كانت آخر مرة',
'متى كانت آخر مرة شفت': 'متى كانت آخر مرة',
'متى كانت آخر مرة حسيت': 'متى كانت آخر مرة',



  'هل أنت مصاب بمرض السكري': 'هل تعاني من مرض السكري',
  'هل لديك مرض السكري': 'هل تعاني من مرض السكري',
  'هل تشكو من السكري': 'هل تعاني من مرض السكري',
  'هل تعاني من السكر': 'هل تعاني من مرض السكري',
  
  // Tunisian Arabic Variations
  'واش عندك السكري': 'هل تعاني من مرض السكري',
  'واش عندك السكر': 'هل تعاني من مرض السكري',
  'واش تعاني من السكري': 'هل تعاني من مرض السكري',
  'واش لك السكري': 'هل تعاني من مرض السكري',
  
  // Egyptian Arabic Variations
  'عندك سكر': 'هل تعاني من مرض السكري',
  'بتعاني من السكر': 'هل تعاني من مرض السكري',
  'عندك مرض السكر': 'هل تعاني من مرض السكري',
  
  // Levantine Arabic Variations (Syrian/Lebanese/Jordanian)
  'بعاني من السكري': 'هل تعاني من مرض السكري',
  'عندك سكري': 'هل تعاني من مرض السكري',
  'في عندك سكري': 'هل تعاني من مرض السكري',
  
  // Gulf Arabic Variations
  'عندك سكري': 'هل تعاني من مرض السكري',
  'تشتكي من السكر': 'هل تعاني من مرض السكري',
  'في عندك مرض السكري': 'هل تعاني من مرض السكري',
  
  // French (from your original file name)
  'Souffrez-vous de diabète': 'هل تعاني من مرض السكري',
  'Avez-vous le diabète': 'هل تعاني من مرض السكري',
  
  // English
  'Do you have diabetes': 'هل تعاني من مرض السكري',
  'Are you diabetic': 'هل تعاني من مرض السكري',
  'Do you suffer from diabetes': 'هل تعاني من مرض السكري',

  
  // تحليل variations
  'تحليلية': 'تحليل',
  'analysis': 'تحليل',
  'analyse': 'تحليل',
  'analyser': 'تحليل',
  'تقييم': 'تحليل',
  
  // موجات فوق صوتية variations
  'الموجات': 'موجات فوق صوتية',
  'فوق صوتية': 'موجات فوق صوتية',
  'إيكو': 'موجات فوق صوتية',
  'صدى': 'موجات فوق صوتية',
  'echo': 'موجات فوق صوتية',
  'ultrasound': 'موجات فوق صوتية',
  'échographie': 'موجات فوق صوتية',
  'اشعة': 'موجات فوق صوتية',
  'الأشعة': 'موجات فوق صوتية',
  
  // حساسية variations
  'حساسيه': 'حساسية',
  'الحساسية': 'حساسية',
  'allergy': 'حساسية',
  'allergie': 'حساسية',
  'حساس': 'حساسية',
  
  // ضوء variations
  'الضوء': 'ضوء',
  'نور': 'ضوء',
  'light': 'ضوء',
  'lumière': 'ضوء',
  'إضاءة': 'ضوء',
  'ضوءء': 'ضوء',
  
  // لا بأس variations
  'انشاء': 'لا بأس',
  'انشاء الله': 'لا بأس',
  'انشاءالله': 'لا بأس',
  'لباس': 'لا بأس',
  'لاباس': 'لا بأس',
  'عليك': 'لا بأس',
  'صحة': 'لا بأس',
  'عافية': 'لا بأس',
  'سلامة': 'لا بأس',
  'good health': 'لا بأس',
  'bonne santé': 'لا بأس',
  'bonne sante': 'لا بأس',
  'health': 'لا بأس',
  
  // سكتة قلبية variations
  'سكتة': 'سكتة قلبية',
  'قلبية': 'سكتة قلبية',
  'قلب': 'سكتة قلبية',
  'سكت': 'سكتة قلبية',
  'cardiac': 'سكتة قلبية',
  'arrest': 'سكتة قلبية',
  'arrêt': 'سكتة قلبية',
  'cardiaque': 'سكتة قلبية',
  'توقف القلب': 'سكتة قلبية',
  'ارتفاع القلب': 'سكتة قلبية',
  'نوبة قلبية': 'سكتة قلبية',
  'heart attack': 'سكتة قلبية',
  'heart': 'سكتة قلبية',
  
  // طبيب variations
  'دكتور': 'طبيب',
  'دكتورة': 'طبيب',
  'الطبيب': 'طبيب',
  'doctor': 'طبيب',
  'médecin': 'طبيب',
  'medecin': 'طبيب',
  'الطبيبة': 'طبيب',
  'طبيبة': 'طبيب',
  
  // Emergency phrases
  'مساعدة': 'طبيب',
  'اسعاف': 'طبيب',
  'طوارئ': 'سكتة قلبية',
  'طارئ': 'سكتة قلبية',
  'خطير': 'سكتة قلبية',
  
  // Medical phrases
  'مستشفى': 'طبيب',
  'مشفى': 'طبيب',
  'عيادة': 'طبيب',
  'مرض': 'حساسية',
  'علاج': 'تحليل',
  'دواء': 'تحليل',
  
  // Common combinations
  'انشاء الله لباس': 'لا بأس',
  'انشاءالله لباس': 'لا بأس',
  'لاباس عليك': 'لا بأس',
  'لا باس عليك': 'لا بأس',
  'هل لديك حساسية': 'حساسية',
  'عندك حساسية': 'حساسية',
  'تحليل طبي': 'تحليل',
  'فحص طبي': 'تحليل',
  'موجات صوتية': 'موجات فوق صوتية',
  'اشعة صوتية': 'موجات فوق صوتية',
  'فحص القلب': 'سكتة قلبية',
  'آلام القلب': 'سكتة قلبية',
  'أحتاج طبيب': 'طبيب',
  'أريد طبيب': 'طبيب'
};

export function getProfessionalAnimation(text) {
  const arabicText = text.trim();
  
  // 1. Direct match first
  if (PROFESSIONAL_ANIMATIONS[arabicText]) {
    const anim = PROFESSIONAL_ANIMATIONS[arabicText];
    return typeof anim === 'string' ? PROFESSIONAL_ANIMATIONS[anim] : anim;
  }
  
  // 2. Lowercase match for English/French
  const lowerText = arabicText.toLowerCase();
  if (PROFESSIONAL_ANIMATIONS[lowerText]) {
    const anim = PROFESSIONAL_ANIMATIONS[lowerText];
    return typeof anim === 'string' ? PROFESSIONAL_ANIMATIONS[anim] : anim;
  }
  
  // 3. Contains match (full phrases)
  for (const [key, value] of Object.entries(PROFESSIONAL_ANIMATIONS)) {
    if (arabicText.includes(key) && typeof value === 'object') {
      return value;
    }
    if (lowerText.includes(key.toLowerCase()) && typeof value === 'object') {
      return value;
    }
  }
  
  // 4. Word-by-word check
  const words = arabicText.split(' ');
  const lowerWords = lowerText.split(' ');
  
  // Check Arabic words
  for (const word of words) {
    if (PROFESSIONAL_ANIMATIONS[word]) {
      const anim = PROFESSIONAL_ANIMATIONS[word];
      return typeof anim === 'string' ? PROFESSIONAL_ANIMATIONS[anim] : anim;
    }
  }
  
  // Check lowercase words (for English/French)
  for (const word of lowerWords) {
    if (PROFESSIONAL_ANIMATIONS[word]) {
      const anim = PROFESSIONAL_ANIMATIONS[word];
      return typeof anim === 'string' ? PROFESSIONAL_ANIMATIONS[anim] : anim;
    }
  }
  
  // 5. Partial word match (for flexibility)
  for (const [key, value] of Object.entries(PROFESSIONAL_ANIMATIONS)) {
    if (typeof value === 'object') continue; // Skip core animations
    
    // If any word contains the key or key contains the word
    for (const word of [...words, ...lowerWords]) {
      if (word.includes(key) || key.includes(word)) {
        const anim = PROFESSIONAL_ANIMATIONS[value];
        if (anim) return anim;
      }
    }
  }
  
  return null;
}

// Helper functions
export function getAnimationsByCategory(category) {
  return Object.values(PROFESSIONAL_ANIMATIONS)
    .filter(anim => typeof anim === 'object' && anim.category === category);
}

export function getPriorityAnimations(limit = 10) {
  const priorityOrder = [
    'طبيب', 'سكتة قلبية', 'لا بأس', 'تحليل', 'حساسية',
    'موجات فوق صوتية', 'ضوء'
  ];
  
  return priorityOrder
    .slice(0, limit)
    .map(id => {
      const anim = PROFESSIONAL_ANIMATIONS[id];
      return typeof anim === 'object' ? anim : PROFESSIONAL_ANIMATIONS[anim];
    })
    .filter(Boolean);
}

export function getAllAnimations() {
  return Object.values(PROFESSIONAL_ANIMATIONS)
    .filter(anim => typeof anim === 'object');
}

// Animation count
export const ANIMATION_COUNT = Object.values(PROFESSIONAL_ANIMATIONS)
  .filter(anim => typeof anim === 'object').length;