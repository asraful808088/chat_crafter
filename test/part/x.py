# import numpy as np
# import tensorflow as tf
# from tensorflow.keras.preprocessing.sequence import pad_sequences
# from tensorflow.keras.preprocessing.text import Tokenizer
# new_texts = [
#     "Your first test sentence goes here.",
#     "Another example sentence for testing."
# ]

# # Tokenize and pad the new data
# tokenizer = Tokenizer()
# tokenizer.fit_on_texts(new_texts) 
# sequences = tokenizer.texts_to_sequences(new_texts)
# maxlen = loaded_model.input_shape[1]
# padded_sequences = pad_sequences(sequences, maxlen=maxlen, padding='post')
import tensorflow as tf
from tensorflow.keras.layers import Dropout

x = tf.random.normal((2, 5, 4))  # (batch_size=2, time_steps=5, features=4)

dropout_layer = Dropout(rate=0.3)  # Drop 30% of individual elements
output = dropout_layer(x, training=True)

print(output)
