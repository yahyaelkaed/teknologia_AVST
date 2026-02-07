export const extractPoseFrame = (results) => {
  if (!results.poseWorldLandmarks) return null;

  const lm = results.poseWorldLandmarks;

  return {
    rightShoulder: lm[12],
    rightElbow: lm[14],
    rightWrist: lm[16],
    leftShoulder: lm[11],
    leftElbow: lm[13],
    leftWrist: lm[15],
  };
};
