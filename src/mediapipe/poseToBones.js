import { angleBetween } from "./poseMath";
export const poseToMixamo = (pose) => {
  if (!pose) return null;

  const rightElbowAngle = angleBetween(
    pose.rightShoulder,
    pose.rightElbow,
    pose.rightWrist
  );

  const leftElbowAngle = angleBetween(
    pose.leftShoulder,
    pose.leftElbow,
    pose.leftWrist
  );

  return {
    mixamorigRightArm: {
      rotation: [-0.4, 0, 0],
    },
    mixamorigRightForeArm: {
      rotation: [-rightElbowAngle + Math.PI / 2, 0, 0],
    },
    mixamorigLeftArm: {
      rotation: [-0.4, 0, 0],
    },
    mixamorigLeftForeArm: {
      rotation: [-leftElbowAngle + Math.PI / 2, 0, 0],
    },
  };
};
