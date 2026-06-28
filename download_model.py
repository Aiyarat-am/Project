import urllib.request
url = 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task'
out = 'pose_landmarker_lite.task'
print('Downloading', url)
urllib.request.urlretrieve(url, out)
print('Saved to', out)
