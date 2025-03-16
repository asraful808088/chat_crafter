import tensorflow as tf
from tensorflow.keras import layers
from tensorflow.keras.layers import MultiHeadAttention
import os
from tensorflow.keras.preprocessing.text import tokenizer_from_json
import numpy as np
import pickle
from tensorflow.keras.preprocessing.sequence import pad_sequences
import json
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
def load_model_and_encoder():
    from tensorflow.keras.models import load_model

    model = tf.keras.models.load_model(model_path, custom_objects=custom_objects, compile=False)

    with open("tokenizer.json", "r") as f:
        tokenizer_data = json.load(f)  
        tokenizer_json_str = json.dumps(tokenizer_data) 
        tokenizer = tokenizer_from_json(tokenizer_json_str)

    with open("label_encoder.pkl", "rb") as f:
        label_encoder = pickle.load(f)

    return model, tokenizer, label_encoder

def predict_entities(test_sentence):
    list_of_chunk = []
    model, tokenizer, label_encoder = load_model_and_encoder()

    test_sequence = tokenizer.texts_to_sequences([test_sentence])

    max_len = model.input_shape[1]  
    test_sequence_padded = pad_sequences(test_sequence, padding='post', maxlen=max_len)

    predictions = model.predict(test_sequence_padded)
    predicted_labels = np.argmax(predictions, axis=-1)[0]

    predicted_tags = label_encoder.inverse_transform(predicted_labels)

    tokens = test_sentence.split()
    for token, tag in zip(tokens, predicted_tags):
        list_of_chunk.append((token,str(tag)))
    return list_of_chunk

test_sentence = "We go Bangladesh"
print(predict_entities(test_sentence))

