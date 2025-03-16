# import numpy as np
# import tensorflow as tf
# from tensorflow.keras import layers, models
# from sklearn.model_selection import train_test_split
# from sklearn.preprocessing import LabelEncoder

# # 1. Create a Demo Multicategory Text Dataset
# texts = [
#     "I love this product", "This is the best purchase I've made", 
#     "Absolutely fantastic experience", "I am very happy with this", 
#     "Worst product ever", "I hate this", 
#     "Terrible experience", "I am disappointed with this",
#     "Not good", "Will never buy again",
#     "It's okay, not great", "Average quality", 
#     "It's fine, nothing special", "Neutral experience",
#     "I love this product", "This is the best purchase I've made", 
#     "Absolutely fantastic experience", "I am very happy with this", 
#     "Worst product ever", "I hate this", 
#     "Terrible experience", "I am disappointed with this",
#     "Not good", "Will never buy again",
#     "It's okay, not great", "Average quality", 
#     "It's fine, nothing special", "Neutral experience",
#     "I love this product", "This is the best purchase I've made", 
#     "Absolutely fantastic experience", "I am very happy with this", 
#     "Worst product ever", "I hate this", 
#     "Terrible experience", "I am disappointed with this",
#     "Not good", "Will never buy again",
#     "It's okay, not great", "Average quality", 
#     "It's fine, nothing special", "Neutral experience",
#     "I love this product", "This is the best purchase I've made", 
#     "Absolutely fantastic experience", "I am very happy with this", 
#     "Worst product ever", "I hate this", 
#     "Terrible experience", "I am disappointed with this",
#     "Not good", "Will never buy again",
#     "It's okay, not great", "Average quality", 
#     "It's fine, nothing special", "Neutral experience",
#     "I love this product", "This is the best purchase I've made", 
#     "Absolutely fantastic experience", "I am very happy with this", 
#     "Worst product ever", "I hate this", 
#     "Terrible experience", "I am disappointed with this",
#     "Not good", "Will never buy again",
#     "It's okay, not great", "Average quality", 
#     "It's fine, nothing special", "Neutral experience",
# ]
# labels = [
#     "Positive", "Positive", "Positive", "Positive", 
#     "Negative", "Negative", "Negative", "Negative", 
#     "Negative", "Negative", 
#     "Neutral", "Neutral", 
#     "Neutral", "Neutral",
#     "Positive", "Positive", "Positive", "Positive", 
#     "Negative", "Negative", "Negative", "Negative", 
#     "Negative", "Negative", 
#     "Neutral", "Neutral", 
#     "Neutral", "Neutral",
#     "Positive", "Positive", "Positive", "Positive", 
#     "Negative", "Negative", "Negative", "Negative", 
#     "Negative", "Negative", 
#     "Neutral", "Neutral", 
#     "Neutral", "Neutral",
#     "Positive", "Positive", "Positive", "Positive", 
#     "Negative", "Negative", "Negative", "Negative", 
#     "Negative", "Negative", 
#     "Neutral", "Neutral", 
#     "Neutral", "Neutral",
#     "Positive", "Positive", "Positive", "Positive", 
#     "Negative", "Negative", "Negative", "Negative", 
#     "Negative", "Negative", 
#     "Neutral", "Neutral", 
#     "Neutral", "Neutral",
# ]

# # Encode labels
# label_encoder = LabelEncoder()
# encoded_labels = label_encoder.fit_transform(labels)
# num_classes = len(label_encoder.classes_)

# # 2. Tokenize and Pad Sequences
# tokenizer = tf.keras.preprocessing.text.Tokenizer(num_words=100, oov_token="<OOV>")
# tokenizer.fit_on_texts(texts)
# sequences = tokenizer.texts_to_sequences(texts)
# padded_sequences = tf.keras.preprocessing.sequence.pad_sequences(sequences, padding='post', maxlen=10)

