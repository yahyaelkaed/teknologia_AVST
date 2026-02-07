// signs/data/professionalAnimations.js
export const PROFESSIONAL_ANIMATIONS = {
  'تحليل': {
    id: 'analyse',
    arabic: 'تحليل',
    english: 'analyse',
    french: 'analyser',
    duration: 3.5,
    animationFile: '/models/analyse_default.glb', // ✅ Path to your file
    animationClip: 'analyse', // Name of animation clip inside GLB
    category: 'medical'
  },
  // ... more signs
};

export function getProfessionalAnimation(text) {
  const arabicText = text.trim();
  
  // Direct match
  if (PROFESSIONAL_ANIMATIONS[arabicText]) {
    return PROFESSIONAL_ANIMATIONS[arabicText];
  }
  
  // Contains match
  for (const [key, sign] of Object.entries(PROFESSIONAL_ANIMATIONS)) {
    if (arabicText.includes(key)) {
      return sign;
    }
  }
  
  return null;
}