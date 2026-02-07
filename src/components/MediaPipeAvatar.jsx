import { useEffect, useRef, useState } from 'react';
import { useGLTF, Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function MediaPipeAvatar({ 
  currentSign, 
  isSigning, 
  onAnimationComplete,
  learnedAnimations = []
}) {
  const groupRef = useRef();
  const animationTimeRef = useRef(0);
  
  const bonesRef = useRef({
    // Right arm
    mixamorigRightShoulder: null,
    mixamorigRightForeArm: null,
    mixamorigRightHand: null,
    
    // Left arm
    mixamorigLeftShoulder: null,
    mixamorigLeftForeArm: null,
    mixamorigLeftHand: null,
    
    // Body
    mixamorigHead: null,
    mixamorigNeck: null,
    mixamorigSpine: null
  });
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentKeyframes, setCurrentKeyframes] = useState([]);
  
  const { scene } = useGLTF('/models/xbot.glb');

  // Find bones
  useEffect(() => {
    if (!scene) return;
    
    scene.traverse((child) => {
      if (child.isBone) {
        // Store bones by name
        if (child.name.includes('RightShoulder')) bonesRef.current.mixamorigRightShoulder = child;
        if (child.name.includes('RightForeArm')) bonesRef.current.mixamorigRightForeArm = child;
        if (child.name.includes('RightHand')) bonesRef.current.mixamorigRightHand = child;
        
        if (child.name.includes('LeftShoulder')) bonesRef.current.mixamorigLeftShoulder = child;
        if (child.name.includes('LeftForeArm')) bonesRef.current.mixamorigLeftForeArm = child;
        if (child.name.includes('LeftHand')) bonesRef.current.mixamorigLeftHand = child;
        
        if (child.name.includes('Head') && !child.name.includes('Top')) bonesRef.current.mixamorigHead = child;
        if (child.name.includes('Neck')) bonesRef.current.mixamorigNeck = child;
        if (child.name.includes('Spine') && !child.name.includes('1') && !child.name.includes('2')) {
          bonesRef.current.mixamorigSpine = child;
        }
      }
    });
  }, [scene]);

  // Handle animation
  useEffect(() => {
    if (!isSigning || !currentSign) {
      if (isPlaying) {
        setIsPlaying(false);
        setCurrentKeyframes([]);
        resetBones();
      }
      return;
    }

    console.log('MediaPipe Avatar: Playing', currentSign.arabic);
    
    // Check if we have a MediaPipe-learned animation
    const mediaPipeAnim = learnedAnimations.find(
      anim => anim.arabic === currentSign.arabic && anim.isMediaPipeLearned
    );
    
    if (mediaPipeAnim?.keyframes) {
      // Play MediaPipe-learned animation
      console.log('Using MediaPipe-learned animation:', mediaPipeAnim.keyframes.length, 'keyframes');
      setCurrentKeyframes(mediaPipeAnim.keyframes);
      setIsPlaying(true);
      animationTimeRef.current = 0;
      
      const duration = mediaPipeAnim.duration * 1000;
      const timer = setTimeout(() => {
        setIsPlaying(false);
        setCurrentKeyframes([]);
        onAnimationComplete?.();
      }, duration);
      
      return () => clearTimeout(timer);
    }
    
    // Fallback to simple animation
    console.log('No MediaPipe animation, using fallback');
    setIsPlaying(true);
    animationTimeRef.current = 0;
    
    const duration = 2000;
    const timer = setTimeout(() => {
      setIsPlaying(false);
      onAnimationComplete?.();
    }, duration);
    
    return () => clearTimeout(timer);
    
  }, [currentSign, isSigning, onAnimationComplete, learnedAnimations]);

  // Play MediaPipe keyframe animation
  useFrame((state, delta) => {
    if (!isPlaying) return;
    
    animationTimeRef.current += delta;
    const currentTime = animationTimeRef.current;
    
    if (currentKeyframes.length > 1) {
      // Play MediaPipe keyframe animation
      playKeyframeAnimation(currentTime, currentKeyframes);
    } else {
      // Fallback animation
      playFallbackAnimation(currentTime, currentSign?.arabic);
    }
  });

  // Play keyframe animation (MediaPipe data)
  const playKeyframeAnimation = (currentTime, keyframes) => {
    // Find current and next keyframe
    let currentKF = keyframes[0];
    let nextKF = keyframes[1];
    let blendFactor = 0;
    
    for (let i = 0; i < keyframes.length - 1; i++) {
      if (currentTime >= keyframes[i].time && currentTime <= keyframes[i + 1].time) {
        currentKF = keyframes[i];
        nextKF = keyframes[i + 1];
        blendFactor = (currentTime - currentKF.time) / (nextKF.time - currentKF.time);
        break;
      }
    }
    
    // Apply interpolated rotations
    if (currentKF.rotations && nextKF.rotations) {
      // Right shoulder
      if (bonesRef.current.mixamorigRightShoulder && currentKF.rotations.rightShoulder) {
        const rotX = THREE.MathUtils.lerp(
          currentKF.rotations.rightShoulder.x,
          nextKF.rotations.rightShoulder.x,
          blendFactor
        );
        const rotY = THREE.MathUtils.lerp(
          currentKF.rotations.rightShoulder.y,
          nextKF.rotations.rightShoulder.y,
          blendFactor
        );
        const rotZ = THREE.MathUtils.lerp(
          currentKF.rotations.rightShoulder.z,
          nextKF.rotations.rightShoulder.z,
          blendFactor
        );
        
        bonesRef.current.mixamorigRightShoulder.rotation.x = rotX;
        bonesRef.current.mixamorigRightShoulder.rotation.y = rotY;
        bonesRef.current.mixamorigRightShoulder.rotation.z = rotZ;
      }
      
      // Right elbow (using forearm)
      if (bonesRef.current.mixamorigRightForeArm && currentKF.rotations.rightElbow) {
        const rotX = THREE.MathUtils.lerp(
          currentKF.rotations.rightElbow.x,
          nextKF.rotations.rightElbow.x,
          blendFactor
        );
        bonesRef.current.mixamorigRightForeArm.rotation.x = rotX;
      }
    }
  };

  // Fallback animation
  const playFallbackAnimation = (time, arabicSign) => {
    const rightArm = bonesRef.current.mixamorigRightForeArm;
    if (!rightArm) return;
    
    // Simple wave based on sign
    const wave = Math.sin(time * 3);
    const raise = (Math.sin(time * 1.5) + 1) / 2;
    
    if (arabicSign === 'دواء') {
      rightArm.rotation.x = raise * 0.8;
    } else if (arabicSign === 'انتباه') {
      rightArm.rotation.x = 0.7;
    } else {
      rightArm.rotation.z = wave * 0.3;
    }
  };

  const resetBones = () => {
    Object.values(bonesRef.current).forEach(bone => {
      if (bone && bone.rotation) {
        bone.rotation.set(0, 0, 0);
      }
    });
  };

  return (
    <group ref={groupRef}>
      <primitive 
        object={scene} 
        scale={1.2}
        position={[0, -2.2, 0]}
        rotation={[0, Math.PI, 0]}
      />
      
      {/* MediaPipe indicator */}
      {currentKeyframes.length > 0 && (
        <Text
          position={[0, 2.3, 0]}
          fontSize={0.13}
          color="#10b981"
          anchorX="center"
          outlineWidth={0.02}
          outlineColor="#000000"
        >
          🤖 AI-LEARNED
        </Text>
      )}
      
      {/* Sign name */}
      {currentSign && (
        <Text
          position={[0, -1.5, 0]}
          fontSize={0.18}
          color="white"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.03}
          outlineColor="#000000"
        >
          {currentSign.arabic}
        </Text>
      )}
    </group>
  );
}

useGLTF.preload('/models/xbot.glb');