# # Split data
# X_train, X_test, y_train, y_test = train_test_split(padded_sequences, encoded_labels, test_size=0.2, random_state=42)

# from tensorflow.keras import layers, models
# from tensorflow.keras.layers import MultiHeadAttention

# class MultiHeadSelfAttention(layers.Layer):
#     def __init__(self, units, num_heads):
#         super(MultiHeadSelfAttention, self).__init__()
#         self.attention = MultiHeadAttention(num_heads=num_heads, key_dim=units)

#     def call(self, inputs):
#         attention_output = self.attention(inputs, inputs)
#         return attention_output

# def build_model(vocab_size, max_length, num_classes):
#     inputs = layers.Input(shape=(max_length,))
#     x = layers.Embedding(input_dim=vocab_size, output_dim=128)(inputs)  
#     x = layers.Dense(128, activation='relu')(x)  

#     x = layers.Dropout(0.5)(x)  
#     x = MultiHeadSelfAttention(units=64, num_heads=8)(x) 
#     # x = layers.Dropout(0.5)(x)  

#     # x = layers.Dense(128, activation='relu')(x)  
#     # x = layers.Dropout(0.5)(x)  
#     # x = layers.Dropout(0.5)(x)  
#     x = layers.GlobalAveragePooling1D()(x)
#     # # x = layers.BatchNormalization()(x)  
#     # # x = layers.Dense(128, activation='relu')(x)  
#     # x = layers.Dense(128, activation='relu')(x)  
#     # x = layers.Dropout(0.5)(x)  
#     outputs = layers.Dense(num_classes, activation='softmax')(x)
#     model = models.Model(inputs=inputs, outputs=outputs)
#     return model

# # Build and compile model
# vocab_size = len(tokenizer.word_index) + 1
# max_length = 10
# model = build_model(vocab_size, max_length, num_classes)
# model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])

# # 4. Train the Model
# history = model.fit(X_train, y_train, epochs=210, batch_size=2, validation_data=(X_test, y_test))

# # 5. Evaluate the Model
# test_loss, test_acc = model.evaluate(X_test, y_test)
# print(f'Test Loss: {test_loss}, Test Accuracy: {test_acc}')

# # 6. Predict New Values
# def predict_text(text_list):
#     # Tokenize and pad new text data
#     sequences = tokenizer.texts_to_sequences(text_list)
#     padded_sequences = tf.keras.preprocessing.sequence.pad_sequences(sequences, padding='post', maxlen=10)
    
#     # Make predictions
#     predictions = model.predict(padded_sequences)
#     predicted_classes = np.argmax(predictions, axis=1)
    
#     # Decode predictions
#     decoded_predictions = label_encoder.inverse_transform(predicted_classes)
#     return decoded_predictions

# # New text samples for prediction
# new_texts = [
#     "Neutral experience",
#     "Not good", "Will never buy again","I love My Mom","I hate this"
# ]

# # Predict and display the results
# predicted_categories = predict_text(new_texts)
# for text, category in zip(new_texts, predicted_categories):
#     print(f'Text: "{text}" => Predicted Category: {category}')
# Sample data: list of lists containing category labels
from sklearn.preprocessing import LabelEncoder

map_cat = {
    "label": [
        ["sports", "news"],
        ["news", "politics"],
        ["sports", "entertainment"],
        ["technology", "news"]
    ]
}

# Extract unique tags
all_tags = list(set(tag for doc in map_cat["label"] for tag in doc))

# Create a dictionary mapping each tag to a unique index
tag2idx = {tag: i for i, tag in enumerate(all_tags)}
label_encoder = LabelEncoder()
encoded_labels = label_encoder.fit_transform(all_tags)
# Print results
output_dim = len(tag2idx) 

y = [[tag2idx[tag] for tag in seq] for seq in  map_cat["label"]]
print("Tag to Index Mapping:", y)
# print("Tag to Index Mapping:", tag2idx)
# print("Tag to Index Mapping:", len(encoded_labels))
