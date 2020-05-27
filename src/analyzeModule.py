from eeg.eegAnalyzeModule import *
from face.predict_face_emotion_faceapi # **

#from face.multimodal_decision.py # **

import operator

def prob_distribution(dic):
    total = sum(list(dic.values()))
    for key, val in dic.items():
        dic[key] /= total
    
    return dic

def multimodal_emotion(face_emotions, eeg_emotions, high_enhance, low_enhance):
    max_face_emotions = max(face_emotions.items(), key=operator.itemgetter(1))[0]
    
    # EEG 값이 스트링인 경우
    if isinstance(eeg_emotions, str):
        enhance = high_enhance if max_face_emotions == "neutral" else low_enhance
        face_emotions[eeg_emotions] *= enhance    # 이 값만큼 eeg 결과 감정에 가중치를 줌.

        emotions = prob_distribution(face_emotions)    # 확률값으로 만들어주기.
        
    # EEG 값이 확률값인 경우       
    else:
        # 무표정일 때
        if max_face_emotions == "neutral":
            for key, val in face_emotions.items():
                face_emotions[key]  += (low_enhance*face_emotions[key] + high_enhance*eeg_emotions[key])
        
        if max_face_emotions == "neutral":
            for key, val in face_emotions.items():
                face_emotions[key]  += (high_enhance*face_emotions[key] + low_enhance*eeg_emotions[key])
        
        emotions = prob_distribution(face_emotions)
        
    return emotions

def detectEmotion(facePath, eegPath, real_emo): # 비장의 기술..**
    face_emotion, face_detected = predict_emotion(facePath) # **
    
    eeg_emotion, n_railed, sensor_status = predict_emotion_EEG(model, eegPath, chosen_channels, freqs, sf=256)
    
    emotion, prob_distribution = combineEmotions(face_emotion, face_detected, eeg_emotion, sensor_status, real_emo) # 비장의 기술..**

    return emotion, prob_distribution
