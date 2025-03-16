import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Embedding, LSTM, Dense
from sklearn.model_selection import train_test_split
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences

# Corrected dataset: 52 sentences with labels (0 for Statement, 1 for Question)
sentences = [
    "I am going to the store.", "What time is it?", "Hello, how are you?", "I love programming.",
    "Are you coming to the party?", "It's a sunny day.", "Do you want some coffee?", "I finished my homework.",
    "Where are you going?", "I like pizza.", "What is your favorite color?", "It's raining outside.",
    "Can you help me?", "I will travel tomorrow.", "Is she coming?", "The movie was great.",
    "What is your name?", "I am learning machine learning.", "How do you do?", "I saw a cat today.",
    "Do you have any pets?", "I am reading a book.", "It's time for lunch.", "Where is the nearest bus stop?",
    "This is a nice place.", "Are you ready?", "What are you doing?", "I went for a walk this morning.",
    "Can I ask you a question?", "I just finished work.", "How was your weekend?", "I'm feeling tired.",
    "Do you like sports?", "She is my friend.", "Do you need any help?", "I'm planning a trip.",
    "What's the weather like?", "I enjoy playing chess.", "Have you seen that movie?", "My favorite food is pasta.",
    "Is it your birthday?", "I went shopping today.", "Do you like reading?", "The car is parked outside.",
    "Can you explain that?", "We had a meeting this morning.", "What do you think?", "I like to watch TV.",
    "Are you hungry?", "The food was delicious.", "How old are you?", "I need to study now.",
    "Can you help me out?", "I enjoy swimming."
]

# 52 corresponding labels (0 for Statement, 1 for Question)
labels = [0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0]

# Initialize the Tokenizer and fit on the sentences
tokenizer = Tokenizer()
tokenizer.fit_on_texts(sentences)

# Convert sentences to sequences
sequences = tokenizer.texts_to_sequences(sentences)

# Pad sequences to ensure they are of the same length
max_length = max(len(seq) for seq in sequences)  # Maximum sentence length
padded_sequences = pad_sequences(sequences, maxlen=max_length, padding='post')

# Train-test split (80% train, 20% test)
train_padded, test_padded, train_labels, test_labels = train_test_split(
    padded_sequences, labels, test_size=0.2, random_state=42
)

# Print the shapes of train and test data
print(f"Train data shape: {train_padded.shape}")
print(f"Train labels shape: {len(train_labels)}")

# Define the model
model = Sequential([
    Embedding(input_dim=len(tokenizer.word_index) + 1, output_dim=128, input_length=max_length),
    LSTM(64),
    LSTM(64),
    Dense(64, activation='relu'),
    Dense(1, activation='sigmoid')  # Sigmoid for binary classification (Statement/Question)
])

# Compile the model
model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
model.summary()

# Train the model
history = model.fit(train_padded, np.array(train_labels), epochs=100, validation_data=(test_padded, np.array(test_labels)))

# Evaluate the model
test_loss, test_acc = model.evaluate(test_padded, np.array(test_labels))
print(f"Test accuracy: {test_acc}")

# Predict on new sentences
new_sentences = ["Can you help me?", "I am learning Python.", "Where is the bus station?"]
new_sequences = tokenizer.texts_to_sequences(new_sentences)
new_padded = pad_sequences(new_sequences, maxlen=max_length, padding='post')

predictions = model.predict(new_padded)

# Output the predictions
for sentence, prediction in zip(new_sentences, predictions):
    print(f"Sentence: '{sentence}' - Predicted type: {'Question' if prediction >= 0.5 else 'Statement'}")
