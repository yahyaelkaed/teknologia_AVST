import cv2
import mediapipe as mp
import json

# Initialize MediaPipe
mp_pose = mp.solutions.pose
mp_hands = mp.solutions.hands

def extract_simple(video_path, output_json):
    cap = cv2.VideoCapture(video_path)
    landmarks_data = []
    
    with mp_pose.Pose() as pose, mp_hands.Hands() as hands:
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
            
            # Process
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            pose_result = pose.process(rgb)
            hands_result = hands.process(rgb)
            
            # Simple extraction
            frame_landmarks = []
            
            # Pose
            if pose_result.pose_landmarks:
                for lm in pose_result.pose_landmarks.landmark:
                    frame_landmarks.append([lm.x, lm.y, lm.z])
            
            # Hands
            if hands_result.multi_hand_landmarks:
                for hand_landmarks in hands_result.multi_hand_landmarks:
                    for lm in hand_landmarks.landmark:
                        frame_landmarks.append([lm.x, lm.y, lm.z])
            
            landmarks_data.append(frame_landmarks)
    
    cap.release()
    
    # Save
    with open(output_json, 'w') as f:
        json.dump({
            'frames': len(landmarks_data),
            'landmarks': landmarks_data
        }, f)
    
    print(f"✅ Saved {len(landmarks_data)} frames to {output_json}")

# Run it
if __name__ == "__main__":
    extract_simple("your_video.mp4", "output.json")