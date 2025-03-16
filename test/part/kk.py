
import numpy as np
import tensorflow as tf
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.layers import Embedding, LSTM, Dense, Bidirectional, SpatialDropout1D, TimeDistributed, MultiHeadAttention, LayerNormalization
from tensorflow.keras.models import Model
from tensorflow.keras import layers
from tensorflow.keras import Input
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.layers import Dropout
from sklearn.preprocessing import LabelEncoder

# Sample data (replace this with your actual data)


texts = [
    "I m Student of Bangladesh asd",
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
   ["Person","O","O","O","ORG","asd"],
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
import numpy as np
import tensorflow as tf
import pickle
from tensorflow.keras.layers import Input, Embedding, LSTM, Bidirectional, TimeDistributed, Dense
from tensorflow.keras.models import Model
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.preprocessing.sequence import pad_sequences
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder

# Prepare entity tags and labels
label_encoder = LabelEncoder()
all_tags = list(set(tag for doc in labels for tag in doc))
label_encoder.fit(all_tags)

# Save label encoder
with open("label_encoder.pkl", "wb") as f:
    pickle.dump(label_encoder, f)

# Convert labels to numerical values
y = [[label_encoder.transform([tag])[0] for tag in seq] for seq in labels]

# Tokenize texts
tokenizer = tf.keras.preprocessing.text.Tokenizer(lower=True, split=" ")
tokenizer.fit_on_texts(texts)
X = tokenizer.texts_to_sequences(texts)
X = pad_sequences(X, padding='post')

# Pad labels
y = pad_sequences(y, padding='post')

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Model definition
input_dim = len(tokenizer.word_index) + 1
output_dim = len(all_tags)

input_layer = Input(shape=(X_train.shape[1],))
embedding_layer = Embedding(input_dim=input_dim, output_dim=50, input_length=X_train.shape[1])(input_layer)

# LSTM layer
lstm_layer = Bidirectional(LSTM(units=20, return_sequences=True, dropout=0.2, recurrent_dropout=0.2))(embedding_layer)

# Output layer
output_layer = TimeDistributed(Dense(output_dim, activation='softmax'))(lstm_layer)

model = Model(inputs=input_layer, outputs=output_layer)
model.compile(optimizer=Adam(learning_rate=0.01), loss='sparse_categorical_crossentropy', metrics=['accuracy'])

# Train the model
epochs = 600
batch_size = 32

for epoch in range(1, epochs + 1):
    print(f"Epoch {epoch}/{epochs}")
    history = model.fit(X_train, np.expand_dims(y_train, -1), batch_size=batch_size, epochs=1, verbose=0)
    train_loss, train_accuracy = history.history['loss'][0], history.history['accuracy'][0]
    test_loss, test_accuracy = model.evaluate(X_test, np.expand_dims(y_test, -1), verbose=0)
    print(f"Train Loss: {train_loss:.9f} - Train Accuracy: {train_accuracy:.9f} | Test Loss: {test_loss:.9f} - Test Accuracy: {test_accuracy:.9f}")

# Save Model
model.save("ner_model.h5")

# Load Model and Label Encoder for Predictions
def load_model_and_encoder():
    model = tf.keras.models.load_model("ner_model.h5")
    with open("label_encoder.pkl", "rb") as f:
        label_encoder = pickle.load(f)
    return model, label_encoder

import pickle
import json
tokenizer_json = tokenizer.to_json()
with open("tokenizer.json", "w") as f:
    json.dump(tokenizer_json, f)
