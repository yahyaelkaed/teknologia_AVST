import * as THREE from "three";

export const angleBetween = (a, b, c) => {
  const ba = new THREE.Vector3(a.x, a.y, a.z)
    .sub(new THREE.Vector3(b.x, b.y, b.z))
    .normalize();

  const bc = new THREE.Vector3(c.x, c.y, c.z)
    .sub(new THREE.Vector3(b.x, b.y, b.z))
    .normalize();

  return ba.angleTo(bc);
};
