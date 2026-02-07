// src/data/signsDatabase.js

export const SIGNS_DATABASE = {
  // ================= EMERGENCY SIGNS =================
  "اسعاف": {
    id: "ambulance",
    arabic: "اسعاف",
    english: "ambulance",
    french: "ambulance",
    category: "emergency",
    priority: 10,
    videoUrl: "/signs/videos/ambulance.mp4", // You'll add this later
    description: "Emergency vehicle with siren sign"
  },
  
  "مساعدة": {
    id: "help",
    arabic: "مساعدة",
    english: "help",
    french: "aide",
    category: "emergency",
    priority: 10,
    videoUrl: "/signs/videos/help.mp4",
    description: "One hand waves upward asking for assistance"
  },
  
  "ألم": {
    id: "pain",
    arabic: "ألم",
    english: "pain",
    french: "douleur",
    category: "symptoms",
    priority: 9,
    videoUrl: "/signs/videos/pain.mp4",
    description: "Hand over affected area with pained expression"
  },
  
  "نزيف": {
    id: "bleeding",
    arabic: "نزيف",
    english: "bleeding",
    french: "saignement",
    category: "symptoms",
    priority: 8,
    videoUrl: "/signs/videos/bleeding.mp4",
    description: "Hand shows dripping motion from wound"
  },
  
  "حمى": {
    id: "fever",
    arabic: "حمى",
    english: "fever",
    french: "fièvre",
    category: "symptoms",
    priority: 7,
    videoUrl: "/signs/videos/fever.mp4",
    description: "Hand on forehead checking temperature"
  },
  
  "استعجالي": {
    id: "urgent",
    arabic: "استعجالي",
    english: "urgent",
    french: "urgent",
    category: "emergency",
    priority: 10,
    videoUrl: "/signs/videos/urgent.mp4",
    description: "Quick circular motion with both hands"
  },
  
  // ================= MEDICAL PROFESSIONALS =================
  "طبيب": {
    id: "doctor",
    arabic: "طبيب",
    english: "doctor",
    french: "médecin",
    category: "professionals",
    priority: 10,
    videoUrl: "/signs/videos/doctor.mp4",
    description: "Hand touches chest then moves outward"
  },
  
  "مستشفى": {
    id: "hospital",
    arabic: "مستشفى",
    english: "hospital",
    french: "hôpital",
    category: "places",
    priority: 9,
    videoUrl: "/signs/videos/hospital.mp4",
    description: "Both hands form roof shape over head"
  },
  
  // ================= BASIC RESPONSES =================
  "نعم": {
    id: "yes",
    arabic: "نعم",
    english: "yes",
    french: "oui",
    category: "responses",
    priority: 8,
    videoUrl: "/signs/videos/yes.mp4",
    description: "Nodding head with hand motion"
  },
  
  "لا": {
    id: "no",
    arabic: "لا",
    english: "no",
    french: "non",
    category: "responses",
    priority: 8,
    videoUrl: "/signs/videos/no.mp4",
    description: "Shaking head with crossing hands"
  },
  
  // ================= QUESTIONS =================
  "أين": {
    id: "where",
    arabic: "أين",
    english: "where",
    french: "où",
    category: "questions",
    priority: 7,
    videoUrl: "/signs/videos/where.mp4",
    description: "Hands move outward in questioning gesture"
  },
  
  "متى": {
    id: "when",
    arabic: "متى",
    english: "when",
    french: "quand",
    category: "questions",
    priority: 6,
    videoUrl: "/signs/videos/when.mp4",
    description: "Pointing to wrist/watch area"
  }
};

// ================= HELPER FUNCTIONS =================

// Get signs by category
export const getSignsByCategory = (category) => {
  return Object.values(SIGNS_DATABASE)
    .filter(sign => sign.category === category)
    .sort((a, b) => b.priority - a.priority);
};

// Get all categories
export const getAllCategories = () => {
  const categories = new Set();
  Object.values(SIGNS_DATABASE).forEach(sign => {
    categories.add(sign.category);
  });
  return Array.from(categories);
};

// Find sign by Arabic text
export const findSignByArabic = (text) => {
  return SIGNS_DATABASE[text] || null;
};

// Find sign by English text
export const findSignByEnglish = (englishText) => {
  return Object.values(SIGNS_DATABASE).find(
    sign => sign.english.toLowerCase() === englishText.toLowerCase()
  );
};

// Search signs by any language
export const searchSigns = (query) => {
  const lowerQuery = query.toLowerCase();
  return Object.values(SIGNS_DATABASE).filter(sign =>
    sign.arabic.includes(query) ||
    sign.english.toLowerCase().includes(lowerQuery) ||
    sign.french.toLowerCase().includes(lowerQuery) ||
    sign.description.toLowerCase().includes(lowerQuery)
  );
};

// Get priority signs (for MVP)
export const getPrioritySigns = (limit = 10) => {
  return Object.values(SIGNS_DATABASE)
    .sort((a, b) => b.priority - a.priority)
    .slice(0, limit);
};

// Group by category for UI
export const getSignsGroupedByCategory = () => {
  const grouped = {};
  Object.values(SIGNS_DATABASE).forEach(sign => {
    if (!grouped[sign.category]) {
      grouped[sign.category] = [];
    }
    grouped[sign.category].push(sign);
  });
  
  // Sort each category by priority
  Object.keys(grouped).forEach(category => {
    grouped[category].sort((a, b) => b.priority - a.priority);
  });
  
  return grouped;
};