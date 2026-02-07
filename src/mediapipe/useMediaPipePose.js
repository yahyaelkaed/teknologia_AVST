import { Pose } from "@mediapipe/pose";

export const setupMediaPipe = (videoEl, onResults) => {
  if (!videoEl) return;

  const pose = new Pose({
    locateFile: (file) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`, // ✅ CDN ensures WASM loads
  });

  // Options: lighter model for stability
  pose.setOptions({
    modelComplexity: 0,       // 0 = light, 1 or 2 = heavier
    smoothLandmarks: true,
    enableSegmentation: false,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
  });

  pose.onResults(onResults);

  // Force play (autoplay can be blocked)
  videoEl.play().catch((err) => {
    console.warn("Video autoplay prevented:", err);
  });

  const processFrame = async () => {
    if (!videoEl.paused && !videoEl.ended) {
      try {
        await pose.send({ image: videoEl });
      } catch (err) {
        console.error("Pose processing error:", err);
      }
    }
    requestAnimationFrame(processFrame);
  };

  processFrame();
};
