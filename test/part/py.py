import numpy as np
import tensorflow as tf
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.layers import Embedding, LSTM, Dense, Dropout, Bidirectional, SpatialDropout1D, TimeDistributed, MultiHeadAttention, LayerNormalization
from tensorflow.keras.models import Model
from tensorflow.keras import Input
from tensorflow.keras.optimizers import Adam

texts = [
    "I m Student of Bangladesh",
    "I m Bangladesh",
    "We Need Bangladesh",
    "I go Need Bangladesh",
    "We go Need Bangladesh",
    "We go Bangladesh",
    "hew go Bangladesh",
    "how go Bangladesh",
    "Haha go Bangladesh",
    "I log go Bangladesh",
    "I m Student of Bangladesh",
    "I m Bangladesh",
    "We Need Bangladesh",
    "I go Need Bangladesh",
    "We go Need Bangladesh",
    "We go Bangladesh",
    "hew go Bangladesh",
    "how go Bangladesh",
    "Haha go Bangladesh",
    "I log go Bangladesh",

    "I m Student of Bangladesh",
    "I m Bangladesh",
    "We Need Bangladesh",
    "I go Need Bangladesh",
    "We go Need Bangladesh",
    "We go Bangladesh",
    "hew go Bangladesh",
    "how go Bangladesh",
    "Haha go Bangladesh",
    "I log go Bangladesh",
]

labels = [
   ["Person","O","O","O","ORG"],
   ["Person","O","ORG"],
   ["Person","O","ORG"],
   ["Person","O","O","ORG"],
   ["Person","O","O","ORG"],
   ["Person","O","ORG"],
   ["Person","O","ORG"],
   ["Person","O","ORG"],
   ["Person","O","ORG"],
   ["Person","O","O","ORG"],
    ["Person","O","O","O","ORG"],
   ["Person","O","ORG"],
   ["Person","O","ORG"],
   ["Person","O","O","ORG"],
   ["Person","O","O","ORG"],
   ["Person","O","ORG"],
   ["Person","O","ORG"],
   ["Person","O","ORG"],
   ["Person","O","ORG"],
   ["Person","O","O","ORG"],
    ["Person","O","O","O","ORG"],
   ["Person","O","ORG"],
   ["Person","O","ORG"],
   ["Person","O","O","ORG"],
   ["Person","O","O","ORG"],
   ["Person","O","ORG"],
   ["Person","O","ORG"],
   ["Person","O","ORG"],
   ["Person","O","ORG"],
   ["Person","O","O","ORG"],


]

# Prepare entity tags and labels
all_tags = list(set(tag for doc in labels for tag in doc))
tag2idx = {tag: i for i, tag in enumerate(all_tags)}

# Prepare texts and labels
X = texts
y = [[tag2idx[tag] for tag in seq] for seq in labels]

# Tokenize texts
tokenizer = tf.keras.preprocessing.text.Tokenizer(lower=True, split=" ")
tokenizer.fit_on_texts(X)
X = tokenizer.texts_to_sequences(X)
X = pad_sequences(X, padding='post')

# Pad labels
y = pad_sequences(y, padding='post')

# Split into train and test sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Model definition using Functional API
input_dim = len(tokenizer.word_index) + 1  # Vocabulary size
output_dim = len(tag2idx)  # Number of entity tags

input_layer = Input(shape=(X_train.shape[1],))
embedding_layer = Embedding(input_dim=input_dim, output_dim=50, input_length=X_train.shape[1])(input_layer)
dropout_layer = SpatialDropout1D(0.2)(embedding_layer)

# LSTM layer
lstm_layer = Bidirectional(LSTM(units=20, return_sequences=True, dropout=0.0, recurrent_dropout=0.2))(dropout_layer)

# Self-attention layer
attention_layer = MultiHeadAttention(num_heads=2, key_dim=10)(lstm_layer, lstm_layer)
attention_layer = LayerNormalization()(attention_layer)

# Output layer
output_layer = TimeDistributed(Dense(output_dim, activation='softmax'))(attention_layer)

model = Model(inputs=input_layer, outputs=output_layer)

model.compile(optimizer=Adam(learning_rate=0.01), loss='sparse_categorical_crossentropy', metrics=['accuracy'])

# Train the model
# model.fit(X_train, np.expand_dims(y_train, -1), batch_size=32, epochs=500, verbose=1)






epochs = 600

batch_size = 32

for epoch in range(1, epochs + 1):
    print(f"Epoch {epoch}/{epochs}")
    
    # Train the model for one epoch
    history = model.fit(
        X_train, 
        np.expand_dims(y_train, -1), 
        batch_size=batch_size, 
        epochs=1, 
        verbose=0
    )
    
    # Train metrics
    train_loss = history.history['loss'][0]
    train_accuracy = history.history['accuracy'][0]

    # Evaluate on the test set
    test_loss, test_accuracy = model.evaluate(X_test, np.expand_dims(y_test, -1), verbose=0)
    
    # Display metrics
    print(f"Train Loss: {train_loss:.9f} - Train Accuracy: {train_accuracy:.9f} | "
          f"Test Loss: {test_loss:.9f} - Test Accuracy: {test_accuracy:.9f}")





# Evaluate the model
loss, accuracy = model.evaluate(X_test, np.expand_dims(y_test, -1))
print(f'Test Loss: {loss}')
print(f'Test Accuracy: {accuracy}')

# Function to predict entity tags for a new sentence
def predict_entities(test_sentence):
    # Tokenize and pad the input sentence
    test_sequence = tokenizer.texts_to_sequences([test_sentence])
    test_sequence_padded = pad_sequences(test_sequence, padding='post', maxlen=X_train.shape[1])

    # Predict the labels for the sentence
    predictions = model.predict(test_sequence_padded)

    # Map the predictions back to tags
    predicted_labels = np.argmax(predictions, axis=-1)[0]

    # Reverse the tag2idx mapping to get the label names
    idx2tag = {i: tag for tag, i in tag2idx.items()}
    predicted_tags = [idx2tag[idx] for idx in predicted_labels]

    # Output the tokens with their predicted tags
    tokens = test_sentence.split()
    for token, tag in zip(tokens, predicted_tags):
        print(f'{token}: {tag}')

# Test the model on a new sentence
test_sentence = "We go Bangladesh"
print("\nPredictions for the sentence:")
predict_entities(test_sentence)
