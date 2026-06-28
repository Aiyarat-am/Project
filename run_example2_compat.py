import runpy
import types

import mediapipe as mp
from mediapipe.tasks.python import BaseOptions, vision


class Pose:
    def __init__(self, min_detection_confidence=0.5, min_tracking_confidence=0.5):
        options = vision.PoseLandmarkerOptions(
            base_options=BaseOptions(model_asset_path=r"pose_landmarker_lite.task"),
            running_mode=vision.RunningMode.IMAGE,
            min_pose_detection_confidence=min_detection_confidence,
            min_pose_presence_confidence=min_tracking_confidence,
            min_tracking_confidence=min_tracking_confidence,
        )
        self._landmarker = vision.PoseLandmarker.create_from_options(options)

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        self._landmarker.close()

    def process(self, image):
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=image)
        result = self._landmarker.detect(mp_image)
        pose_landmarks = result.pose_landmarks[0] if result.pose_landmarks else None
        pose_world_landmarks = (
            result.pose_world_landmarks[0] if result.pose_world_landmarks else None
        )
        return types.SimpleNamespace(
            pose_landmarks=pose_landmarks,
            pose_world_landmarks=pose_world_landmarks,
        )


mp.solutions = types.SimpleNamespace(
    pose=types.SimpleNamespace(
        Pose=Pose,
        POSE_CONNECTIONS=vision.PoseLandmarksConnections.POSE_LANDMARKS,
    ),
    drawing_utils=vision.drawing_utils,
)

runpy.run_path("example2.py", run_name="__main__")