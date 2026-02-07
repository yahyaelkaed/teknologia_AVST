import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { useState, useEffect } from 'react';
import './App.css';
import { SIGNS_DATABASE, getPrioritySigns, findSignByArabic } from './signs/data/signsDatabase';
import ProfessionalAvatar from './components/XBotAvatar';
import DeepMotionAvatar from './components/DeepMotionAvatar';
import { MedicalVideoPanel } from './components/MedicalVideoPanel';
import { getProfessionalAnimation } from './signs/data/professionalAnimations';
import TextToSpeech from './utils/TextToSpeech';

export default function MainTranslator() {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [currentSign, setCurrentSign] = useState(null);
  const [isSigning, setIsSigning] = useState(false);
  const [signHistory, setSignHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('translator');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [colorblindType, setColorblindType] = useState('normal'); // 'normal', 'deuteranopia', 'protanopia', 'tritanopia', 'achromatopsia'
  const [textSize, setTextSize] = useState('normal'); // 'normal', 'large', 'extra-large'

  const prioritySigns = getPrioritySigns(10);

  // Model color adjustments for colorblind types
  const modelColorMap = {
    normal: { skinTone: 0xd4a574, hair: 0x3d2817 },
    deuteranopia: { skinTone: 0xd4b8a0, hair: 0x4a4a4a }, // Reduced reds, increased yellows/blues
    protanopia: { skinTone: 0x8b9dc3, hair: 0x3d3d5c }, // Shifted reds more towards blue
    tritanopia: { skinTone: 0xd4a5a5, hair: 0x5c3d3d }, // Reduced blues, increased reds/yellows
    achromatopsia: { skinTone: 0x999999, hair: 0x666666 }, // Full grayscale
  };

  // Primary color hex map for gradient overlays
  const colorHexMap = {
    normal: '#a855f7',          // purple
    deuteranopia: '#0ea5e9',    // cyan/blue
    protanopia: '#1e3a8a',      // darker blue
    tritanopia: '#dc2626',      // red
    achromatopsia: '#666666',   // gray
  };

  // Color scheme maps for UI elements based on colorblind type
  const colorSchemeMap = {
    normal: {
      primary: 'purple',
      accent: 'green',
      primaryDark: 'purple-900',
      primaryLight: 'purple-50',
      accentLight: 'green-50',
      borderPrimary: 'purple-300',
      borderPrimaryDark: 'purple-400',
      hexPrimary: '#a855f7',
      hexBorder: '#d8b4fe',
    },
    deuteranopia: {
      primary: 'blue',
      accent: 'yellow',
      primaryDark: 'blue-900',
      primaryLight: 'blue-50',
      accentLight: 'yellow-50',
      borderPrimary: 'blue-300',
      borderPrimaryDark: 'blue-400',
      hexPrimary: '#0ea5e9',
      hexBorder: '#7dd3fc',
    },
    protanopia: {
      primary: 'blue',
      accent: 'yellow',
      primaryDark: 'blue-900',
      primaryLight: 'blue-50',
      accentLight: 'yellow-50',
      borderPrimary: 'blue-300',
      borderPrimaryDark: 'blue-400',
      hexPrimary: '#1e3a8a',
      hexBorder: '#93c5fd',
    },
    tritanopia: {
      primary: 'red',
      accent: 'cyan',
      primaryDark: 'red-900',
      primaryLight: 'red-50',
      accentLight: 'cyan-50',
      borderPrimary: 'red-300',
      borderPrimaryDark: 'red-400',
      hexPrimary: '#dc2626',
      hexBorder: '#fca5a5',
    },
    achromatopsia: {
      primary: 'gray',
      accent: 'gray',
      primaryDark: 'gray-900',
      primaryLight: 'gray-50',
      accentLight: 'gray-50',
      borderPrimary: 'gray-300',
      borderPrimaryDark: 'gray-400',
      hexPrimary: '#666666',
      hexBorder: '#d1d5db',
    },
  };

  // Text size helper for applying scaling
  const getTextSizeClass = (baseSize) => {
    const sizeMap = {
      xs: { normal: 'text-xs', large: 'text-sm', 'extra-large': 'text-base' },
      sm: { normal: 'text-sm', large: 'text-base', 'extra-large': 'text-lg' },
      base: { normal: 'text-base', large: 'text-lg', 'extra-large': 'text-xl' },
      lg: { normal: 'text-lg', large: 'text-xl', 'extra-large': 'text-2xl' },
      xl: { normal: 'text-xl', large: 'text-2xl', 'extra-large': 'text-3xl' },
      '2xl': { normal: 'text-2xl', large: 'text-3xl', 'extra-large': 'text-4xl' },
      '3xl': { normal: 'text-3xl', large: 'text-4xl', 'extra-large': 'text-5xl' },
      '4xl': { normal: 'text-4xl', large: 'text-5xl', 'extra-large': 'text-6xl' },
      '5xl': { normal: 'text-5xl', large: 'text-6xl', 'extra-large': 'text-7xl' },
    };
    return sizeMap[baseSize]?.[textSize] || sizeMap[baseSize]?.normal || baseSize;
  };

  // Color palette system for accessibility - multiple colorblind types supported
  const colorPalette = {
    normal: {
      light: {
        primary: 'from-purple-600 to-pink-600',
        primaryDark: 'from-purple-700 to-pink-700',
        primaryHover: 'hover:from-purple-700 hover:to-pink-700',
        accent: 'from-green-600 to-emerald-600',
        accentHover: 'hover:from-green-700 hover:to-emerald-700',
      },
      dark: {
        primary: 'from-purple-500 to-pink-500',
        primaryDark: 'from-purple-600 to-pink-600',
        primaryHover: 'hover:from-purple-600 hover:to-pink-600',
        accent: 'from-green-500 to-emerald-500',
        accentHover: 'hover:from-green-600 hover:to-emerald-600',
      },
    },
    deuteranopia: {
      light: {
        primary: 'from-blue-600 to-cyan-600',
        primaryDark: 'from-blue-700 to-cyan-700',
        primaryHover: 'hover:from-blue-700 hover:to-cyan-700',
        accent: 'from-yellow-600 to-orange-600',
        accentHover: 'hover:from-yellow-700 hover:to-orange-700',
      },
      dark: {
        primary: 'from-blue-500 to-cyan-500',
        primaryDark: 'from-blue-600 to-cyan-600',
        primaryHover: 'hover:from-blue-600 hover:to-cyan-600',
        accent: 'from-yellow-500 to-orange-500',
        accentHover: 'hover:from-yellow-600 hover:to-orange-600',
      },
    },
    protanopia: {
      light: {
        primary: 'from-blue-700 to-teal-600',
        primaryDark: 'from-blue-800 to-teal-700',
        primaryHover: 'hover:from-blue-800 hover:to-teal-700',
        accent: 'from-yellow-600 to-amber-600',
        accentHover: 'hover:from-yellow-700 hover:to-amber-700',
      },
      dark: {
        primary: 'from-blue-600 to-teal-500',
        primaryDark: 'from-blue-700 to-teal-600',
        primaryHover: 'hover:from-blue-700 hover:to-teal-600',
        accent: 'from-yellow-500 to-amber-500',
        accentHover: 'hover:from-yellow-600 hover:to-amber-600',
      },
    },
    tritanopia: {
      light: {
        primary: 'from-red-600 to-pink-600',
        primaryDark: 'from-red-700 to-pink-700',
        primaryHover: 'hover:from-red-700 hover:to-pink-700',
        accent: 'from-cyan-600 to-blue-600',
        accentHover: 'hover:from-cyan-700 hover:to-blue-700',
      },
      dark: {
        primary: 'from-red-500 to-pink-500',
        primaryDark: 'from-red-600 to-pink-600',
        primaryHover: 'hover:from-red-600 hover:to-pink-600',
        accent: 'from-cyan-500 to-blue-500',
        accentHover: 'hover:from-cyan-600 hover:to-blue-600',
      },
    },
    achromatopsia: {
      light: {
        primary: 'from-gray-600 to-gray-700',
        primaryDark: 'from-gray-700 to-gray-800',
        primaryHover: 'hover:from-gray-700 hover:to-gray-800',
        accent: 'from-gray-500 to-gray-600',
        accentHover: 'hover:from-gray-600 hover:to-gray-700',
      },
      dark: {
        primary: 'from-gray-500 to-gray-600',
        primaryDark: 'from-gray-600 to-gray-700',
        primaryHover: 'hover:from-gray-600 hover:to-gray-700',
        accent: 'from-gray-400 to-gray-500',
        accentHover: 'hover:from-gray-500 hover:to-gray-600',
      },
    },
  };

  const currentPalette = colorPalette[colorblindType][isDarkMode ? 'dark' : 'light'];

  // Simple translate function with AVST branding
  const t = (key) => {
    const translations = {
      en: {
        title: 'AVST Voice-to-Sign Translator',
        subtitle: 'Bridging Communication for Deaf & Hard-of-Hearing Communities',
        mission: 'Empowering deaf individuals through accessible Tunisian Sign Language technology',
        translator: 'Translator',
        learner: 'Learning',
        transcript: 'Recognized Text',
        enterText: 'Enter text here',
        submit: 'Submit',
        startListening: 'Start Listening',
        listening: 'Listening...',
        stopListening: 'Stop Listening',
        history: 'Sign History',
        noMatch: 'No match found',
        language: 'Language',
        avstMission: 'Making communication accessible to all',
        hackedBy: 'Built for Maratech Hackathon 2026',
      },
      ar: {
        title: 'مترجم أصوات لغة الإشارة - AVST',
        subtitle: 'جسر التواصل بين الصم وضعاف السمع والسامعين',
        mission: 'تمكين الأفراد الصم من خلال تكنولوجيا لغة الإشارة التونسية المتقدمة',
        translator: 'المترجم',
        learner: 'التعليم',
        transcript: 'النص المعروف',
        enterText: 'أدخل النص هنا',
        submit: 'إرسال',
        startListening: 'ابدأ الاستماع',
        listening: 'الاستماع جارٍ...',
        stopListening: 'إيقاف الاستماع',
        history: 'سجل الإشارات',
        noMatch: 'لم يتم العثور على أي تطابق',
        language: 'اللغة',
        avstMission: 'جعل التواصل في متناول الجميع',
        hackedBy: 'تم بناؤه لهاكاثون ماراتيك 2026',
      },
      fr: {
        title: 'Traducteur Voix-Langue Signes AVST',
        subtitle: 'Faciliter la Communication entre Sourds et Entendants',
        mission: 'Autonomiser les sourds grâce à la technologie de la Langue des Signes Tunisienne',
        translator: 'Traducteur',
        learner: 'Apprentissage',
        transcript: 'Texte Reconnu',
        enterText: 'Entrez le texte ici',
        submit: 'Soumettre',
        startListening: 'Commencer à Écouter',
        listening: 'Écoute en cours...',
        stopListening: 'Arrêter l\'Écoute',
        history: 'Historique des Signes',
        noMatch: 'Aucune correspondance trouvée',
        language: 'Langue',
        avstMission: 'Rendre la communication accessible à tous',
        hackedBy: 'Construit pour le Hackathon Maratech 2026',
      },
      es: {
        title: 'Traductor Voz-Lengua de Signos AVST',
        subtitle: 'Facilitar la Comunicación entre Sordos y Oyentes',
        mission: 'Capacitar a los sordos con tecnología de Lengua de Signos Tunecina',
        translator: 'Traductor',
        learner: 'Aprendizaje',
        transcript: 'Texto Reconocido',
        enterText: 'Ingrese texto aquí',
        submit: 'Enviar',
        startListening: 'Comenzar a Escuchar',
        listening: 'Escuchando...',
        stopListening: 'Detener Escucha',
        history: 'Historial de Signos',
        noMatch: 'No se encontró coincidencia',
        language: 'Idioma',
        avstMission: 'Hacer que la comunicación sea accesible para todos',
        hackedBy: 'Construido para Hackathon Maratech 2026',
      },
    };
    const langDict = translations[selectedLanguage] || translations.en;
    return langDict[key] || key;
  };

  // Get speech recognition language
  const getSpeechRecognitionLanguage = () => {
    return 'ar-SA';
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new webkitSpeechRecognition();
      recognition.lang = getSpeechRecognitionLanguage();
      recognition.continuous = false;

      recognition.onstart = () => setIsListening(true);

      recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        setIsListening(false);
        triggerSignFromText(text);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert(t('noMatch'));
    }
  };

  const triggerSignFromText = (text) => {
    const professionalAnim = getProfessionalAnimation(text.trim());
    if (professionalAnim) {
      activateSign(professionalAnim);
      if (TextToSpeech.isSupported() && professionalAnim.english) {
        TextToSpeech.speak(professionalAnim.english, { language: 'en-US', rate: 1 });
      }
      return;
    }

    const arabicWords = text.split(' ');
    for (const word of arabicWords) {
      const signMatch = findSignByArabic(word);
      if (signMatch) {
        activateSign(signMatch);
        if (TextToSpeech.isSupported() && signMatch.english) {
          TextToSpeech.speak(signMatch.english, { language: 'en-US', rate: 1 });
        }
        return;
      }
    }

    setCurrentSign(null);
    setIsSigning(false);
  };

  const activateSign = (sign) => {
    setCurrentSign(sign);
    setIsSigning(true);
    setSignHistory(prev => [sign, ...prev.slice(0, 4)]);
    const duration = sign.duration ? sign.duration * 1000 : 3000;
    setTimeout(() => setIsSigning(false), duration);
  };

  const handleTextSubmit = () => {
    if (transcript.trim()) {
      triggerSignFromText(transcript);
    }
  };

  const handleQuickSignClick = (sign) => {
    setTranscript(sign.arabic);
    const anim = getProfessionalAnimation(sign.arabic) || {
      arabic: sign.arabic,
      english: sign.english,
      french: sign.french,
      id: sign.english.toLowerCase()
    };
    activateSign(anim);
    if (TextToSpeech.isSupported() && anim.english) {
      TextToSpeech.speak(anim.english, { language: 'en-US', rate: 1 });
    }
  };

  const handleHistorySignClick = (sign) => {
    activateSign(sign);
    if (TextToSpeech.isSupported() && sign.english) {
      TextToSpeech.speak(sign.english, { language: 'en-US', rate: 1 });
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentPalette.bgGradient} p-4 md:p-8`}>
      {/* AVST Hero Header */}
      <header className="text-center mb-8 md:mb-10">
        <div className="inline-block mb-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
          <span className={`text-white font-semibold ${getTextSizeClass('sm')}`}>🏆 Maratech Hackathon 2026</span>
        </div>
        <h1 className={`${getTextSizeClass('5xl')} font-bold ${currentPalette.text} mb-2`}>
          {t('title')}
        </h1>
        <p className={`${getTextSizeClass('2xl')} ${currentPalette.textSecondary} font-semibold mb-3`}>
          {t('subtitle')}
        </p>
        <p className={`${isDarkMode ? 'text-gray-300' : 'text-black'} ${getTextSizeClass('lg')} max-w-2xl mx-auto font-semibold`}>
          {t('mission')}
        </p>
        <div className={`mt-4 ${getTextSizeClass('base')} ${isDarkMode ? 'text-purple-300' : 'text-purple-700'} italic`}>
          Developed for Association Voix du Sourd de Tunisie (AVST)
        </div>
      </header>

      {/* Theme & Accessibility Controls */}
      <div className={`max-w-7xl mx-auto mb-8 bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-4 border ${isDarkMode ? 'border-white/20' : 'border-black-300/30'}`}>
        <div className="flex flex-wrap gap-4 items-center justify-center">
          {/* Theme Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 border ${
                isDarkMode
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-purple-500'
                  : 'bg-yellow-400 text-gray-900 border-yellow-500 hover:bg-yellow-500'
              }`}
              aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
              title={isDarkMode ? '🌙 Dark Mode' : '☀️ Light Mode'}
            >
              {isDarkMode ? '🌙 Dark' : '☀️ Light'}
            </button>
          </div>

          {/* Text Size Control */}
          <div className="flex items-center gap-2">
            <span className={`text-sm font-semibold ${isDarkMode ? 'text-purple-200' : 'text-gray-700'}`}>📝 Text:</span>
            <div className="flex gap-1">
              {[
                { value: 'normal', label: 'A', title: 'Normal Size' },
                { value: 'large', label: 'A', title: 'Large Size', className: 'text-lg' },
                { value: 'extra-large', label: 'A', title: 'Extra Large', className: 'text-xl' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTextSize(option.value)}
                  className={`px-3 py-1 rounded-md font-bold transition-all transform hover:scale-105 border ${
                    textSize === option.value
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-purple-500'
                      : isDarkMode
                      ? 'bg-purple-900/50 text-purple-100 hover:bg-purple-800/70 border-purple-500/30'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-300'
                  }`}
                  aria-label={option.title}
                  title={option.title}
                >
                  <span className={option.className}>A</span>
                </button>
              ))}
            </div>
          </div>

          {/* Colorblind Type Selector */}
          <div className="flex items-center gap-2">
            <span className={`text-sm font-semibold ${isDarkMode ? 'text-purple-200' : 'text-gray-700'}`}>🎨 Vision:</span>
            <select
              value={colorblindType}
              onChange={(e) => setColorblindType(e.target.value)}
              className={`px-3 py-2 rounded-lg font-semibold transition-all border ${
                isDarkMode
                  ? 'bg-purple-900/50 text-purple-100 border-purple-500/30 hover:bg-purple-800/70'
                  : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
              }`}
              aria-label="Select colorblind type"
            >
              <option value="normal">Normal Vision</option>
              <option value="deuteranopia">Deuteranopia (Red-Green)</option>
              <option value="protanopia">Protanopia (Red-Green)</option>
              <option value="tritanopia">Tritanopia (Blue-Yellow)</option>
              <option value="achromatopsia">Achromatopsia (Monochrome)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Language Switcher - Professional */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className={`bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-4 flex flex-wrap gap-3 items-center justify-center border ${isDarkMode ? 'border-purple-400/20' : 'border-gray-300/30'}`}>
          <span className={`font-semibold ${isDarkMode ? 'text-purple-200' : 'text-blue-700'}`}>{t('language')}:</span>
          {[
            { code: 'en', name: 'English', flag: '🇺🇸' },
            { code: 'ar', name: 'العربية', flag: '🇹🇳' },
            { code: 'fr', name: 'Français', flag: '🇫🇷' },
            { code: 'es', name: 'Español', flag: '🇪🇸' },
          ].map((lang) => (
            <button
              key={lang.code}
              onClick={() => setSelectedLanguage(lang.code)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 ${
                selectedLanguage === lang.code
                  ? `bg-gradient-to-r ${currentPalette.primary} text-white shadow-lg`
                  : isDarkMode
                  ? 'bg-purple-900/50 text-purple-100 hover:bg-purple-800/70 border border-purple-500/30'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
              }`}
              aria-label={`Select ${lang.name}`}
            >
              {lang.flag} {lang.name}
            </button>
          ))}
        </div>
        <p className={`text-xs text-center mt-3 ${isDarkMode ? 'text-purple-300' : 'text-blue-600'}`}>
          💬 {t('hackedBy')} • Tunisian Sign Language (LST) • Medical Communications
        </p>
      </div>

      {/* Tabs Navigation - Professional */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className={`flex border-b ${isDarkMode ? 'border-purple-500/30' : 'border-gray-300/50'} bg-transparent rounded-xl overflow-hidden gap-4`}>
          <button
            className={`px-6 py-4 font-bold text-lg transition-all transform hover:scale-105 border-b-2 ${
              activeTab === 'translator' 
                ? `${currentPalette.text}` 
                : `border-b-transparent ${isDarkMode ? 'text-purple-300 hover:text-purple-200' : 'text-gray-600 hover:text-gray-900'}`
            }`}
            style={activeTab === 'translator' ? { borderBottomColor: colorHexMap[colorblindType] } : {}}
            onClick={() => setActiveTab('translator')}
            aria-label={t('translator')}
          >
            🎤 {t('translator')}
          </button>
          <button
            className={`px-6 py-4 font-bold text-lg transition-all transform hover:scale-105 border-b-2 ${
              activeTab === 'videos' 
                ? `${currentPalette.text}` 
                : `border-b-transparent ${isDarkMode ? 'text-purple-300 hover:text-purple-200' : 'text-gray-600 hover:text-gray-900'}`
            }`}
            style={activeTab === 'videos' ? { borderBottomColor: colorHexMap[colorblindType] } : {}}
            onClick={() => setActiveTab('videos')}
            aria-label={t('learner')}
          >
            🎬 {t('learner')}
          </button>
        </div>
      </div>

      {activeTab === 'translator' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 max-w-7xl mx-auto">
          {/* Left Panel - Controls */}
          <div className={`${currentPalette.card} backdrop-blur-sm rounded-2xl shadow-2xl p-4 md:p-6 ${currentPalette.cardBorder} border`}>
            <h2 className={`${getTextSizeClass('2xl')} font-bold mb-4 bg-gradient-to-r ${currentPalette.primary} bg-clip-text text-transparent`}>
              🎤 {t('translator')}
            </h2>
            
            {/* Speech Recognition */}
            <button
              onClick={startListening}
              disabled={isListening}
              className={`w-full py-3 md:py-4 rounded-xl text-white font-bold ${getTextSizeClass('lg')} flex items-center justify-center gap-3 mb-6 transition-all transform hover:scale-105 border-2 ${
                isListening 
                  ? 'bg-red-600 border-red-500 animate-pulse shadow-lg shadow-red-500/50' 
                  : `bg-gradient-to-r ${currentPalette.primary} ${currentPalette.primaryHover}`
              }`}
              style={!isListening ? { 
                borderColor: colorHexMap[colorblindType],
                boxShadow: `0 10px 15px -3px ${colorHexMap[colorblindType]}50`
              } : {}}
              aria-label={isListening ? t('stopListening') : t('startListening')}
            >
              {isListening ? (
                <>
                  <span className="animate-ping absolute h-4 w-4 rounded-full bg-white opacity-75"></span>
                  🎤 {t('listening')}
                </>
              ) : (
                <>🎤 {t('startListening')}</>
              )}
            </button>

            {/* Recognized Text */}
            <div className="mb-6">
              <h3 className={`${getTextSizeClass('xl')} font-semibold mb-2 bg-gradient-to-r ${currentPalette.primary} bg-clip-text text-transparent`}>
                {t('transcript')}:
              </h3>
              <div 
                className={`${isDarkMode ? 'bg-gradient-to-br from-purple-50 to-pink-50' : 'bg-gradient-to-br from-blue-50 to-cyan-50'} p-4 rounded-xl min-h-[80px] border-2 shadow-md`}
                style={{
                  borderColor: colorSchemeMap[colorblindType].hexPrimary
                }}
              >
                <p className="text-lg md:text-xl text-gray-800 font-medium">
                  {transcript || t('enterText')}
                </p>
                {currentSign && (
                  <div className="mt-2 p-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg border border-purple-300">
                    <p className="bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent font-semibold">
                      ✋ Signing: <span className="text-lg">{currentSign.arabic || currentSign.id}</span>
                      <span className="ml-2 text-sm text-gray-600">
                        ({currentSign.english})
                      </span>
                      {currentSign.videoFile && (
                        <span className="ml-2 text-xs text-blue-600">
                          🎬 Video Reference
                        </span>
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Text Input */}
            <div className="mb-6">
              <h3 className={`${getTextSizeClass('xl')} font-semibold mb-2 bg-gradient-to-r ${currentPalette.primary} bg-clip-text text-transparent`}>
                {t('enterText')}:
              </h3>
              <div className="flex gap-2">
                <textarea
                  className={`w-full h-32 p-4 border-2 rounded-xl resize-none focus:ring-2 ${currentPalette.input}`}
                  placeholder={t('enterText')}
                  onChange={(e) => setTranscript(e.target.value)}
                  value={transcript}
                />
                <button
                  onClick={handleTextSubmit}
                  className={`self-end mb-2 px-4 py-2 bg-gradient-to-r ${currentPalette.accent} ${currentPalette.accentHover} text-white rounded-lg font-bold shadow-lg transform hover:scale-105 transition-all`}
                  aria-label={t('submit')}
                >
                  {t('submit')}
                </button>
              </div>
            </div>

            {/* Quick Sign Buttons */}
            <div className="mb-6">
              <h3 className={`${getTextSizeClass('xl')} font-semibold mb-2 bg-gradient-to-r ${currentPalette.primary} bg-clip-text text-transparent`}>
                ✨ Quick Medical Signs:
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {[
                  { arabic: 'تحليل', english: 'analysis', french: 'analyse' },
                  { arabic: 'موجات فوق صوتية', english: 'ultrasound', french: 'échographie' },
                  { arabic: 'حساسية', english: 'allergy', french: 'allergie' },
                  { arabic: 'طبيب', english: 'doctor', french: 'médecin' },
                  { arabic: 'سكتة قلبية', english: 'cardiac arrest', french: 'arrêt cardiaque' },
                  { arabic: 'لا بأس', english: 'good health', french: 'bon santé' },
                  { arabic: 'عندك سكر', english: 'diabetes', french: 'diabète' },
                  { arabic: 'متى كانت آخر مرة', english: 'when was the last time', french: 'quand est la dernière fois' },
                ].map((sign) => (
                  <button
                    key={sign.arabic}
                    onClick={() => handleQuickSignClick(sign)}
                    className={`p-3 rounded-lg bg-gradient-to-br ${currentPalette.primary} hover:${currentPalette.primaryDark} text-white flex flex-col items-center transition-all transform hover:scale-105 shadow-lg border font-bold`}
                    style={{ 
                      borderColor: colorSchemeMap[colorblindType].hexPrimary,
                      borderWidth: '2px'
                    }}
                    aria-label={`${sign.arabic} - ${sign.english}`}
                  >
                    <span className={`font-bold ${getTextSizeClass('lg')}`}>{sign.arabic}</span>
                    <span className={`${getTextSizeClass('xs')} opacity-90`}>{sign.english}</span>
                    <span className={`${getTextSizeClass('base')} mt-1`}>✋</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Professional System Info */}
            <div 
              className={`mt-6 p-4 rounded-xl border-2 backdrop-blur-sm shadow-lg`}
              style={{
                backgroundImage: isDarkMode 
                  ? `linear-gradient(to bottom right, ${colorSchemeMap[colorblindType].hexPrimary}0a, ${colorSchemeMap[colorblindType].hexPrimary}0f)`
                  : `linear-gradient(to bottom right, ${colorSchemeMap[colorblindType].hexPrimary}15, ${colorSchemeMap[colorblindType].hexPrimary}20)`,
                borderColor: isDarkMode 
                  ? `${colorSchemeMap[colorblindType].hexPrimary}80`
                  : `${colorSchemeMap[colorblindType].hexPrimary}66`,
              }}
            >
              <h3 
                className={`${getTextSizeClass('lg')} font-bold mb-3`}
                style={{
                  color: isDarkMode ? 'white' : '#000000'
                }}
              >
                🏢 AVST Partnership & Validation
              </h3>
              <p 
                className="text-sm mb-3"
                style={{
                  color: isDarkMode ? '#fae8ff' : '#000000'
                }}
              >
                This system is built in partnership with the Association Voix du Sourd de Tunisie, 
                featuring professional Tunisian Sign Language (LST) animations.
              </p>
              <div className="space-y-2">
                <div 
                  className="flex items-center text-sm"
                  style={{
                    color: isDarkMode ? '#fae8ff' : '#000000'
                  }}
                >
                  <span className="mr-2 text-lg">✅</span>
                  <span className="font-semibold">{Object.keys(SIGNS_DATABASE).length} professional medical signs</span>
                </div>
                <div 
                  className="flex items-center text-sm"
                  style={{
                    color: isDarkMode ? '#fae8ff' : '#000000'
                  }}
                >
                  <span className="mr-2 text-lg">✅</span>
                  <span className="font-semibold">Validated by AVST sign language experts</span>
                </div>
                <div 
                  className="flex items-center text-sm"
                  style={{
                    color: isDarkMode ? '#fae8ff' : '#000000'
                  }}
                >
                  <span className="mr-2 text-lg">✅</span>
                  <span className="font-semibold">Dedicated to deaf community accessibility</span>
                </div>
              </div>
            </div>

            {/* Animation Speed Slider */}
            <div className={`mt-6 p-4 rounded-xl border-2 ${isDarkMode ? 'bg-gradient-to-br from-gray-50 to-gray-100 border-purple-300' : 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-400'} shadow-md`}>
              <div className="flex items-center justify-between mb-3">
                <label className={`text-lg font-bold bg-gradient-to-r ${currentPalette.primary} bg-clip-text text-transparent`}>⏱️ Animation Speed</label>
                <span className={`text-2xl font-bold bg-gradient-to-r ${currentPalette.primary} bg-clip-text text-transparent`}>{animationSpeed.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.25"
                max="2"
                step="0.25"
                value={animationSpeed}
                onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
                className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, ${colorHexMap[colorblindType]} 0%, ${colorHexMap[colorblindType]} ${(animationSpeed - 0.25) / (2 - 0.25) * 100}%, #e5e7eb ${(animationSpeed - 0.25) / (2 - 0.25) * 100}%, #e5e7eb 100%)`
                }}
              />
              <div className="flex justify-between text-xs font-semibold text-gray-600 mt-2">
                <span>0.25x (Slow)</span>
                <span>1x (Normal)</span>
                <span>2x (Fast)</span>
              </div>
            </div>

            {/* Sign History */}
            {signHistory.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg md:text-xl font-medium mb-2 text-gray-700">
                  {t('history')}:
                </h3>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {signHistory.map((sign, index) => (
                    <button
                      key={index}
                      onClick={() => handleHistorySignClick(sign)}
                      className={`flex-shrink-0 p-2 rounded-lg hover:bg-gray-200 border ${
                        sign.videoFile
                          ? 'bg-blue-50 border-blue-200'
                          : 'bg-gray-100 border-gray-300'
                      }`}
                      aria-label={`${sign.arabic || sign.id} - ${sign.english}`}
                    >
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{sign.arabic || sign.id}</span>
                        {sign.videoFile && (
                          <span className="text-xs text-blue-600">🎬</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - 3D Avatar */}
          <div className={`${currentPalette.card} backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden flex flex-col ${currentPalette.cardBorder} border`}>
            <div className="flex-grow relative">
              <Canvas camera={{ position: [0, 2, 8], fov: 45 }} style={{ background: 'white' }}>
                <color attach="background" args={['#ffffff']} />
                <ambientLight intensity={0.8} />
                <pointLight position={[5, 5, 5]} intensity={1} />
                <pointLight position={[-5, -5, -5]} intensity={0.6} color="#60a5fa" />
                
                <DeepMotionAvatar 
                  currentSign={currentSign}
                  isSigning={isSigning}
                  onAnimationComplete={() => setIsSigning(false)}
                  speed={animationSpeed}
                  colorblindType={colorblindType}
                  modelColors={modelColorMap[colorblindType]}
                />
                
                <OrbitControls enableZoom={true} enablePan={true} />
                
                {/* Display sign text in 3D */}
                {currentSign && (
                  <Text
                    position={[0, -1.8, 0]}
                    fontSize={0.2}
                    color="white"
                    anchorX="center"
                    anchorY="middle"
                  >
                    {currentSign.arabic || currentSign.id}: {currentSign.english}
                  </Text>
                )}
              </Canvas>
              
              {/* Status Overlay */}
              <div className="absolute top-4 left-4">
                <div className={`px-4 py-2 rounded-lg font-semibold ${
                  isSigning 
                    ? 'bg-green-600 text-white animate-pulse' 
                    : 'bg-gray-800 text-gray-300'
                }`}>
                  {isSigning ? '🔄 SIGNING...' : '✅ READY'}
                </div>
              </div>
              
              {/* Current Sign Info */}
              {currentSign && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white p-4 rounded-xl backdrop-blur-sm min-w-[200px] text-center">
                  <div className="text-xl font-bold">{currentSign.arabic || currentSign.id}</div>
                  <div className="text-sm opacity-80">
                    {currentSign.english} • {currentSign.french || 'LST Sign'}
                  </div>
                  {currentSign.videoFile && (
                    <div className="text-xs mt-1 text-blue-300">
                      🎬 Video reference available
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Footer Info */}
            <div className="p-4 bg-gray-900 border-t border-gray-800">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    LST Medical Avatar
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {currentSign 
                      ? `Signing: ${currentSign.arabic || currentSign.id}` 
                      : 'Ready for medical communication'
                    }
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">
                    Signs: {Object.keys(SIGNS_DATABASE).length}
                  </div>
                  <div className="text-xs text-gray-500">
                    AVST Validated • Professional Animations
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Video Library Tab */
        <div className="max-w-7xl mx-auto">
          <MedicalVideoPanel 
            onSignSelected={(videoAnim) => {
              setActiveTab('translator');
              setTranscript(videoAnim.arabic);
              activateSign(videoAnim);
            }}
          />
        </div>
      )}

      {/* Stats Footer - Professional */}
      <footer className="mt-8 md:mt-12 text-center">
        <div 
          className="max-w-7xl mx-auto rounded-2xl p-6 border shadow-lg mb-4 backdrop-blur-md"
          style={{
            backgroundImage: isDarkMode 
              ? `linear-gradient(to right, ${colorSchemeMap[colorblindType].hexPrimary}0a, ${colorSchemeMap[colorblindType].hexPrimary}0f)`
              : `linear-gradient(to right, ${colorSchemeMap[colorblindType].hexPrimary}15, ${colorSchemeMap[colorblindType].hexPrimary}25)`,
            borderColor: isDarkMode
              ? `${colorSchemeMap[colorblindType].hexPrimary}4d`
              : `${colorSchemeMap[colorblindType].hexPrimary}66`,
          }}
        >
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div 
              className="px-4 py-2 rounded-lg border"
              style={{
                backgroundColor: isDarkMode 
                  ? `${colorSchemeMap[colorblindType].hexPrimary}33`
                  : `${colorSchemeMap[colorblindType].hexPrimary}15`,
                borderColor: isDarkMode
                  ? `${colorSchemeMap[colorblindType].hexPrimary}80`
                  : `${colorSchemeMap[colorblindType].hexPrimary}66`,
              }}
            >
              <div className={`font-bold ${getTextSizeClass('sm')} ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>🎤 Speech</div>
              <div 
                className={`font-semibold ${getTextSizeClass('lg')}`}
                style={{
                  color: colorSchemeMap[colorblindType].hexPrimary,
                }}
              >{isListening ? 'Active' : 'Ready'}</div>
            </div>
            <div 
              className="px-4 py-2 rounded-lg border"
              style={{
                backgroundColor: isDarkMode 
                  ? `${colorSchemeMap[colorblindType].hexPrimary}33`
                  : `${colorSchemeMap[colorblindType].hexPrimary}15`,
                borderColor: isDarkMode
                  ? `${colorSchemeMap[colorblindType].hexPrimary}80`
                  : `${colorSchemeMap[colorblindType].hexPrimary}66`,
              }}
            >
              <div className={`font-bold ${getTextSizeClass('sm')} ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>✋ Signs</div>
              <div 
                className={`font-semibold ${getTextSizeClass('lg')}`}
                style={{
                  color: colorSchemeMap[colorblindType].hexPrimary,
                }}
              >{Object.keys(SIGNS_DATABASE).length}</div>
            </div>
            <div 
              className="px-4 py-2 rounded-lg border"
              style={{
                backgroundColor: isDarkMode 
                  ? `${colorSchemeMap[colorblindType].hexPrimary}33`
                  : `${colorSchemeMap[colorblindType].hexPrimary}15`,
                borderColor: isDarkMode
                  ? `${colorSchemeMap[colorblindType].hexPrimary}80`
                  : `${colorSchemeMap[colorblindType].hexPrimary}66`,
              }}
            >
              <div className={`font-bold ${getTextSizeClass('sm')} ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>⏱️ Status</div>
              <div 
                className={`font-semibold ${getTextSizeClass('lg')}`}
                style={{
                  color: colorSchemeMap[colorblindType].hexPrimary,
                }}
              >{isSigning ? 'Signing' : 'Ready'}</div>
            </div>
          </div>
          <div className={`${getTextSizeClass('sm')} space-y-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>
            <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Built for AVST • Maratech Hackathon 2026
            </p>
            <p style={{
              color: colorSchemeMap[colorblindType].hexPrimary,
            }}>
              Medical Tunisian Sign Language Communication • React + Three.js + Web Speech API
            </p>
            <p 
              className={`${getTextSizeClass('xs')} mt-2`}
              style={{
                color: colorSchemeMap[colorblindType].hexPrimary,
              }}
            >
              Partnership: Association Voix du Sourd de Tunisie (AVST) • Experts: Sabri Ghassen, Ben Romdhane Taha, Ben Ticha Nour, Oueslati Azzouz, Ben Tarbout Mondher, Koukene Houssem
            </p>
          </div>
        </div>
        <p className={`text-xs ${isDarkMode ? 'text-purple-300' : 'text-blue-600'}`}>
          🌍 Empowering deaf and hard-of-hearing communities through accessible technology
        </p>
      </footer>
    </div>
  );
}