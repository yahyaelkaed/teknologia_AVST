import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { useState } from 'react';
import './App.css';
import { SIGNS_DATABASE, getPrioritySigns, findSignByArabic } from './signs/data/signsDatabase';
import ProfessionalAvatar from './components/XBotAvatar';
import DeepMotionAvatar from './components/DeepMotionAvatar';
import { MedicalVideoPanel } from './components/MedicalVideoPanel';
import { getProfessionalAnimation } from './signs/data/professionalAnimations';

export default function MainTranslator() {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [currentSign, setCurrentSign] = useState(null);
  const [isSigning, setIsSigning] = useState(false);
  const [signHistory, setSignHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('translator');

  const prioritySigns = getPrioritySigns(10);

  const startListening = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new webkitSpeechRecognition();
      recognition.lang = 'ar-SA';
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
      alert('Speech recognition not supported. Use Chrome browser.');
    }
  };

  const triggerSignFromText = (text) => {
    const professionalAnim = getProfessionalAnimation(text.trim());
    if (professionalAnim) {
      activateSign(professionalAnim);
      return;
    }

    const arabicWords = text.split(' ');
    for (const word of arabicWords) {
      const signMatch = findSignByArabic(word);
      if (signMatch) {
        activateSign(signMatch);
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
    triggerSignFromText(transcript);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-4 md:p-8">
      <header className="text-center mb-6 md:mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-800">
          🏥 Tunisian Medical LST Translator
        </h1>
        <p className="text-gray-600 mt-2 text-sm md:text-base">
          Voice to Tunisian Sign Language (LST) for Medical Communication
        </p>
      </header>

      {/* Tabs Navigation */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex border-b border-gray-300 bg-white rounded-t-xl overflow-hidden">
          <button
            className={`flex-1 px-6 py-4 font-semibold text-lg transition-all ${
              activeTab === 'translator' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab('translator')}
          >
            🎤 Live Translator
          </button>
          <button
            className={`flex-1 px-6 py-4 font-semibold text-lg transition-all ${
              activeTab === 'videos' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab('videos')}
          >
            🎬 LST Video Library
          </button>
        </div>
      </div>

      {activeTab === 'translator' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 max-w-7xl mx-auto">
          {/* Left Panel - Controls */}
          <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6">
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-blue-800">
              🎤 Medical Communication Panel
            </h2>
            
            {/* Speech Recognition */}
            <button
              onClick={startListening}
              disabled={isListening}
              className={`w-full py-3 md:py-4 rounded-xl text-white font-bold text-base md:text-lg flex items-center justify-center gap-3 mb-6 transition-all ${
                isListening 
                  ? 'bg-red-500 animate-pulse' 
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
              }`}
            >
              {isListening ? (
                <>
                  <span className="animate-ping absolute h-4 w-4 rounded-full bg-white opacity-75"></span>
                  🎤 Listening... Speak Medical Terms
                </>
              ) : (
                <>🎤 Speak Medical Terms (Arabic)</>
              )}
            </button>

            {/* Recognized Text */}
            <div className="mb-6">
              <h3 className="text-lg md:text-xl font-medium mb-2 text-gray-700">
                Recognized Text:
              </h3>
              <div className="bg-gray-50 p-4 rounded-xl min-h-[80px] border-2 border-blue-100">
                <p className="text-lg md:text-xl text-gray-800 font-medium">
                  {transcript || 'Say: "تحليل" (analysis), "انتباه" (attention), "دواء" (medicine)'}
                </p>
                {currentSign && (
                  <div className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-blue-700 font-semibold">
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
              <h3 className="text-lg md:text-xl font-medium mb-2 text-gray-700">
                Or Type Medical Text:
              </h3>
              <div className="flex gap-2">
                <textarea
                  className="w-full h-32 p-4 border-2 border-gray-300 rounded-xl resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  placeholder="Type Arabic medical text here... (e.g., تحليل، دواء، إعاقة)"
                  onChange={(e) => setTranscript(e.target.value)}
                  value={transcript}
                />
                <button
                  onClick={handleTextSubmit}
                  className="self-end mb-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
                >
                  Sign
                </button>
              </div>
            </div>

            {/* Quick Sign Buttons */}
            <div className="mb-6">
              <h3 className="text-lg md:text-xl font-medium mb-2 text-gray-700">
                Quick Medical Signs:
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {[
                  { arabic: 'تحليل', english: 'analysis' },
                  { arabic: 'دواء', english: 'medicine' },
                  { arabic: 'إعاقة', english: 'disability' },
                  { arabic: 'انتباه', english: 'attention' },
                  { arabic: 'تقييم', english: 'evaluation' },
                  { arabic: 'مترجم', english: 'interpreter' },
                  { arabic: 'طبيب', english: 'doctor' },
                  { arabic: 'مساعدة', english: 'help' },
                  { arabic: 'ألم', english: 'pain' },
                ].map((sign) => (
                  <button
                    key={sign.arabic}
                    onClick={() => {
                      setTranscript(sign.arabic);
                      const anim = getProfessionalAnimation(sign.arabic) || {
                        arabic: sign.arabic,
                        english: sign.english,
                        id: sign.english.toLowerCase()
                      };
                      activateSign(anim);
                    }}
                    className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white flex flex-col items-center"
                  >
                    <span className="font-bold text-lg">{sign.arabic}</span>
                    <span className="text-sm opacity-90">{sign.english}</span>
                    <span className="text-xs mt-1">✨</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Professional System Info */}
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                ✨ Professional LST Animations
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                This system uses professional Tunisian Sign Language animations 
                validated by AVST experts.
              </p>
              <div className="flex items-center text-sm text-gray-700">
                <span className="mr-2">✅</span>
                <span>{Object.keys(SIGNS_DATABASE).length} medical signs</span>
              </div>
              <div className="flex items-center text-sm text-gray-700 mt-1">
                <span className="mr-2">✅</span>
                <span>AVST validated movements</span>
              </div>
            </div>

            {/* Sign History */}
            {signHistory.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg md:text-xl font-medium mb-2 text-gray-700">
                  Recent Signs:
                </h3>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {signHistory.map((sign, index) => (
                    <button
                      key={index}
                      onClick={() => activateSign(sign)}
                      className={`flex-shrink-0 p-2 rounded-lg hover:bg-gray-200 border ${
                        sign.videoFile
                          ? 'bg-blue-50 border-blue-200'
                          : 'bg-gray-100 border-gray-300'
                      }`}
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
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl shadow-xl overflow-hidden flex flex-col">
            <div className="flex-grow relative">
              <Canvas camera={{ position: [0, 2, 8], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[5, 5, 5]} intensity={0.8} />
                <pointLight position={[-5, -5, -5]} intensity={0.4} color="#60a5fa" />
                
                <DeepMotionAvatar 
                  currentSign={currentSign}
                  isSigning={isSigning}
                  onAnimationComplete={() => setIsSigning(false)}
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

      {/* Stats Footer */}
      <footer className="mt-6 md:mt-8 text-center text-gray-600 text-sm">
        <div className="flex flex-wrap justify-center gap-4 mb-2">
          <div className="px-3 py-1 bg-blue-100 rounded-full">
            🎤 Speech: {isListening ? 'Active' : 'Ready'}
          </div>
          <div className="px-3 py-1 bg-green-100 rounded-full">
            ✋ Signs: {Object.keys(SIGNS_DATABASE).length}
          </div>
          <div className="px-3 py-1 bg-purple-100 rounded-full">
            ⏱️ Animating: {isSigning ? 'Yes' : 'No'}
          </div>
        </div>
        <p className="text-gray-500">
          Built for AVST Hackathon • Medical LST Communication • React + Three.js
        </p>
      </footer>
    </div>
  );
}