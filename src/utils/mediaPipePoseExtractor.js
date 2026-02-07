import { Pose, Holistic, Hands } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';

export class MediaPipePoseExtractor {
  constructor() {
    this.pose = null;
    this.hands = null;
    this.holistic = null;
    this.isInitialized = false;
    this.poseData = [];
  }

  async initialize() {
    // Initialize MediaPipe Holistic (full body + hands + face)
    this.holistic = new Holistic({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
      }
    });

    this.holistic.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      smoothSegmentation: false,
      refineFaceLandmarks: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    this.holistic.onResults(this.onResults.bind(this));
    
    this.isInitialized = true;
    console.log('MediaPipe Holistic initialized');
  }

  // Extract poses from video file
  async extractPosesFromVideo(videoFile, signName) {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.src = URL.createObjectURL(videoFile);
      video.muted = true;
      
      const poses = [];
      let frameCount = 0;
      const maxFrames = 60; // Extract 60 frames (2 seconds at 30fps)
      
      video.onloadeddata = async () => {
        if (!this.isInitialized) {
          await this.initialize();
        }
        
        // Create canvas for processing
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        
        const processFrame = () => {
          if (frameCount >= maxFrames || video.ended || video.paused) {
            URL.revokeObjectURL(video.src);
            resolve({
              signName,
              poses,
              duration: video.duration,
              frameCount: poses.length,
              videoFile: videoFile.name
            });
            return;
          }
          
          // Draw video frame to canvas
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          // Process with MediaPipe
          this.holistic.send({ image: canvas });
          
          // Continue to next frame
          requestAnimationFrame(processFrame);
          frameCount++;
        };
        
        video.play();
        processFrame();
      };
      
      video.load();
    });
  }

  // Process MediaPipe results
  onResults(results) {
    const pose = {
      timestamp: Date.now(),
      poseLandmarks: results.poseLandmarks,
      leftHandLandmarks: results.leftHandLandmarks,
      rightHandLandmarks: results.rightHandLandmarks,
      faceLandmarks: results.faceLandmarks
    };
    
    this.poseData.push(pose);
    
    // Convert landmarks to simpler format
    const simplifiedPose = this.simplifyLandmarks(pose);
    this.onPoseExtracted?.(simplifiedPose);
  }

  // Simplify MediaPipe landmarks for animation
  simplifyLandmarks(pose) {
    if (!pose.poseLandmarks) return null;
    
    // Extract key points for sign language
    const landmarks = pose.poseLandmarks;
    
    return {
      // Right arm keypoints
      rightShoulder: landmarks[12],  // Right shoulder
      rightElbow: landmarks[14],     // Right elbow
      rightWrist: landmarks[16],     // Right wrist
      
      // Left arm keypoints  
      leftShoulder: landmarks[11],   // Left shoulder
      leftElbow: landmarks[13],      // Left elbow
      leftWrist: landmarks[15],      // Left wrist
      
      // Face keypoints
      nose: landmarks[0],            // Nose
      leftEye: landmarks[2],         // Left eye
      rightEye: landmarks[5],        // Right eye
      
      // Hands (if available)
      leftHand: pose.leftHandLandmarks,
      rightHand: pose.rightHandLandmarks
    };
  }

  // Calculate bone rotations from landmarks
  calculateBoneRotations(landmarks) {
    if (!landmarks) return null;
    
    // Calculate shoulder rotation
    const shoulderRotation = this.calculateAngle(
      landmarks.rightShoulder,
      landmarks.rightElbow,
      landmarks.rightWrist
    );
    
    // Calculate elbow rotation
    const elbowRotation = this.calculateAngle(
      landmarks.rightElbow,
      landmarks.rightWrist,
      {x: 0, y: 0, z: 0} // Reference point
    );
    
    return {
      rightShoulder: {
        x: shoulderRotation.x || 0,
        y: shoulderRotation.y || 0,
        z: shoulderRotation.z || 0
      },
      rightElbow: {
        x: elbowRotation.x || 0,
        y: elbowRotation.y || 0,
        z: elbowRotation.z || 0
      }
    };
  }

  calculateAngle(pointA, pointB, pointC) {
    if (!pointA || !pointB || !pointC) return {x: 0, y: 0, z: 0};
    
    // Simple angle calculation (simplified for demo)
    const dx = pointB.x - pointA.x;
    const dy = pointB.y - pointA.y;
    const dz = pointB.z - pointA.z;
    
    return {
      x: Math.atan2(dy, dz) * 0.5,
      y: Math.atan2(dx, dz) * 0.5,
      z: Math.atan2(dx, dy) * 0.5
    };
  }

  // Convert poses to animation keyframes
  convertPosesToKeyframes(poses, duration) {
    const keyframes = [];
    const frameCount = Math.min(poses.length, 30); // Limit to 30 keyframes
    
    for (let i = 0; i < frameCount; i++) {
      const index = Math.floor((i / frameCount) * poses.length);
      const pose = poses[index];
      
      if (pose && pose.poseLandmarks) {
        const rotations = this.calculateBoneRotations(
          this.simplifyLandmarks(pose)
        );
        
        keyframes.push({
          time: (i / frameCount) * duration,
          rotations: rotations || {
            rightShoulder: { x: 0, y: 0, z: 0 },
            rightElbow: { x: 0, y: 0, z: 0 }
          }
        });
      }
    }
    
    return keyframes;
  }
}