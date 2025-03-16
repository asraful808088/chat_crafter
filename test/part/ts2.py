# import tensorflow as tf
# from tensorflow.keras import layers, models, preprocessing
# import numpy as np

# # Create a demo text dataset
# texts = [
#     "I love programming",             # Positive
#     "Python is amazing",              # Positive
#     "I hate bugs",                    # Negative
#     "Debugging is so frustrating",    # Negative
#     "I enjoy learning new things",    # Positive
#     "Errors make me angry",           # Negative
#     "I am happy with my progress",    # Positive
#     "This is okay",                   # Neutral
#     "Not bad, not good",              # Neutral
#     "I feel indifferent about coding" # Neutral
# ]

# # Corresponding labels (0 = Negative, 1 = Neutral, 2 = Positive)
# labels = np.array([2, 2, 0, 0, 2, 0, 2, 1, 1, 1])

# # One-hot encode the labels for multi-class classification
# num_classes = 3
# labels = tf.keras.utils.to_categorical(labels, num_classes)

# # Tokenize the text data
# tokenizer = preprocessing.text.Tokenizer(num_words=100, oov_token="<OOV>")
# tokenizer.fit_on_texts(texts)
# sequences = tokenizer.texts_to_sequences(texts)
# padded_sequences = preprocessing.sequence.pad_sequences(sequences, padding='post')

# vocab_size = len(tokenizer.word_index) + 1
# max_len = padded_sequences.shape[1]

# # Custom Self-Attention Layer
# class SelfAttention(layers.Layer):
#     def __init__(self, units):
#         super(SelfAttention, self).__init__()
#         self.W = layers.Dense(units)
#         self.U = layers.Dense(units)

#     def call(self, inputs):
#         score = tf.nn.tanh(self.W(inputs))
#         attention_weights = tf.nn.softmax(self.U(score), axis=1)
#         context_vector = attention_weights * inputs
#         context_vector = tf.reduce_sum(context_vector, axis=1)
#         return context_vector

# # Build the model
# model = models.Sequential([
#     layers.Embedding(input_dim=vocab_size, output_dim=64, input_length=max_len),
#     layers.Bidirectional(layers.LSTM(64, return_sequences=True)),
#     SelfAttention(64),
#     layers.Dense(32, activation='relu'),
#     layers.Dense(num_classes, activation='softmax')  # Softmax for multi-class classification
# ])

# # Compile the model
# model.compile(optimizer='adam',
#               loss='categorical_crossentropy',
#               metrics=['accuracy'])

# # Display the model's architecture
# model.summary()

# # Train the model
# history = model.fit(
#     padded_sequences, labels,
#     epochs=10,
#     batch_size=2,
#     validation_split=0.2
# )

# # Make predictions
# predictions = model.predict(padded_sequences)
# predicted_classes = np.argmax(predictions, axis=1)
# true_classes = np.argmax(labels, axis=1)

# # Category mapping
# category_map = {0: "Negative", 1: "Neutral", 2: "Positive"}

# # Display predictions with corresponding texts
# for i in range(len(texts)):
#     print(f'Text: "{texts[i]}" - Predicted: {category_map[predicted_classes[i]]} - Actual: {category_map[true_classes[i]]}')












































import numpy as np
import tensorflow as tf
from tensorflow.keras import layers, models
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder

# 1. Create a Demo Text Dataset
texts = [
    "I love this product", "This is the best purchase I've made", 
    "Absolutely fantastic experience", "I am very happy with this", 
    "Worst product ever", "I hate this", 
    "Terrible experience", "I am disappointed with this",
    "Not good", "Will never buy again"
]
labels = ["Positive", "Positive", "Positive", "Positive", 
          "Negative", "Negative", "Negative", "Negative", 
          "Negative", "Negative"]

# Encode labels
label_encoder = LabelEncoder()
encoded_labels = label_encoder.fit_transform(labels)

# 2. Tokenize and Pad Sequences
tokenizer = tf.keras.preprocessing.text.Tokenizer(num_words=100, oov_token="<OOV>")
tokenizer.fit_on_texts(texts)
sequences = tokenizer.texts_to_sequences(texts)
padded_sequences = tf.keras.preprocessing.sequence.pad_sequences(sequences, padding='post', maxlen=10)

# Split data
X_train, X_test, y_train, y_test = train_test_split(padded_sequences, encoded_labels, test_size=0.2, random_state=42)

# 3. Model Architecture with Self-Attention
class SelfAttention(layers.Layer):
    def __init__(self, units):
        super(SelfAttention, self).__init__()
        self.W = layers.Dense(units)
        self.U = layers.Dense(units)

    def call(self, inputs):
        query = self.W(inputs)
        key = self.U(inputs)
        attention = tf.nn.softmax(tf.matmul(query, key, transpose_b=True), axis=-1)
        context = tf.matmul(attention, inputs)
        return context

def build_model(vocab_size, max_length):
    inputs = layers.Input(shape=(max_length,))
    x = layers.Embedding(input_dim=vocab_size, output_dim=64)(inputs)
    x = SelfAttention(units=64)(x)
    x = layers.GlobalAveragePooling1D()(x)
    x = layers.Dense(32, activation='relu')(x)
    outputs = layers.Dense(1, activation='sigmoid')(x)
    model = models.Model(inputs=inputs, outputs=outputs)
    return model

# Build and compile model
vocab_size = len(tokenizer.word_index) + 1
max_length = 10
model = build_model(vocab_size, max_length)
model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

# 4. Train the Model
history = model.fit(X_train, y_train, epochs=10, batch_size=2, validation_data=(X_test, y_test))

# 5. Evaluate the Model
test_loss, test_acc = model.evaluate(X_test, y_test)
print(f'Test Loss: {test_loss}, Test Accuracy: {test_acc}')
