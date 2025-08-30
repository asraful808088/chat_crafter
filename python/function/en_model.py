import tensorflow as tf
from tensorflow.keras.layers import Input, Dense, Embedding, MultiHeadAttention, LayerNormalization, Dropout
from tensorflow.keras.models import Model
from tensorflow.keras.optimizers import Adam
import numpy as np
from sklearn.preprocessing import LabelEncoder
import pickle
import json
from sklearn.model_selection import train_test_split
from tensorflow.keras.preprocessing.text import Tokenizer

demo_layer = [
        {
          "persep": {
            "active": 1024,
            "list": [
              2000,
              512,
              1024,
              2048
            ]
          },
          "l1": {
            "active": 4,
            "list": [
              2,
              3,
              4,
              5,
              6,
              7,
              8,
              9,
              10,
              11,
              12,
              13
            ]
          },
          "l2": {
            "active":None,
            "list": [
              0.1,
              0.2,
              0.3,
              0.4,
              None
            ]
          },
          "activation": {
            "active": "tanh",
            "list": [
              "tanh",
              "relu"
            ]
          },
          "id": 1744005293750,
          "type": "multi_head_self_attention"
        },
      ]
code = """
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




"""
final_eph_en = None



    
class TransformerBlock(tf.keras.layers.Layer):
    def __init__(self, embed_dim, num_heads, ff_dim, rate=0.1):
        super().__init__()
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

class TokenAndPositionEmbedding(tf.keras.layers.Layer):
    def __init__(self, maxlen, vocab_size, embed_dim):
        super().__init__()
        self.token_emb = Embedding(input_dim=vocab_size, output_dim=embed_dim)
        self.pos_emb = Embedding(input_dim=maxlen, output_dim=embed_dim)

    def call(self, x):
        maxlen = tf.shape(x)[-1]
        positions = tf.range(start=0, limit=maxlen, delta=1)
        positions = self.pos_emb(positions)
        x = self.token_emb(x)
        return x + positions




def build_ner_model(maxlen, vocab_size, num_tags,out_dim=64,listOflayers=[]):
    inputs = Input(shape=(maxlen,))
    embedding_layer = TokenAndPositionEmbedding(maxlen, vocab_size, out_dim)
    x = embedding_layer(inputs)
    for layerItem in listOflayers:
        rate = 0
        if layerItem["l2"]["active"] != None:
            rate = layerItem["l2"]["active"]
        transformer_block = TransformerBlock(embed_dim=out_dim, num_heads=layerItem["l1"]["active"], ff_dim=layerItem["persep"]["active"],rate=rate)
        x = transformer_block(x)
    outputs = Dense(num_tags, activation="softmax")(x)
    model = Model(inputs=inputs, outputs=outputs)
    return model


def entities_model_builder(map_cat=None, callBack=None, isFinish=None, listOflayers=demo_layer, main_traning_stop=None, test_size=0.1, out_dim=64, learning=0.001, epochs=20, batch_size=32, profileName="demo", model_name="demo", entities_name="demo"):
    class LossAndErrorPrintingCallback(tf.keras.callbacks.Callback):
        global final_eph
        def on_epoch_end(self, epoch, logs=None):
            global final_eph
            if isFinish and isFinish():
                self.model.stop_training = True
            if callBack is not None:
                loss = str(logs["loss"])
                accuracy = str(logs["accuracy"])
                val_accuracy = str(logs["val_accuracy"])
                val_loss = str(logs["val_loss"])
                final_eph = {
                    "epoch": epoch,
                    "loss": loss,
                    "accuracy": accuracy,
                    "val_accuracy": val_accuracy,
                    "val_loss": val_loss,
                    "emit_type": "updateing_model"
                }
                callBack(final_eph)

  
    
    tokenizer = Tokenizer(oov_token="<OOV>",filters="")
    tokenizer.word_index = {"<PAD>": 0, "<UNK>": 1}
    tokenizer.fit_on_texts(map_cat["texts"])
    
    
    tag_encoder = LabelEncoder()
    tag_encoder.fit([tag for tags in map_cat["label"] for tag in tags])

    vocab_size = len(tokenizer.word_index) + 1
    num_tags = len(tag_encoder.classes_)
    max_len = max(len(s) for s in map_cat["texts"])
    X = tokenizer.texts_to_sequences(map_cat["texts"])






    X = tf.keras.preprocessing.sequence.pad_sequences(X, maxlen=max_len, padding="post")

    # y = np.array([tag_encoder.transform(t) for t in map_cat["label"]])
    # y = tf.keras.preprocessing.sequence.pad_sequences(y, maxlen=max_len, padding="post", value=-100)
    y_list = [tag_encoder.transform(t) for t in map_cat["label"]]
    y = tf.keras.preprocessing.sequence.pad_sequences(y_list, maxlen=max_len, padding="post", value=-100)
















    model = build_ner_model(max_len, vocab_size, num_tags,out_dim,listOflayers=listOflayers)
    model.compile(
        optimizer=Adam(learning),
        loss=tf.keras.losses.SparseCategoricalCrossentropy(ignore_class=-100),
        metrics=["accuracy"]
    )

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=test_size)
    print(model.summary())
    model.fit(X_train, np.expand_dims(y_train, -1), batch_size=batch_size, epochs=epochs,callbacks=[LossAndErrorPrintingCallback()],validation_data=(X_test, y_test), verbose=1)
    import os
    if not os.path.exists(f"entities\\{profileName}\\{entities_name}\\{model_name.replace('-','_')}"):
         os.makedirs(f"entities\\{profileName}\\{entities_name}\\{model_name.replace('-','_')}")
    
    model.save(f"entities\\{profileName}\\{entities_name}\\{model_name.replace('-','_')}\\ner_model_from_scratch.keras")
 
    
    with open(f"entities/{profileName}/{entities_name}/{model_name.replace('-','_')}/saveword_vocab.pkl", "wb") as f:
        pickle.dump(tokenizer, f)
      

    with open(f"entities/{profileName}/{entities_name}/{model_name.replace('-','_')}/tag_encoder.pkl", "wb") as f:
        pickle.dump(tag_encoder, f)

    with open(f"entities/{profileName}/{entities_name}/{model_name.replace('-','_')}/max_len.json", "w") as f:
        json.dump({"max_len": max_len}, f)

    with open(f"entities/{profileName}/{entities_name}/{model_name.replace('-','_')}/generated.py", "w") as file:
        file.write(code)
    test_loss, test_acc = model.evaluate(X_test, y_test)
    final_eph_en = {}
    if main_traning_stop is not None:
        final_eph_en["emit_type"] = "finishing_model_en"
        final_eph_en["final_loss"] = test_loss
        final_eph_en["epoch"] = final_eph["epoch"]
        final_eph_en["final_acc"] = test_acc
        final_eph_en["profile_name"] = profileName
        final_eph_en["model_name"] = model_name.replace('-','_')
        main_traning_stop(final_eph_en)