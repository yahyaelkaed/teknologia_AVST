import { useState, useRef } from 'react';
import { getAllVideoAnimations, getAnimationsByCategory } from '../signs/data/videoAnimations';

export function MedicalVideoPanel({ onSignSelected }) {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const videoRef = useRef(null);
  
  const categories = ['all', 'medical', 'administrative', 'communication', 'personal'];
  const allAnimations = getAllVideoAnimations();
  
  const filteredAnimations = selectedCategory === 'all' 
    ? allAnimations
    : getAnimationsByCategory(selectedCategory);

  const playVideo = (animation) => {
    setSelectedVideo(animation);
    if (videoRef.current) {
      // Fix file path - remove spaces or encode
      const fixedPath = animation.videoFile.replace(/ /g, '%20');
      videoRef.current.src = fixedPath;
      videoRef.current.load();
      videoRef.current.play().catch(e => {
        console.error('Video error:', e);
        // Try alternative path
        const altPath = `/videos/${animation.id}.mp4`;
        videoRef.current.src = altPath;
        videoRef.current.play().catch(e2 => {
          alert(`Cannot play: ${animation.videoFile}\nMake sure video is in public/videos/`);
        });
      });
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-900 to-blue-900 rounded-xl text-white">
      <h2 className="text-2xl font-bold mb-2">🏥 Medical & Administrative LST Videos</h2>
      <p className="text-gray-300 mb-6">Your actual Tunisian Sign Language videos</p>
      
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-lg capitalize transition-all ${
              selectedCategory === cat 
                ? 'bg-blue-600 shadow-lg' 
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            {cat === 'all' ? 'All Videos' : cat}
          </button>
        ))}
      </div>

      {/* Video Player */}
      {selectedVideo && (
        <div className="mb-8 p-4 bg-black/50 rounded-xl backdrop-blur-sm border border-blue-500">
          <div className="flex items-center gap-3 mb-3">
            <div className="text-3xl">🎬</div>
            <div>
              <h3 className="text-xl font-bold">{selectedVideo.arabic}</h3>
              <p className="text-gray-400">
                {selectedVideo.english} • {selectedVideo.french}
              </p>
            </div>
          </div>
          
          <video
            ref={videoRef}
            controls
            className="w-full rounded-lg mb-4"
            poster="/videos/thumbnail.jpg"
          />
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-300">
              Category: <span className="text-blue-300">{selectedVideo.category}</span>
            </div>
            <button
              onClick={() => onSignSelected?.(selectedVideo)}
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg hover:from-green-700 hover:to-emerald-700 font-semibold"
            >
              ✨ Use This Sign
            </button>
          </div>
        </div>
      )}

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAnimations.map((anim) => (
          <button
            key={anim.id}
            onClick={() => playVideo(anim)}
            className={`p-4 rounded-xl text-left transition-all hover:scale-[1.02] ${
              selectedVideo?.id === anim.id
                ? 'bg-blue-800 border-2 border-blue-400'
                : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            <div className="flex items-start gap-3 mb-2">
              <div className="text-2xl">
                {anim.category === 'medical' ? '🏥' : 
                 anim.category === 'administrative' ? '📋' :
                 anim.category === 'communication' ? '💬' : '👤'}
              </div>
              <div className="flex-1">
                <div className="font-bold text-lg mb-1">{anim.arabic}</div>
                <div className="text-sm text-gray-400">{anim.english}</div>
                <div className="text-xs text-gray-500">{anim.french}</div>
              </div>
            </div>
            
            <div className="text-xs text-blue-300 mt-2">
              Click to watch LST video
            </div>
            
            <div className="flex justify-between items-center mt-3">
              <span className="text-xs px-2 py-1 bg-gray-700 rounded">
                {anim.category}
              </span>
              <span className="text-xs text-gray-400">
                {anim.duration}s
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="mt-8 p-4 bg-gray-800/50 rounded-lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-300">{allAnimations.length}</div>
            <div className="text-sm text-gray-400">Total Videos</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-300">
              {getAnimationsByCategory('medical').length}
            </div>
            <div className="text-sm text-gray-400">Medical Terms</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-300">
              {getAnimationsByCategory('administrative').length}
            </div>
            <div className="text-sm text-gray-400">Administrative</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-300">
              {getAnimationsByCategory('communication').length}
            </div>
            <div className="text-sm text-gray-400">Communication</div>
          </div>
        </div>
      </div>
    </div>
  );
}