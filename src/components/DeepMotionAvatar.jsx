// components/DeepMotionAvatar.jsx
import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default function DeepMotionAvatar({ 
  currentSign, 
  isSigning, 
  onAnimationComplete, 
  speed = 1,
  colorblindType = 'normal',
  modelColors = { skinTone: 0xd4a574, hair: 0x3d2817 }
}) {
  const groupRef = useRef();
  const mixerRef = useRef(null);
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [animationClip, setAnimationClip] = useState(null);
  const [animationsCache, setAnimationsCache] = useState({});

  // Map Arabic signs to GLB files
  const getAnimationFile = (sign) => {
    if (!sign) return null;
    
    const arabic = sign.arabic || sign.id;
    
    const fileMap = {
      
      'تحليل': '/models/analyse_default.glb',
      'موجات فوق صوتية': '/models/fautallerfaireuneecho.glb',
      'حساسية': '/models/avezvousunealergie.glb',
      'ضوء': '/models/lucemie.glb',
      'لا بأس': '/models/bonne-sante_default.glb',
      'سكتة قلبية': '/models/arretcardiaque_default.glb',
      'طبيب': '/models/medecin_default.glb',
      'متى كانت آخر مرة': '/models/Quandestladernierefois.glb',
      'متى كانت': '/models/Quandestladernierefois.glb',
      'آخر مرة': '/models/Quandestladernierefois.glb',
      'متى آخر مرة': '/models/Quandestladernierefois.glb',
      'when was the last time': '/models/Quandestladernierefois.glb',
      'last time': '/models/Quandestladernierefois.glb',
      'quand est la dernière fois': '/models/Quandestladernierefois.glb',
      'quand est la derniere fois': '/models/Quandestladernierefois.glb',
      'dernière fois': '/models/Quandestladernierefois.glb',
      'derniere fois': '/models/Quandestladernierefois.glb',
      

      // English/French fallbacks
      'analyse': '/models/analyse_default.glb',
      'ultrasound': '/models/fautallerfaireuneecho.glb',
      'allergy': '/models/avezvousunealergie.glb',
      'light': '/models/lucemie.glb',
      'good health': '/models/bonne-sante_default.glb',
      'bonne sante': '/models/bonne-sante_default.glb',
      'bonne santé': '/models/bonne-sante_default.glb',
      'cardiac arrest': '/models/arretcardiaque_default.glb',
      'arret cardiaque': '/models/arretcardiaque_default.glb',
      'heart attack': '/models/arretcardiaque_default.glb',
      'doctor': '/models/medecin_default.glb',
      'médecin': '/models/medecin_default.glb',
      'medecin': '/models/medecin_default.glb',
      'انشاء الله لباس': '/models/bonne-sante_default.glb',
      'انشاءالله لباس': '/models/bonne-sante_default.glb',
      'لاباس عليك': '/models/bonne-sante_default.glb',
      'لا باس عليك': '/models/bonne-sante_default.glb',
      'سكتة': '/models/arretcardiaque_default.glb',
      'قلبية': '/models/arretcardiaque_default.glb',
      'قلب': '/models/arretcardiaque_default.glb',
      'سكت': '/models/arretcardiaque_default.glb',
      'دكتور': '/models/medecin_default.glb',
      'دكتورة': '/models/medecin_default.glb',
      'الطبيب': '/models/medecin_default.glb',
      'الطبيبة': '/models/medecin_default.glb',
      'طبيبة': '/models/medecin_default.glb', 
      'عندك سكر': '/models/Souffrezvousdediabete.glb',
      'واش عندك السكري': '/models/Souffrezvousdediabete.glb',
      'بعاني من السكري': '/models/Souffrezvousdediabete.glb',
      'هل أنت مصاب بمرض السكري': '/models/Souffrezvousdediabete.glb',
      'هل تعاني من مرض السكري': '/models/Souffrezvousdediabete.glb',
      'Do you have diabetes': '/models/Souffrezvousdediabete.glb',
      'Souffrez-vous de diabète': '/models/Souffrezvousdediabete.glb',

      
      // Emergency variations
      'توقف القلب': '/models/arretcardiaque_default.glb',
      'ارتفاع القلب': '/models/arretcardiaque_default.glb',
      'نوبة قلبية': '/models/arretcardiaque_default.glb',
      
      // Health variations
      'صحة': '/models/bonne-sante_default.glb',
      'عافية': '/models/bonne-sante_default.glb',
      'سلامة': '/models/bonne-sante_default.glb'

      
    };
    
    return fileMap[arabic] || fileMap[sign.id] || fileMap[sign.english?.toLowerCase()];
  };

  // Load animation when sign changes
  useEffect(() => {
    if (!currentSign) {
      setModel(null);
      setAnimationClip(null);
      return;
    }
    
    const animationFile = getAnimationFile(currentSign);
    if (!animationFile) {
      console.error(`❌ No animation file mapped for: ${currentSign.arabic}`);
      return;
    }
    
    console.log(`🔄 Loading: ${currentSign.arabic} from ${animationFile}`);
    
    const cacheKey = `${currentSign.arabic}_${animationFile}`;
    
    // Check cache
    if (animationsCache[cacheKey]) {
      console.log(`✅ Using cached: ${currentSign.arabic}`);
      const cached = animationsCache[cacheKey];
      setModel(cached.model);
      setAnimationClip(cached.animationClip);
      mixerRef.current = new THREE.AnimationMixer(cached.model);
      return;
    }
    
    setLoading(true);
    
    const loader = new GLTFLoader();
    loader.load(
      
      animationFile,
      (gltf) => {
        console.log(`✅ Loaded: ${currentSign.arabic}`);
        console.log(`📊 Animations: ${gltf.animations?.length || 0}`);
        
        if (gltf.animations && gltf.animations.length > 0) {
          gltf.animations.forEach((anim, i) => {
            console.log(`  ${i}: "${anim.name}" (${anim.duration.toFixed(2)}s)`);
          });
        }
        
        const model = gltf.scene;
        model.traverse((c) => {
  if (c.isSkinnedMesh) {
    console.log('🦴 SkinnedMesh:', c.name);
  }
});
        
        // 🎨 COLOR MODEL BASED ON COLORBLIND TYPE
        model.traverse((child) => {
          if (!child.isSkinnedMesh) return;
          if (child.name !== 'body') return; // ONLY body mesh

          const skinnedMesh = child;
          const geometry = skinnedMesh.geometry;

          // Clone material safely
          skinnedMesh.material = skinnedMesh.material.clone();
          skinnedMesh.material.vertexColors = true;

          const vertexCount = geometry.attributes.position.count;

          // Convert hex colors to RGB (0-1 range)
          const skinToneColor = new THREE.Color(modelColors.skinTone);
          const skinTone_r = skinToneColor.r;
          const skinTone_g = skinToneColor.g;
          const skinTone_b = skinToneColor.b;
          
          // Initialize color attribute with skin tone for entire model
          const colors = new Float32Array(vertexCount * 3);
          for (let i = 0; i < vertexCount; i++) {
            colors[i * 3] = skinTone_r;
            colors[i * 3 + 1] = skinTone_g;
            colors[i * 3 + 2] = skinTone_b;
          }
          geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

          const colorAttr = geometry.getAttribute('color');
          colorAttr.needsUpdate = true;
          
          console.log(`🎨 Applied ${colorblindType} colorblind mode colors to model`);
        });


        
        setModel(model);
        
        let clip = null;
        if (gltf.animations && gltf.animations.length > 0) {
          clip = gltf.animations[0];
          console.log(`🎭 Using animation: "${clip.name}"`);
          setAnimationClip(clip);
          mixerRef.current = new THREE.AnimationMixer(model);
        }
        
        // Cache it
        setAnimationsCache(prev => ({
          ...prev,
          [cacheKey]: { model, animationClip: clip }
        }));
        
        setLoading(false);
      },
      undefined,
      (error) => {
        console.error(`❌ Failed to load ${currentSign.arabic}:`, error);
        console.log(`📌 File attempted: ${animationFile}`);
        
        // Show error model
        const errorGroup = new THREE.Group();
        const errorText = new THREE.Mesh(
          new THREE.PlaneGeometry(2, 0.5),
          new THREE.MeshBasicMaterial({ 
            color: 0xff0000,
            transparent: true,
            opacity: 0.7
          })
        );
        errorGroup.add(errorText);
        setModel(errorGroup);
        setLoading(false);
        
        // Auto-complete after error
        setTimeout(() => {
          if (onAnimationComplete) onAnimationComplete();
        }, 2000);
      }
    );    
    return () => {
      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
      }
    };
  }, [currentSign]);

  // Play animation when signing starts
  useEffect(() => {
    if (!isSigning || !currentSign || !model) return;
    
    console.log(`▶️ Playing animation for: ${currentSign.arabic}`);
    
    if (animationClip && mixerRef.current) {
      // Stop any existing animation
      mixerRef.current.stopAllAction();
      
      // Create and play action
      const action = mixerRef.current.clipAction(animationClip);
      action.reset();
      action.setLoop(THREE.LoopOnce, 1);
      action.clampWhenFinished = true;
      action.timeScale = speed; // Apply speed multiplier
      action.play();
      
      // Get duration and adjust for speed
      const duration = (animationClip.duration / speed) * 1000;
      console.log(`⏱️ Duration: ${duration}ms (Speed: ${speed}x)`);
      
      // Set completion timer
      const timer = setTimeout(() => {
        console.log(`✅ Completed: ${currentSign.arabic}`);
        if (onAnimationComplete) onAnimationComplete();
      }, duration);
      
      return () => clearTimeout(timer);
    } else {
      // No animation, just show model for 3 seconds
      console.log(`⚠️ No animation clip for: ${currentSign.arabic}`);
      const timer = setTimeout(() => {
        if (onAnimationComplete) onAnimationComplete();
      }, 3000 / speed);
      
      return () => clearTimeout(timer);
    }
  }, [isSigning, currentSign, model, animationClip, onAnimationComplete, speed]);

  // Update model colors when colorblind type or colors change
  useEffect(() => {
    if (!model || !modelColors) return;

    model.traverse((child) => {
      if (!child.isSkinnedMesh) return;
      if (child.name !== 'body') return;

      const geometry = child.geometry;
      const colorAttr = geometry.getAttribute('color');
      if (!colorAttr) return;

      // Convert hex color to RGB (0-1 range)
      const skinToneColor = new THREE.Color(modelColors.skinTone);
      const colors = colorAttr.array;

      // Update all vertex colors
      for (let i = 0; i < colors.length; i += 3) {
        colors[i] = skinToneColor.r;
        colors[i + 1] = skinToneColor.g;
        colors[i + 2] = skinToneColor.b;
      }

      colorAttr.needsUpdate = true;
      console.log(`🎨 Updated colors for ${colorblindType} mode`);
    });
  }, [model, modelColors, colorblindType]);

  // Update animation mixer
  useFrame((state, delta) => {
    if (mixerRef.current) {
      mixerRef.current.update(delta);
    }
  });

  if (loading) {
    return (
      <Text position={[0, 0, 0]} fontSize={0.3} color="#4CAF50" anchorX="center">
        ⏳ جاري تحميل {currentSign?.arabic}...
      </Text>
    );
  }

  return (
    <group ref={groupRef}>
      {model && (
        <primitive
          object={model}
          scale={5}
          position={[0, -3, 0]}
          rotation={[0, 0, 0]}
        />
      )}
      
      {/* Sign display */}
      {currentSign && (
        <>
          
          
          {currentSign.description && (
            <Text
              position={[0, -4, 0]}
              fontSize={0.15}
              color="#888"
              anchorX="center"
              maxWidth={4}
              textAlign="center"
            >
              {currentSign.description}
            </Text>
          )}
        </>
      )}
      
      {/* Animation status */}
      {isSigning && currentSign && (
        <Text
          position={[0, 4, 0]}
          fontSize={0.2}
          color="#FF0000"
          anchorX="center"
        >
        </Text>
      )}
      
      {/* Default state */}
      {!model && !loading && !currentSign && (
        <Text position={[0, 0, 0]} fontSize={0.3} color="#888" anchorX="center">
          🏥 مترجم لغة الإشارة التونسية
        </Text>
      )}
    </group>
  );
  
}