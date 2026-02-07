// Simple animation mappings for each video
export const VIDEO_ANIMATION_MAPS = {
  "تحليل": { // analyse
    type: "hands_together",
    keyframes: [
      { time: 0, hands: "both", action: "apart" },
      { time: 1, hands: "both", action: "together" },
      { time: 2, hands: "both", action: "apart" }
    ]
  },
  
  "انتباه": { // attention
    type: "point_head",
    keyframes: [
      { time: 0, hand: "right", target: "head" },
      { time: 1, hand: "right", target: "forward" },
      { time: 1.5, hand: "right", target: "head" }
    ]
  },
  
  "بصحة جيدة": { // healthy
    type: "chest_tap",
    keyframes: [
      { time: 0, hand: "right", target: "chest" },
      { time: 0.5, hand: "right", target: "outward" },
      { time: 1.5, hand: "right", target: "chest" }
    ]
  },
  
  "تقييم": { // evaluation
    type: "thinking",
    keyframes: [
      { time: 0, hand: "right", target: "chin" },
      { time: 1, hand: "right", target: "side" },
      { time: 2, hand: "right", target: "chin" }
    ]
  },
  
  "مطهر كحولي": { // sanitizer
    type: "rubbing_hands",
    keyframes: [
      { time: 0, hands: "both", action: "rub" },
      { time: 1, hands: "both", action: "rub_fast" },
      { time: 2, hands: "both", action: "stop" }
    ]
  },
  
  "إعاقة": { // disability
    type: "limited_movement",
    keyframes: [
      { time: 0, arm: "right", action: "stiff" },
      { time: 1, arm: "right", action: "limited_move" },
      { time: 2, arm: "right", action: "stiff" }
    ]
  },
  
  "دواء": { // medicine
    type: "pill_to_mouth",
    keyframes: [
      { time: 0, hand: "right", target: "palm" },
      { time: 1, hand: "right", target: "mouth" },
      { time: 2, hand: "right", target: "palm" }
    ]
  },
  
  // Default animation for others
  "default": {
    type: "explain",
    keyframes: [
      { time: 0, hands: "both", action: "neutral" },
      { time: 1, hands: "both", action: "explain" },
      { time: 2, hands: "both", action: "neutral" }
    ]
  }
};