
import tensorflow as tf
import numpy as np
import pickle
from tensorflow.keras.preprocessing.sequence import pad_sequences
import json
import os
model_path = os.path.join(os.path.dirname(__file__), "classifier_model.keras")
model = tf.keras.models.load_model(model_path, compile=False)
with open(os.path.join(os.path.dirname(__file__), 'tokenizer.pkl'), 'rb') as handle:
    tokenizer = pickle.load(handle)

with open(os.path.join(os.path.dirname(__file__), 'type.json') , 'rb') as handle:
    types = json.load(handle)

max_len = model.input_shape[1]  

def getResult(texts):
    max_len = model.input_shape[1]
    sequences = tokenizer.texts_to_sequences([texts])
    padded = pad_sequences(sequences, maxlen=max_len, padding='post', truncating='post')
    predictions = model.predict(padded, verbose=0)
    predictions_i_0 = model.predict(padded, verbose=0)[0] 
    class_probabilities = {
        types.get(str(i), f"Class_{i}"): float(prob)
        for i, prob in enumerate(predictions_i_0)
    }
    predicted_classes = np.argmax(predictions, axis=1)
    # confidence_scores = np.max(predictions, axis=1)
    return np.str_(types.get(str(predicted_classes[0]), 'N/A'))  , class_probabilities


