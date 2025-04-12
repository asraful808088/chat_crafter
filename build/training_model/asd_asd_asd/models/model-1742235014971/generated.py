
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.preprocessing.text import tokenizer_from_json
import pickle
from tensorflow.keras import layers
from tensorflow.keras.layers import MultiHeadAttention
import os
model_path = os.path.join(os.path.dirname(__file__), "text_classification_model.h5")
class MultiHeadSelfAttention(layers.Layer):
    def __init__(self, units, num_heads, **kwargs):
        super(MultiHeadSelfAttention, self).__init__(**kwargs)
        self.attention = MultiHeadAttention(num_heads=num_heads, key_dim=units)

    def call(self, inputs):
        return self.attention(inputs, inputs)

    def get_config(self):
        config = super(MultiHeadSelfAttention, self).get_config()
        config.update({
            'units': self.attention.key_dim,
            'num_heads': self.attention.num_heads,
        })
        return config
custom_objects = {
    'MultiHeadSelfAttention': MultiHeadSelfAttention
}
loaded_model = tf.keras.models.load_model(model_path, custom_objects=custom_objects, compile=False)
token_path = os.path.join(os.path.dirname(__file__), 'tokenizer.json')
with open(token_path) as f:
    data = f.read()
    loaded_tokenizer = tokenizer_from_json(data)
label_encoder_path = os.path.join(os.path.dirname(__file__), 'label_encoder.pkl')
with open(label_encoder_path, 'rb') as f:
    loaded_label_encoder = pickle.load(f)
def getResult(new_texts):
    maxlen = loaded_model.input_shape[1] 
    new_sequences = loaded_tokenizer.texts_to_sequences([new_texts])
    new_padded_sequences = pad_sequences(new_sequences, maxlen=maxlen, padding='post')
    predictions = loaded_model.predict(new_padded_sequences)
    predicted_classes = np.argmax(predictions, axis=1)
    predicted_label = loaded_label_encoder.inverse_transform(predicted_classes)[0]
    class_probabilities = {str(loaded_label_encoder.inverse_transform([i])[0]): float(prob) for i, prob in enumerate(predictions[0])}
    return predicted_label, class_probabilities
    
    
    