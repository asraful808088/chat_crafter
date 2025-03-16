# from tensorflow.keras.preprocessing.text import Tokenizer
# from tensorflow.keras.preprocessing.sequence import pad_sequences

# # Example sentence
# sentence = ["I love deep learning"]

# # Tokenize the sentence
# tokenizer = Tokenizer()
# tokenizer.fit_on_texts(sentence)
# word_index = tokenizer.word_index
# print("Word Index:", word_index)

# # Convert sentence to sequence of integers
# sequence = tokenizer.texts_to_sequences(sentence)
# print("Sequence:", sequence)

# # Pad the sequence to ensure uniform length
# padded_sequence = pad_sequences(sequence, maxlen=6, padding='post')
# print("Padded Sequence:", padded_sequence)
import tensorflow as tf
from tensorflow.keras import layers

print(tf.nn)
