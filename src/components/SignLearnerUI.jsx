// src/components/SignLearnerUI.jsx
import { useState } from 'react';

export function SignLearnerUI({ onSignLearned }) {
  const [learningSign, setLearningSign] = useState(false);
  const [currentSignName, setCurrentSignName] = useState('');
  const [learnedSigns, setLearnedSigns] = useState([]);

  const handleLearnSign = async (signName, videoFile) => {
    setLearningSign(true);
    
    // Simulate learning process
    setTimeout(() => {
      const learnedSign = {
        id: signName,
        arabic: signName,
        english: getEnglishTranslation(signName),
        keyPoses: generateKeyPoses(signName),
        duration: 2.0,
        learnedFrom: videoFile.name
      };
      
      setLearnedSigns(prev => [...prev, learnedSign]);
      onSignLearned?.(learnedSign);
      setLearningSign(false);
      
      alert(`✅ Learned sign: ${signName} from video!`);
    }, 2000);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file || !currentSignName) return;
    
    handleLearnSign(currentSignName, file);
  };

  return (
    <div className="p-6 bg-gray-800 rounded-xl text-white">
      <h2 className="text-2xl font-bold mb-4">🎓 Learn Signs from Videos</h2>
      
      <div className="space-y-4">
        {/* Sign Name Input */}
        <div>
          <label className="block mb-2">Sign Name (Arabic):</label>
          <input
            type="text"
            value={currentSignName}
            onChange={(e) => setCurrentSignName(e.target.value)}
            placeholder="طبيب, مساعدة, ألم..."
            className="w-full p-2 bg-gray-700 rounded"
          />
        </div>
        
        {/* Video Upload */}
        <div>
          <label className="block mb-2">Upload LST Video:</label>
          <input
            type="file"
            accept="video/*"
            onChange={handleFileUpload}
            className="w-full p-2 bg-gray-700 rounded"
            disabled={!currentSignName || learningSign}
          />
        </div>
        
        {/* Learning Status */}
        {learningSign && (
          <div className="p-3 bg-blue-900 rounded animate-pulse">
            🧠 Learning sign "{currentSignName}" from video...
          </div>
        )}
        
        {/* Learned Signs List */}
        {learnedSigns.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">✅ Learned Signs:</h3>
            <div className="grid grid-cols-2 gap-2">
              {learnedSigns.map((sign, index) => (
                <div key={index} className="p-3 bg-gray-700 rounded">
                  <div className="font-bold">{sign.arabic}</div>
                  <div className="text-sm text-gray-400">{sign.english}</div>
                  <div className="text-xs text-gray-500">
                    {sign.keyPoses.length} key poses • {sign.duration}s
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Instructions */}
        <div className="mt-4 p-3 bg-gray-900 rounded text-sm">
          <p className="font-semibold mb-1">How it works:</p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Enter the Arabic sign name</li>
            <li>Upload a video of the LST sign</li>
            <li>System learns the movement pattern</li>
            <li>Sign is added to database</li>
            <li>Can be triggered by speech/text</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

// Helper functions
function getEnglishTranslation(arabic) {
  const translations = {
    'طبيب': 'doctor',
    'مساعدة': 'help',
    'ألم': 'pain',
    'مستشفى': 'hospital'
  };
  return translations[arabic] || arabic;
}

function generateKeyPoses(signName) {
  // Generate simulated key poses based on sign
  const poseTemplates = {
    'طبيب': [
      { time: 0, rightArm: { x: 0, y: 0, z: 0 } },
      { time: 0.5, rightArm: { x: 0.3, y: 0.1, z: 0 } },
      { time: 1.0, rightArm: { x: 0.5, y: 0.2, z: 0 } },
      { time: 1.5, rightArm: { x: 0.3, y: 0.1, z: 0 } },
      { time: 2.0, rightArm: { x: 0, y: 0, z: 0 } }
    ],
    'مساعدة': [
      { time: 0, rightArm: { x: 0, y: 0, z: 0 } },
      { time: 0.5, rightArm: { x: 0.8, y: 0, z: 0 } },
      { time: 1.0, rightArm: { x: 0.9, y: 0, z: 0.1 } },
      { time: 1.5, rightArm: { x: 0, y: 0, z: 0 } }
    ]
  };
  
  return poseTemplates[signName] || poseTemplates['طبيب'];
}