import { useState, useRef } from 'react';
import { getAllVideoSigns } from '../data/videoLibrary';

export function VideoReferencePanel({ onSignSelected }) {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const videoRef = useRef(null);
  const videoSigns = getAllVideoSigns();

  const playVideo = (videoSign) => {
    setSelectedVideo(videoSign);
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(e => {
        console.error('Failed to play video:', e);
        alert(`Video not found: ${videoSign.videoFile}\nMake sure it's in public/videos/ folder`);
      });
    }
  };

  return (
    <div className="p-6 bg-gray-900 rounded-xl text-white">
      <h2 className="text-2xl font-bold mb-4">🎬 LST Video Reference Library</h2>
      
      {/* Video Player */}
      {selectedVideo && (
        <div className="mb-6 bg-black rounded-lg p-4">
          <h3 className="text-xl font-semibold mb-2">
            {selectedVideo.arabic} - {selectedVideo.english}
          </h3>
          <video
            ref={videoRef}
            src={selectedVideo.videoFile}
            controls
            className="w-full rounded-lg mb-2"
          />
          <p className="text-sm text-gray-400">
            Actual Tunisian Sign Language (LST) reference
          </p>
          <button
            onClick={() => {
              onSignSelected?.(selectedVideo);
            }}
            className="mt-3 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            ✨ Use This Sign in Avatar
          </button>
        </div>
      )}
      
      {/* Video Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {videoSigns.map((sign) => (
          <button
            key={sign.id}
            onClick={() => playVideo(sign)}
            className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all text-left group"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center text-2xl">
                🎬
              </div>
              <div>
                <div className="font-bold text-xl">{sign.arabic}</div>
                <div className="text-sm text-gray-400">{sign.english}</div>
              </div>
            </div>
            
            <div className="text-xs text-gray-500 mt-2">
              Duration: {sign.animation.duration}s
            </div>
            
            <div className="mt-2 text-xs text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity">
              Click to play video
            </div>
          </button>
        ))}
      </div>
      
      {/* Instructions */}
      <div className="mt-6 p-4 bg-gray-800 rounded-lg">
        <h4 className="font-semibold mb-2">How it works:</h4>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>Click any sign to see the actual LST video</li>
          <li>The avatar animation matches the video movement</li>
          <li>Use "Use This Sign" to test the avatar animation</li>
          <li>All videos are from your local collection</li>
        </ul>
      </div>
    </div>
  );
}