// SIMPLE MediaPipe setup that actually works
import { Pose } from '@mediapipe/pose';

export function setupSimpleMediaPipe(videoElement, onResults) {
  const pose = new Pose({
    locateFile: (file) => {
      // Use local files or a reliable CDN
      return `/mediapipe/${file}`; // Put MediaPipe files in public/mediapipe/
      // OR use unpkg
      // return `https://unpkg.com/@mediapipe/pose/${file}`;
    }
  });

  pose.setOptions({
    modelComplexity: 1,
    smoothLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
  });

  pose.onResults(onResults);

  // Process video frames
  const processFrame = async () => {
    if (!videoElement || videoElement.paused || videoElement.ended) {
      return;
    }

    try {
      await pose.send({ image: videoElement });
    } catch (error) {
      console.warn('MediaPipe processing error:', error);
    }

    requestAnimationFrame(processFrame);
  };

  // Start processing
  videoElement.onplay = () => {
    processFrame();
  };

  return pose;
}

// Simple pose extraction
export function extractSimplePose(results) {
  if (!results.poseLandmarks) return null;

  const landmarks = results.poseLandmarks;
  
  return {
    rightShoulder: landmarks[12] || { x: 0, y: 0, z: 0 },
    rightElbow: landmarks[14] || { x: 0, y: 0, z: 0 },
    rightWrist: landmarks[16] || { x: 0, y: 0, z: 0 },
    leftShoulder: landmarks[11] || { x: 0, y: 0, z: 0 },
    leftElbow: landmarks[13] || { x: 0, y: 0, z: 0 },
    leftWrist: landmarks[15] || { x: 0, y: 0, z: 0 }
  };
}

// Convert to Mixamo bone rotations
export function simplePoseToBones(pose) {
  if (!pose) return null;

  return {
    'mixamorigRightShoulder': {
      x: (pose.rightShoulder.y - 0.5) * 2,
      y: (pose.rightShoulder.x - 0.5) * 2,
      z: 0
    },
    'mixamorigRightForeArm': {
      x: Math.atan2(
        pose.rightWrist.y - pose.rightElbow.y,
        pose.rightWrist.x - pose.rightElbow.x
      ),
      y: 0,
      z: 0
    },
    'mixamorigLeftShoulder': {
      x: (pose.leftShoulder.y - 0.5) * 2,
      y: (pose.leftShoulder.x - 0.5) * 2,
      z: 0
    },
    'mixamorigLeftForeArm': {
      x: Math.atan2(
        pose.leftWrist.y - pose.leftElbow.y,
        pose.leftWrist.x - pose.leftElbow.x
      ),
      y: 0,
      z: 0
    }
  };
}