// components/DeepMotionAvatar.jsx
import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default function DeepMotionAvatar({ currentSign, isSigning, onAnimationComplete }) {
  const groupRef = useRef();
  const mixerRef = useRef(null);
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [animationClip, setAnimationClip] = useState(null);
  
  // Debug: Check if animation is playing
  const [debugTime, setDebugTime] = useState(0);

  // Load model and animation
  useEffect(() => {
    console.log('🔄 Loading DeepMotion model...');
    setLoading(true);
    
    const loader = new GLTFLoader();
    loader.load(
      '/models/analyse_default.glb',
      (gltf) => {
        console.log('✅ Model loaded');
        console.log('📊 Animations found:', gltf.animations?.length || 0);
           console.log('🔍 All mesh parts:');
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        console.log(`- "${child.name}" at position:`, child.position);
      }
    });
    
    // Find hands by position (hands are usually at ends of arms)
    gltf.scene.traverse((child) => {
      if (child.isMesh && child.material) {
        // Check if mesh is at hand position (far from center on X axis)
        const pos = child.position;
        if (Math.abs(pos.x) > 0.5 || Math.abs(pos.y) > 1.5) { // Adjust these values
          console.log(`🎨 Coloring hand/finger part: "${child.name}" at`, pos);
          child.material.color.set('#FF0000'); // Red
          child.material.needsUpdate = true;
        }
      }
    });
    
    setModel(gltf.scene);
        
        if (gltf.animations && gltf.animations.length > 0) {
          gltf.animations.forEach((anim, i) => {
            console.log(`  ${i}: "${anim.name}" (${anim.duration}s, ${anim.tracks.length} tracks)`);
          });
        }
        
        // IMPORTANT: Don't clone, use the original scene
        setModel(gltf.scene);
        
        // Store animation clip
        if (gltf.animations && gltf.animations.length > 0) {
          // Find the correct animation (usually first one)
          const clip = gltf.animations[0];
          console.log(`🎭 Selected animation: "${clip.name}"`);
          setAnimationClip(clip);
          
          // Create mixer
          mixerRef.current = new THREE.AnimationMixer(gltf.scene);
        }
        
        setLoading(false);
      },
      undefined,
      (error) => {
        console.error('❌ Model load error:', error);
        setLoading(false);
      }
      
    );

    
    
    return () => {
      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
      }
    };
  }, []);
  

  // Play animation when signing starts
  useEffect(() => {
    if (!isSigning || !currentSign || !model || !animationClip || !mixerRef.current) return;
    
    const arabic = currentSign.arabic || currentSign.id;
    if (arabic !== 'تحليل') return;
    
    console.log('▶️ Starting تحليل animation');
    
    // Stop any existing animation
    mixerRef.current.stopAllAction();
    
    // Create new action from clip
    const action = mixerRef.current.clipAction(animationClip);
    
    // Configure action
    action.reset();
    action.setLoop(THREE.LoopOnce, 1);
    action.clampWhenFinished = true;
    action.timeScale = 1; // Normal speed
    action.time = 0; // Start from beginning
    
    // Play the animation
    action.play();
    
    console.log('🎬 Animation playing...');
    
    // Get duration
    const duration = animationClip.duration * 1000;
    console.log(`⏱️ Duration: ${duration}ms`);
    
    // Debug: Start tracking time
    let startTime = Date.now();
    const debugInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setDebugTime(elapsed);
    }, 100);
    
    // Completion timer
    const completionTimer = setTimeout(() => {
      console.log('✅ Animation completed');
      clearInterval(debugInterval);
      if (onAnimationComplete) onAnimationComplete();
    }, duration);
    
    // Cleanup
    return () => {
      clearTimeout(completionTimer);
      clearInterval(debugInterval);
      if (action) {
        action.stop();
      }
    };
  }, [isSigning, currentSign, model, animationClip, onAnimationComplete]);

  // CRITICAL: Update mixer every frame
  useFrame((state, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta);
      
      // Debug: Show current time
      if (isSigning && currentSign?.arabic === 'تحليل') {
        const rootAction = mixerRef.current._actions[0];
        if (rootAction) {
          console.log(`🔄 Frame update: time=${rootAction.time.toFixed(2)}/${rootAction.getClip().duration.toFixed(2)}`);
        }
      }
    }
  });

  // Force animation test button
  const testAnimation = () => {
    if (!model || !animationClip || !mixerRef.current) {
      console.warn('Cannot test: missing requirements');
      return;
    }
    
    console.log('🔧 MANUAL TEST: Playing animation');
    
    mixerRef.current.stopAllAction();
    const action = mixerRef.current.clipAction(animationClip);
    action.reset().play();
  };

  if (loading) {
    return (
      <Text position={[0, 0, 0]} fontSize={0.3} color="#4CAF50" anchorX="center">
        ⏳ Loading تحليل model...
      </Text>
    );
  }

  return (
    <group ref={groupRef}>
      {/* Test button in 3D space */}
      {model && (
        <Text
          position={[0, 4, 0]}
          fontSize={0.2}
          color="#FF9800"
          anchorX="center"
          onClick={testAnimation}
        >
        </Text>
      )}
      
      {model && (
        <primitive
          object={model}
          scale={5}  // Try 5, 10, 20
          position={[0, -3, 0]}  // Adjusted position
          rotation={[0, 0, 0]}
        />
      )}
      
      {/* Debug info */}
      {model && animationClip && (
        <Text
          position={[0, 2, 0]}
          fontSize={0.2}
          color="white"
          anchorX="center"
        >
          
        </Text>
      )}
      
      {isSigning && currentSign?.arabic === 'تحليل' && (
        <Text
          position={[0, 0, 0]}
          fontSize={0.25}
          color="#00FF00"
          anchorX="center"
        >
        </Text>
      )}
      
      {/* Show sign name */}
      {currentSign && (
        <Text
          position={[0, -6, 0]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          outlineWidth={0.05}
          outlineColor="#000"
        >
          {currentSign.arabic}: {currentSign.english}
        </Text>
      )}
      
      {/* Help text */}
      {!model && !loading && (
        <Text
          position={[0, 0, 0]}
          fontSize={0.3}
          color="#888"
          anchorX="center"
        >
          Loading تحليل animation...
        </Text>
      )}
    </group>
  );
}