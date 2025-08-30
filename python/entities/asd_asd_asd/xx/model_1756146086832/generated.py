
import tensorflow as tf
import pickle
import numpy as np
from tensorflow.keras.layers import Dense, Embedding, MultiHeadAttention, LayerNormalization, Dropout
import os
model_path = os.path.join(os.path.dirname(__file__), "ner_model_from_scratch.keras")
import json


    
@tf.keras.utils.register_keras_serializable(package="Custom")
class TokenAndPositionEmbedding(tf.keras.layers.Layer):
    def __init__(self, maxlen, vocab_size, embed_dim, **kwargs):
        super().__init__(**kwargs)
        self.maxlen = maxlen
        self.vocab_size = vocab_size
        self.embed_dim = embed_dim
        
        self.token_emb = Embedding(input_dim=vocab_size, output_dim=embed_dim)
        self.pos_emb = Embedding(input_dim=maxlen, output_dim=embed_dim)

    def call(self, x):
        maxlen = tf.shape(x)[-1]
        positions = tf.range(start=0, limit=maxlen, delta=1)
        positions = self.pos_emb(positions)
        x = self.token_emb(x)
        return x + positions

    def get_config(self):
        config = super().get_config()
        config.update({
            "maxlen": self.maxlen,
            "vocab_size": self.vocab_size,
            "embed_dim": self.embed_dim
        })
        return config
    
@tf.keras.utils.register_keras_serializable(package="Custom")
class TransformerBlock(tf.keras.layers.Layer):
    def __init__(self, embed_dim, num_heads, ff_dim, rate=0.1, **kwargs):
        super().__init__(**kwargs)
        self.embed_dim = embed_dim
        self.num_heads = num_heads
        self.ff_dim = ff_dim
        self.rate = rate
        
        self.att = MultiHeadAttention(num_heads=num_heads, key_dim=embed_dim)
        self.ffn = tf.keras.Sequential([
            Dense(ff_dim, activation="relu"),
            Dense(embed_dim)
        ])
        self.layernorm1 = LayerNormalization(epsilon=1e-6)
        self.layernorm2 = LayerNormalization(epsilon=1e-6)
        self.dropout1 = Dropout(rate)
        self.dropout2 = Dropout(rate)

    def call(self, inputs, training=False):
        attn_output = self.att(inputs, inputs)
        attn_output = self.dropout1(attn_output, training=training)
        out1 = self.layernorm1(inputs + attn_output)
        ffn_output = self.ffn(out1)
        ffn_output = self.dropout2(ffn_output, training=training)
        return self.layernorm2(out1 + ffn_output)

    def get_config(self):
        config = super().get_config()
        config.update({
            "embed_dim": self.embed_dim,
            "num_heads": self.num_heads,
            "ff_dim": self.ff_dim,
            "rate": self.rate
        })
        return config
custom_objects = {
    "TokenAndPositionEmbedding": TokenAndPositionEmbedding,
    "TransformerBlock": TransformerBlock
}

model = tf.keras.models.load_model(model_path, custom_objects=custom_objects)

with open(os.path.join(os.path.dirname(__file__), "saveword_vocab.pkl") , "rb") as f:
    tokenizer = pickle.load(f)

with open(os.path.join(os.path.dirname(__file__), "tag_encoder.pkl"), "rb") as f:
    tag_encoder = pickle.load(f)

with open(os.path.join(os.path.dirname(__file__), "max_len.json"), "r") as f:
    data = json.load(f)
    max_len = data["max_len"]

def predict_entities(text): 
    list_of_chunk = []
    tokens = text.split()
    encoded = tokenizer.texts_to_sequences([tokens])[0]
    padded = tf.keras.preprocessing.sequence.pad_sequences(
        [encoded], maxlen=max_len, padding="post"
    )
    preds = model.predict(padded, verbose=0)[0]
    pred_tags = tag_encoder.inverse_transform(np.argmax(preds[:len(tokens)], axis=-1))
    for token, tag in list(zip(tokens, pred_tags)):
        list_of_chunk.append((token,str(tag)))
    return list_of_chunk




print(predict_entities('Create account email exp@gmail.com username exp password QQqq!!11'))
