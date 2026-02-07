import cv2
import mediapipe as mp
import json
import numpy as np
import os
from pathlib import Path
import sys

print("🚀 Starting Tunisian Sign Language Pose Extractor...")

class LSTPoseExtractor:
    def __init__(self):
        # CORRECT MediaPipe import
        self.mp_pose = mp.solutions.pose
        self.mp_hands = mp.solutions.hands
        self.mp_face = mp.solutions.face_mesh
        
    def extract_from_video(self, video_path, output_json_path):
        """Extract landmarks from a single video"""
        print(f"📹 Processing: {video_path}")
        
        if not os.path.exists(video_path):
            print(f"❌ Video not found: {video_path}")
            return None
        
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            print(f"❌ Cannot open video: {video_path}")
            return None
        
        fps = cap.get(cv2.CAP_PROP_FPS)
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        
        print(f"📊 FPS: {fps}, Frames: {total_frames}")
        
        all_landmarks = []
        
        # Initialize MediaPipe models
        with self.mp_pose.Pose(
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        ) as pose, self.mp_hands.Hands(
            static_image_mode=False,
            max_num_hands=2,
            min_detection_confidence=0.5
        ) as hands:
            
            frame_idx = 0
            while True:
                ret, frame = cap.read()
                if not ret:
                    break
                
                # Convert BGR to RGB
                rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                rgb_frame.flags.writeable = False
                
                # Process with MediaPipe
                pose_results = pose.process(rgb_frame)
                hands_results = hands.process(rgb_frame)
                
                # Extract landmarks
                landmarks = self._extract_frame_landmarks(pose_results, hands_results)
                all_landmarks.append(landmarks)
                
                frame_idx += 1
                if frame_idx % 30 == 0:
                    print(f"   📈 Processed {frame_idx}/{total_frames} frames")
        
        cap.release()
        
        # Create output directory
        os.makedirs(os.path.dirname(output_json_path), exist_ok=True)
        
        # Prepare data
        data = {
            'sign_name': Path(video_path).stem,
            'fps': float(fps),
            'total_frames': len(all_landmarks),
            'landmarks': all_landmarks,
            'landmark_format': {
                'pose': '33 points [x, y, z, visibility]',
                'left_hand': '21 points [x, y, z] (starts at index 132)',
                'right_hand': '21 points [x, y, z] (starts at index 195)',
                'total_values_per_frame': 258
            }
        }
        
        # Save as JSON
        with open(output_json_path, 'w') as f:
            json.dump(data, f, default=self._numpy_converter)
        
        print(f"✅ Saved to: {output_json_path}")
        print(f"📊 Total frames extracted: {len(all_landmarks)}")
        print("---")
        
        return data
    
    def _extract_frame_landmarks(self, pose_results, hands_results):
        """Extract landmarks from a single frame"""
        landmarks = []
        
        # Pose landmarks (33 points, 4 values each: x, y, z, visibility)
        if pose_results.pose_landmarks:
            for lm in pose_results.pose_landmarks.landmark:
                landmarks.append(float(lm.x))
                landmarks.append(float(lm.y))
                landmarks.append(float(lm.z))
                landmarks.append(float(lm.visibility))
        else:
            landmarks.extend([0.0] * 132)  # 33 * 4
        
        # Left hand landmarks (21 points, 3 values each)
        if hands_results.multi_hand_landmarks and len(hands_results.multi_hand_landmarks) > 0:
            # Determine which hand is left (MediaPipe doesn't label them)
            left_hand = hands_results.multi_hand_landmarks[0]  # Assume first is left
            for lm in left_hand.landmark:
                landmarks.append(float(lm.x))
                landmarks.append(float(lm.y))
                landmarks.append(float(lm.z))
            
            # If we have a second hand, it's the right hand
            if len(hands_results.multi_hand_landmarks) > 1:
                right_hand = hands_results.multi_hand_landmarks[1]
                for lm in right_hand.landmark:
                    landmarks.append(float(lm.x))
                    landmarks.append(float(lm.y))
                    landmarks.append(float(lm.z))
            else:
                landmarks.extend([0.0] * 63)  # 21 * 3
        else:
            # No hands detected
            landmarks.extend([0.0] * 126)  # 2 hands * 21 * 3
        
        return landmarks
    
    def _numpy_converter(self, obj):
        """Convert numpy types to Python types for JSON"""
        if isinstance(obj, np.integer):
            return int(obj)
        elif isinstance(obj, np.floating):
            return float(obj)
        elif isinstance(obj, np.ndarray):
            return obj.tolist()
        raise TypeError(f"Object of type {obj.__class__.__name__} is not JSON serializable")
    
    def batch_process(self, video_dir, output_dir):
        """Process all videos in a directory"""
        video_dir = Path(video_dir)
        output_dir = Path(output_dir)
        output_dir.mkdir(parents=True, exist_ok=True)
        
        video_files = list(video_dir.glob("*.mp4")) + list(video_dir.glob("*.avi")) + list(video_dir.glob("*.mov"))
        
        if not video_files:
            print(f"❌ No video files found in {video_dir}")
            return
        
        print(f"🔍 Found {len(video_files)} video(s)")
        
        for video_file in video_files:
            output_path = output_dir / f"{video_file.stem}.json"
            self.extract_from_video(str(video_file), str(output_path))


# === MAIN EXECUTION ===
if __name__ == "__main__":
    print("=== Tunisian Sign Language Pose Extractor ===")
    
    # Create extractor
    extractor = LSTPoseExtractor()
    
    # Ask user for mode
    print("\nSelect mode:")
    print("1. Process single video")
    print("2. Process all videos in folder")
    print("3. Use sample test")
    
    choice = input("\nEnter choice (1-3): ").strip()
    
    if choice == "1":
        # Single video
        video_path = input("Enter video file path: ").strip()
        output_path = input("Enter output JSON path: ").strip()
        extractor.extract_from_video(video_path, output_path)
    
    elif choice == "2":
        # Batch process
        video_folder = input("Enter videos folder path: ").strip()
        output_folder = input("Enter output folder path: ").strip()
        extractor.batch_process(video_folder, output_folder)
    
    elif choice == "3":
        # Test with a sample (you'll need to create a test video)
        print("Creating test video...")
        # Create a simple test video if none exists
        if not os.path.exists("test_video.mp4"):
            print("Please create a test_video.mp4 file first")
        else:
            extractor.extract_from_video("test_video.mp4", "output/test_sign.json")
    
    else:
        print("❌ Invalid choice")
    
    print("\n🎉 Pose extraction completed!")