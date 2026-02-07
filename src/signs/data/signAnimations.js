// src/data/signAnimations.js

// Simple animation presets (will be replaced with real LST animations later)
export const SIGN_ANIMATIONS = {
  // Emergency signs
  "ambulance": {
    duration: 2.0,
    keyframes: [
      { time: 0, rightArm: { rotation: [20, 20, 200] } },
      { time: 1, rightArm: { rotation: [0, 0, 0.5] } },
      { time: 2, rightArm: { rotation: [0, 0, 0] } }
    ]
  },
  
  "help": {
    duration: 1.5,
    keyframes: [
      { time: 0, rightArm: { position: [0.6, 0, 0] } },
      { time: 0.75, rightArm: { position: [0.6, 0.5, 0] } },
      { time: 1.5, rightArm: { position: [0.6, 0, 0] } }
    ]
  },
  
  "pain": {
    duration: 2.0,
    keyframes: [
      { time: 0, rightHand: { position: [0.5, 0.5, 0] } },
      { time: 1, rightHand: { position: [0.5, 0.7, 0] } },
      { time: 2, rightHand: { position: [0.5, 0.5, 0] } }
    ]
  },
  
  "doctor": {
    duration: 2.5,
    keyframes: [
      { time: 0, rightHand: { position: [0, 0.5, 0] } },
      { time: 1, rightHand: { position: [0.3, 0.7, 0] } },
      { time: 2, rightHand: { position: [0, 0.5, 0] } }
    ]
  },
  
  "yes": {
    duration: 1.0,
    keyframes: [
      { time: 0, head: { rotation: [0, 0, 0] } },
      { time: 0.5, head: { rotation: [0.2, 0, 0] } },
      { time: 1, head: { rotation: [0, 0, 0] } }
    ]
  },
  
  "no": {
    duration: 1.5,
    keyframes: [
      { time: 0, head: { rotation: [0, 0, 0] } },
      { time: 0.75, head: { rotation: [0, 0.3, 0] } },
      { time: 1.5, head: { rotation: [0, 0, 0] } }
    ]
  }
};