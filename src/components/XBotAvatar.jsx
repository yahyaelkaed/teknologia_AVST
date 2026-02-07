import { useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export default function XBotAvatar({ currentSign, isSigning, onAnimationComplete }) {
  const groupRef = useRef();
  const deepMotionRef = useRef();
  const mixerRef = useRef();
  
  // Load your xbot model
  const { scene } = useGLTF('/models/xbot.glb');
  
  // Handle "تحليل" specifically
  useEffect(() => {
    if (!isSigning || !currentSign) return;
    
    const arabic = currentSign.arabic || currentSign.id;
    
    if (arabic === 'تحليل') {
      console.log('🎬 Loading DeepMotion animation for: تحليل');
      
      // Load DeepMotion GLB
      const loader = new THREE.GLTFLoader();
      loader.load(
        '/models/analyse_default.glb',
        (gltf) => {
          console.log('✅ DeepMotion loaded successfully');
          
          // Add to scene
          if (deepMotionRef.current) {
            deepMotionRef.current.removeFromParent();
          }
          
          deepMotionRef.current = gltf.scene;
          groupRef.current.add(gltf.scene);
          
          // Scale and position
          gltf.scene.scale.set(0.01, 0.01, 0.01);
          gltf.scene.position.set(0, -1, 0);
          gltf.scene.rotation.set(0, Math.PI, 0);
          
          // Play animation if exists
          if (gltf.animations && gltf.animations.length > 0) {
            console.log('🎭 Found animations:', gltf.animations.map(a => a.name));
            
            mixerRef.current = new THREE.AnimationMixer(gltf.scene);
            const action = mixerRef.current.clipAction(gltf.animations[0]);
            action.play();
            
            // Get duration
            const duration = gltf.animations[0].duration * 1000;
            
            // Clean up after animation
            setTimeout(() => {
              console.log('✅ Animation complete');
              if (deepMotionRef.current) {
                deepMotionRef.current.removeFromParent();
                deepMotionRef.current = null;
              }
              if (mixerRef.current) {
                mixerRef.current.stopAllAction();
                mixerRef.current = null;
              }
              onAnimationComplete?.();
            }, duration);
          } else {
            console.warn('⚠️ No animations found in GLB');
            setTimeout(() => {
              if (deepMotionRef.current) {
                deepMotionRef.current.removeFromParent();
                deepMotionRef.current = null;
              }
              onAnimationComplete?.();
            }, 3000);
          }
        },
        undefined,
        (error) => {
          console.error('❌ Failed to load DeepMotion:', error);
          onAnimationComplete?.();
        }
      );
    }
  }, [isSigning, currentSign, onAnimationComplete]);
  
  // Update animation mixer
  useFrame((state, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }
  });
  
  return (
    <group ref={groupRef}>
      {/* Always show your xbot model */}
      <primitive 
        object={scene} 
        scale={1.2}
        position={[0, -2.2, 0]}
        rotation={[0, Math.PI, 0]}
      />
    </group>
  );
}