import { useEffect, useRef } from "react";
import { setupMediaPipe } from "../mediapipe/useMediaPipePose";
import { extractPoseFrame } from "../mediapipe/extractPoseFromVideo";
import { poseToMixamo } from "../mediapipe/poseToBones";

export default function SignPlayer({ onPoseFrame }) {
  const videoRef = useRef();
  const recordedFrames = useRef([]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onResults = (results) => {
      const pose = extractPoseFrame(results);
      const bones = poseToMixamo(pose);
      console.log("Recording frame", performance.now());

      if (bones) {
        const frame = {
          time: performance.now(),
          bones,
        };

        recordedFrames.current.push(frame);
        onPoseFrame?.(frame); // live preview
      }
    };

    setupMediaPipe(video, onResults);
  }, []);

  return (
    <video
      ref={videoRef}
      src="/videos/analyse.mp4"
      controls
      autoPlay
      muted
      onEnded={() => {
    console.log("VIDEO FINISHED");
    console.log(
      JSON.stringify(recordedFrames.current, null, 2)
    );
  }}
      style={{ width: 400 }}
    />
  );
}
