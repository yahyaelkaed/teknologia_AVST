export const TextToSpeech = {
  speak: (text, options = {}) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = options.language || 'en-US';
    utterance.rate = options.rate || 1;
    utterance.volume = options.volume || 1;
    
    window.speechSynthesis.speak(utterance);
  },

  isSupported: () => {
    return 'speechSynthesis' in window;
  },

  getLanguageCode: (lang) => {
    const langMap = {
      en: 'en-US',
      ar: 'ar-SA',
      fr: 'fr-FR',
    };
    return langMap[lang] || 'en-US';
  },
};

export default TextToSpeech;
