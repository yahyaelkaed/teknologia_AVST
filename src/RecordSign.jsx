// src/pages/RecordSign.jsx
import { useRef, useEffect } from "react";
import { setupMediaPipe } from "./mediapipe/useMediaPipePose"; // <-- fixed path
import { extractPoseFrame } from "./mediapipe/extractPoseFromVideo";
import { poseToMixamo } from "./mediapipe/poseToBones";

export default function RecordSign() {
  const videoRef = useRef(null);
  const recordedFrames = useRef([]);

  useEffect(() => {
    if (!videoRef.current) return;

    const onResults = (results) => {
      const pose = extractPoseFrame(results);
      const bones = poseToMixamo(pose);

      if (bones) {
        recordedFrames.current.push({
          time: performance.now(),
          bones,
        });
      }
    };

    setupMediaPipe(videoRef.current, onResults);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Record LST Sign</h1>
      <video
        ref={videoRef}
        src="/videos/analyse.mp4" // your video path
        autoPlay
        muted
        controls
        onEnded={() => {
          console.log("VIDEO FINISHED");
          console.log(JSON.stringify(recordedFrames.current, null, 2));

  // Optional: download JSON
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(recordedFrames.current));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", "analyse.json");
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}}
        style={{ width: 600 }}
      />
    </div>
  );
}
