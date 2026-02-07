import { useRef, useState } from "react";

export default function RecordSignSimulation() {
  const videoRef = useRef(null);
  const [signName, setSignName] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentVideo, setCurrentVideo] = useState(null);

  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const videoUrl = URL.createObjectURL(file);
    setCurrentVideo(videoUrl);
    
    if (videoRef.current) {
      videoRef.current.src = videoUrl;
    }
  };

  const startRecording = () => {
    if (!signName.trim()) {
      alert("Please enter a sign name first!");
      return;
    }
    
    setIsRecording(true);
    setProgress(0);
    
    // Simulate recording progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsRecording(false);
            generateAnimationData();
          }, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  const generateAnimationData = () => {
    // Generate realistic animation data based on sign type
    const animationData = {
      signName: signName,
      arabic: signName,
      english: getEnglishTranslation(signName),
      duration: 2.0,
      frames: generateFramesForSign(signName),
      frameCount: 60,
      recordedAt: new Date().toISOString(),
      videoSource: currentVideo || "simulated",
      isSimulated: true
    };

    // Download JSON
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(animationData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${signName}_animation.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    
    alert(`✅ Generated "${signName}" animation with 60 frames!\nThis is simulated data for the hackathon demo.`);
  };

  const generateFramesForSign = (signName) => {
    const frames = [];
    const signType = getSignType(signName);
    
    for (let i = 0; i < 60; i++) {
      const progress = i / 60;
      const time = progress * 2.0; // 2 second animation
      
      let bones = {};
      
      switch(signType) {
        case 'analysis':
          // تحليل - thinking/wave motion
          bones = {
            'mixamorigRightShoulder': {
              x: Math.sin(progress * Math.PI * 2) * 0.3,
              y: Math.cos(progress * Math.PI) * 0.2,
              z: 0
            },
            'mixamorigRightForeArm': {
              x: 0.3 + Math.sin(progress * Math.PI) * 0.2,
              y: 0,
              z: Math.sin(progress * Math.PI * 2) * 0.1
            },
            'mixamorigLeftShoulder': {
              x: Math.sin(progress * Math.PI * 2 + 0.5) * 0.3,
              y: Math.cos(progress * Math.PI + 0.5) * 0.2,
              z: 0
            }
          };
          break;
          
        case 'medicine':
          // دواء - hand to mouth
          bones = {
            'mixamorigRightShoulder': {
              x: progress * 0.6,
              y: -0.3,
              z: 0
            },
            'mixamorigRightForeArm': {
              x: progress * 0.8,
              y: 0,
              z: 0.1
            }
          };
          break;
          
        case 'attention':
          // انتباه - pointing
          bones = {
            'mixamorigRightShoulder': {
              x: 0.2,
              y: -0.4,
              z: 0
            },
            'mixamorigRightForeArm': {
              x: 0.7,
              y: 0,
              z: 0
            }
          };
          break;
          
        default:
          // Generic wave
          bones = {
            'mixamorigRightShoulder': {
              x: Math.sin(progress * Math.PI * 2) * 0.2,
              y: 0,
              z: 0
            },
            'mixamorigRightForeArm': {
              x: Math.sin(progress * Math.PI * 2) * 0.3,
              y: 0,
              z: Math.sin(progress * Math.PI) * 0.1
            }
          };
      }
      
      frames.push({
        time: time,
        bones: bones
      });
    }
    
    return frames;
  };

  const getSignType = (signName) => {
    const types = {
      'تحليل': 'analysis',
      'تقييم': 'analysis',
      'دواء': 'medicine',
      'انتباه': 'attention',
      'إعاقة': 'disability',
      'مترجم': 'interpreter'
    };
    return types[signName] || 'generic';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-blue-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-2">🎬 Generate LST Animations (Simulation)</h1>
      <p className="text-gray-300 mb-6">Generate realistic animation data for the hackathon demo</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {/* Left Panel */}
        <div className="space-y-6">
          <div>
            <label className="block mb-2 font-medium">Sign Name (Arabic):</label>
            <input
              type="text"
              value={signName}
              onChange={(e) => setSignName(e.target.value)}
              placeholder="تحليل, دواء, انتباه..."
              className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700"
            />
          </div>
          
          <div>
            <label className="block mb-2 font-medium">Optional: Upload LST Video for Reference:</label>
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoUpload}
              className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700"
            />
            <p className="text-sm text-gray-400 mt-1">
              Video is only for reference, not processed
            </p>
          </div>
          
          <button
            onClick={startRecording}
            disabled={!signName || isRecording}
            className={`w-full py-4 rounded-lg font-bold text-lg ${
              isRecording
                ? 'bg-gradient-to-r from-yellow-600 to-orange-600'
                : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
            }`}
          >
            {isRecording ? `⚡ Generating... ${progress}%` : '⚡ Generate Animation Data'}
          </button>
          
          {isRecording && (
            <div className="p-4 bg-blue-900/50 rounded-lg border border-blue-500">
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="text-center mt-2 text-sm">
                Generating realistic animation for "{signName}"
              </div>
            </div>
          )}
        </div>
        
        {/* Right Panel */}
        <div>
          {currentVideo && (
            <div className="mb-6">
              <h3 className="font-medium mb-2">Video Reference:</h3>
              <video
                ref={videoRef}
                controls
                className="w-full rounded-lg"
                style={{ height: '200px' }}
              />
            </div>
          )}
          
          <div className="p-4 bg-gray-800/50 rounded-lg">
            <h3 className="font-semibold mb-2">🎯 How this works:</h3>
            <ol className="list-decimal pl-5 space-y-2 text-sm">
              <li>Enter Arabic sign name</li>
              <li>Optional: Upload video for reference</li>
              <li>Click "Generate Animation Data"</li>
              <li>System creates realistic bone animation</li>
              <li>Downloads JSON file with 60 frames</li>
              <li>Use JSON in main translator app</li>
            </ol>
            <div className="mt-3 p-3 bg-gray-900/50 rounded">
              <p className="text-yellow-300 text-sm">
                ⚡ <strong>Hackathon Mode:</strong> This generates realistic animations without complex MediaPipe setup.
              </p>
            </div>
          </div>
          
          <div className="mt-6">
            <a 
              href="/" 
              className="block w-full py-3 bg-gray-800 text-center rounded-lg hover:bg-gray-700"
            >
              ← Back to Translator
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function getEnglishTranslation(arabic) {
  const translations = {
    'تحليل': 'analysis',
    'دواء': 'medicine',
    'انتباه': 'attention',
    'إعاقة': 'disability',
    'مترجم': 'interpreter',
    'طبيب': 'doctor',
    'مساعدة': 'help',
    'ألم': 'pain'
  };
  return translations[arabic] || arabic;
}