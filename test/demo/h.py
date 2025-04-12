import tensorflow as tf
from tensorflow.keras.layers import Embedding, LSTM, Dense, Attention, Concatenate
from tensorflow.keras.models import Model
from tensorflow.keras import Input

# Parameters
vocab_size = 10000  # Size of vocabulary
embedding_dim = 256  # Embedding dimension
latent_dim = 512  # Latent dimensionality of the encoding space

# Encoder
encoder_input = Input(shape=(None,))  # Input sequence
encoder_embedding = Embedding(vocab_size, embedding_dim)(encoder_input)
encoder_lstm = LSTM(latent_dim, return_sequences=True, return_state=True)
encoder_output, forward_h, forward_c = encoder_lstm(encoder_embedding)

# Decoder
decoder_input = Input(shape=(None,))  # Output sequence to be predicted
decoder_embedding = Embedding(vocab_size, embedding_dim)(decoder_input)
decoder_lstm = LSTM(latent_dim, return_sequences=True, return_state=True)
decoder_output, _, _ = decoder_lstm(decoder_embedding, initial_state=[forward_h, forward_c])

# Attention Layer
attention_layer = Attention()
attention_output = attention_layer([decoder_output, encoder_output])

# Concatenate attention output with decoder LSTM output
decoder_combined_context = Concatenate(axis=-1)([decoder_output, attention_output])

# Dense Layer to output final predictions
decoder_dense = Dense(vocab_size, activation='softmax')
decoder_final_output = decoder_dense(decoder_combined_context)

# Seq2Seq Model with Attention
model_with_attention = Model([encoder_input, decoder_input], decoder_final_output)

model_with_attention.compile(optimizer='rmsprop', loss='sparse_categorical_crossentropy', metrics=['accuracy'])

# Summary of the model
model_with_attention.summary()
