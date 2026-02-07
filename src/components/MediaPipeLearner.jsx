import { useState, useRef, useEffect } from 'react';
import { MediaPipePoseExtractor } from '../utils/mediaPipePoseExtractor';
import * as THREE from 'three';

export function MediaPipeLearner({ onAnimationLearned }) {
  const [learning, setLearning] = useState(false);
  const [signName, setSignName] = useState('');
  const [progress, setProgress] = useState(0);
  const [learnedSigns, setLearnedSigns] = useState([]);
  const [previewVideo, setPreviewVideo] = useState(null);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const poseExtractorRef = useRef(null);
  
  // Initialize MediaPipe
  useEffect(() => {
    poseExtractorRef.current = new MediaPipePoseExtractor();
    poseExtractorRef.current.initialize();
    
    return () => {
      // Cleanup
      if (poseExtractorRef.current) {
        poseExtractorRef.current = null;
      }
    };
  }, []);

  const handleVideoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !signName) return;
    
    setLearning(true);
    setProgress(0);
    
    // Create preview URL
    const videoUrl = URL.createObjectURL(file);
    setPreviewVideo(videoUrl);
    
    try {
      // Extract poses using MediaPipe
      const result = await poseExtractorRef.current.extractPosesFromVideo(file, signName);
      
      // Convert poses to animation keyframes
      const keyframes = poseExtractorRef.current.convertPosesToKeyframes(
        result.poses,
        result.duration
      );
      
      // Create animation data
      const learnedAnimation = {
        id: signName.toLowerCase().replace(/\s+/g, '_'),
        arabic: signName,
        english: getEnglishTranslation(signName),
        duration: result.duration,
        keyframes: keyframes,
        sourceVideo: file.name,
        poseCount: result.frameCount,
        learnedAt: new Date().toISOString(),
        isMediaPipeLearned: true
      };
      
      // Convert to Three.js AnimationClip
      const animationClip = createThreeJSAnimation(learnedAnimation);
      learnedAnimation.animationClip = animationClip;
      
      // Update state
      setLearnedSigns(prev => [...prev, learnedAnimation]);
      onAnimationLearned?.(learnedAnimation);
      
      setProgress(100);
      
      alert(`✅ Successfully learned "${signName}"!\nExtracted ${result.frameCount} poses from video.`);
      
    } catch (error) {
      console.error('MediaPipe learning error:', error);
      alert(`❌ Error learning from video: ${error.message}`);
    } finally {
      setLearning(false);
      setProgress(0);
    }
  };

  const createThreeJSAnimation = (animationData) => {
    const tracks = [];
    const keyframes = animationData.keyframes;
    
    // Create rotation tracks for right shoulder
    const shoulderTimes = [];
    const shoulderValues = [];
    
    keyframes.forEach(kf => {
      shoulderTimes.push(kf.time);
      if (kf.rotations?.rightShoulder) {
        const rot = kf.rotations.rightShoulder;
        shoulderValues.push(rot.x, rot.y, rot.z);
      } else {
        shoulderValues.push(0, 0, 0);
      }
    });
    
    if (shoulderTimes.length > 0) {
      const track = new THREE.VectorKeyframeTrack(
        '.bones[mixamorigRightShoulder].rotation',
        shoulderTimes,
        shoulderValues
      );
      tracks.push(track);
    }
    
    // Create AnimationClip
    return new THREE.AnimationClip(
      animationData.id,
      animationData.duration,
      tracks
    );
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-900 to-blue-900 rounded-xl text-white">
      <h2 className="text-2xl font-bold mb-2">🤖 MediaPipe AI Learning</h2>
      <p className="text-gray-300 mb-6">Extract real poses from LST videos using AI</p>
      
      <div className="space-y-4 mb-6">
        <div>
          <label className="block mb-2 font-medium">Sign Name (Arabic):</label>
          <input
            type="text"
            value={signName}
            onChange={(e) => setSignName(e.target.value)}
            placeholder="تحليل, دواء, انتباه..."
            className="w-full p-3 bg-gray-800 rounded-lg text-lg border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label className="block mb-2 font-medium">Upload LST Video:</label>
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoUpload}
            className="w-full p-3 bg-gray-800 rounded-lg border border-gray-700"
            disabled={!signName || learning}
          />
          <p className="text-sm text-gray-400 mt-1">
            MediaPipe will analyze the video and extract pose data
          </p>
        </div>
        
        {learning && (
          <div className="p-4 bg-blue-900/50 rounded-lg border border-blue-500">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-2xl">🤖</div>
              <div className="flex-1">
                <div className="font-semibold">AI Processing Video...</div>
                <div className="text-sm text-blue-300">
                  Extracting poses for: "{signName}"
                </div>
              </div>
              <div className="text-xl">{progress}%</div>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
        
        {/* Video Preview */}
        {previewVideo && (
          <div className="mt-4">
            <h3 className="font-medium mb-2">Video Preview:</h3>
            <video
              ref={videoRef}
              src={previewVideo}
              controls
              className="w-full rounded-lg"
            />
            <canvas
              ref={canvasRef}
              className="hidden"
            />
          </div>
        )}
      </div>
      
      {/* Learned Signs */}
      {learnedSigns.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-3">
            ✅ AI-Learned Signs ({learnedSigns.length})
          </h3>
          <div className="space-y-3">
            {learnedSigns.map((sign, index) => (
              <div key={index} className="p-4 bg-gray-800/50 rounded-lg border border-green-500/30">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-lg">{sign.arabic}</div>
                    <div className="text-gray-400">{sign.english}</div>
                  </div>
                  <span className="px-3 py-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full text-xs font-medium">
                    AI-LEARNED
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                  <div className="text-center p-2 bg-gray-900/50 rounded">
                    <div className="font-bold">{sign.poseCount}</div>
                    <div className="text-xs text-gray-400">Poses</div>
                  </div>
                  <div className="text-center p-2 bg-gray-900/50 rounded">
                    <div className="font-bold">{sign.duration.toFixed(1)}s</div>
                    <div className="text-xs text-gray-400">Duration</div>
                  </div>
                  <div className="text-center p-2 bg-gray-900/50 rounded">
                    <div className="font-bold">{sign.keyframes?.length || 0}</div>
                    <div className="text-xs text-gray-400">Keyframes</div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Source: {sign.sourceVideo}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
        <h4 className="font-semibold mb-2">How MediaPipe AI Learning Works:</h4>
        <ol className="list-decimal pl-5 space-y-2 text-sm">
          <li>Upload LST video</li>
          <li>MediaPipe AI analyzes each frame</li>
          <li>Extracts 3D pose landmarks (33 body points + 21 hand points)</li>
          <li>Converts landmarks to bone rotations</li>
          <li>Creates animation keyframes</li>
          <li>Avatar mimics EXACT same movements as video</li>
        </ol>
        <div className="mt-3 text-xs text-gray-400">
          Powered by Google MediaPipe • Real-time pose estimation
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