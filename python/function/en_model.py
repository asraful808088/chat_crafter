
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
import keras
from sklearn.preprocessing import LabelEncoder
import pickle

code = """

import tensorflow as tf
from tensorflow.keras import layers
from tensorflow.keras.layers import MultiHeadAttention
import os
from tensorflow.keras.preprocessing.text import tokenizer_from_json
import numpy as np
import pickle
from tensorflow.keras.preprocessing.sequence import pad_sequences
import json
model_path = os.path.join(os.path.dirname(__file__), "text_classification_model.h5")
class MultiHeadSelfAttention(layers.Layer):
    def __init__(self, units, num_heads, **kwargs):
        super(MultiHeadSelfAttention, self).__init__(**kwargs)
        self.attention = MultiHeadAttention(num_heads=num_heads, key_dim=units)

    def call(self, inputs):
        return self.attention(inputs, inputs)

    def get_config(self):
        config = super(MultiHeadSelfAttention, self).get_config()
        config.update({
            'units': self.attention.key_dim,
            'num_heads': self.attention.num_heads,
        })
        return config
custom_objects = {
    'MultiHeadSelfAttention': MultiHeadSelfAttention
}
def load_model_and_encoder():
    model = tf.keras.models.load_model(model_path, custom_objects=custom_objects, compile=False)

    with open(os.path.join(os.path.dirname(__file__), "tokenizer.json"), "r") as f:
        tokenizer_data = json.load(f)  
        tokenizer_json_str = json.dumps(tokenizer_data) 
        tokenizer = tokenizer_from_json(tokenizer_json_str)

    with open(os.path.join(os.path.dirname(__file__), "label_encoder.pkl"), "rb") as f:
        label_encoder = pickle.load(f)

    return model, tokenizer, label_encoder

def predict_entities(test_sentence):
    list_of_chunk = []
    model, tokenizer, label_encoder = load_model_and_encoder()

    test_sequence = tokenizer.texts_to_sequences([test_sentence])

    max_len = model.input_shape[1]  
    test_sequence_padded = pad_sequences(test_sequence, padding='post', maxlen=max_len)

    predictions = model.predict(test_sequence_padded)
    predicted_labels = np.argmax(predictions, axis=-1)[0]

    predicted_tags = label_encoder.inverse_transform(predicted_labels)

    tokens = test_sentence.split()
    for token, tag in zip(tokens, predicted_tags):
        list_of_chunk.append((token,str(tag)))
    return list_of_chunk



"""




final_eph_en = None
class MultiHeadSelfAttention(layers.Layer):
       def __init__(self, units, num_heads):
           super(MultiHeadSelfAttention, self).__init__()
           self.attention = MultiHeadAttention(num_heads=num_heads, key_dim=units)

       def call(self, inputs):
           attention_output = self.attention(inputs, inputs)
           return attention_output
def entities_model_builder(map_cat,callBack=None,isFinish=None,listOflayers=[],main_traning_stop=None,test_size =0.1,out_dim=64,learning=0.001,epochs= 2000,batch_size=32,profileName = "demo",model_name= "demo",entities_name="demo"):
     class LossAndErrorPrintingCallback(keras.callbacks.Callback):
        global final_eph_en
        def on_epoch_end(self, epoch, logs=None):
           global final_eph_en

           if isFinish():
              self.model.stop_training = True
           if callBack!=None:
               loss = str(logs["loss"])
               accuracy = str(logs["accuracy"])
               val_accuracy = str(logs["val_accuracy"])
               val_loss = str(logs["val_loss"])
               final_eph_en = {
                   "epoch":epoch,
                   "loss":loss,
                   "accuracy":accuracy,
                   "val_accuracy":val_accuracy,
                   "val_loss":val_loss,
                   "emit_type":"updateing_model_en"
                          }
               callBack(final_eph_en)

     label_encoder = LabelEncoder()
     all_labels = [tag for doc in map_cat["label"] for tag in doc]
     label_encoder.fit(all_labels)

 


     X = map_cat["texts"]

     y = [label_encoder.transform(seq) for seq in map_cat["label"]]
     tokenizer = tf.keras.preprocessing.text.Tokenizer(lower=True, split=" ", filters="")
     tokenizer.fit_on_texts(X)
     X = tokenizer.texts_to_sequences(X)
     X = pad_sequences(X, padding='post')
     y = pad_sequences(y, padding='post')
     X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=test_size)
     max_length = min(len(X_train[0]), len(y_train[0])) 
     X_train = pad_sequences(X_train, maxlen=max_length, padding='post')
     y_train = pad_sequences(y_train, maxlen=max_length, padding='post')
     X_test = pad_sequences(X_test, maxlen=max_length, padding='post')
     y_test = pad_sequences(y_test, maxlen=max_length, padding='post')

     input_dim = len(tokenizer.word_index) + 1  
     output_dim = len(label_encoder.classes_)   




     input_layer = Input(shape=(X_train.shape[1],))
     x = Embedding(input_dim=input_dim, output_dim=out_dim, input_length=X_train.shape[1])(input_layer)






     for l_item in listOflayers:
          if l_item["type"] == "B_LSTM":
              drop_layer = 0 
              if l_item["l2"]["active"] == None or l_item["l2"]["active"] < 1:
                 drop_layer = 0
              else:
                drop_layer = l_item["l2"]["active"]
              x = Bidirectional(LSTM(units=l_item["persep"]["active"], return_sequences=True, dropout=drop_layer, recurrent_dropout=0.2))(x)
          elif l_item["type"] == "multi_head_self_attention":
               x = MultiHeadSelfAttention(units=l_item["persep"]["active"], num_heads=l_item["l1"]["active"])(x) 
          elif l_item["type"] == "batch_normalization":
                 x = LayerNormalization()(x)
          elif l_item["type"] == "dropout":
             x = Dropout(l_item["active"])(x)
          elif l_item["type"] == "s1d_dropout":
             x = SpatialDropout1D(l_item["active"])(x)    
    

     output_layer = TimeDistributed(Dense(output_dim, activation='softmax'))(x)
     model = Model(inputs=input_layer, outputs=output_layer)
     model.compile(optimizer=Adam(learning_rate=learning), loss='sparse_categorical_crossentropy', metrics=['accuracy'])
     print(model.summary())
     print(f"test size rate {test_size}")
     print(f"out dimensions {out_dim}")
     print(f"learning rate {learning}")
     print(f"epochs count {epochs}")
     print(f"batch size {batch_size}")
     model.fit(X_train, np.expand_dims(y_train, -1), batch_size=batch_size, epochs=epochs, verbose=1, validation_data=(X_test, y_test),callbacks=[LossAndErrorPrintingCallback()])
     test_loss, test_acc = model.evaluate(X_test, y_test)
     model.save(f'entities/{profileName}/{entities_name}/{model_name}/text_classification_model.h5')
     with open(f'entities/{profileName}/{entities_name}/{model_name}/tokenizer.json', 'w') as f:
       f.write(tokenizer.to_json())
     with open(f'entities/{profileName}/{entities_name}/{model_name}/label_encoder.pkl', 'wb') as f:
      pickle.dump(label_encoder, f)
     with open(f"entities/{profileName}/{entities_name}/{model_name}/generated.py", "w") as file:
         file.write(code)
     if main_traning_stop!=None:
        final_eph_en["emit_type"] = "finishing_model_en"
        final_eph_en["final_loss"] = test_loss
        final_eph_en["final_acc"] = test_acc
        final_eph_en["profile_name"] = profileName
        final_eph_en["model_name"] = model_name
        main_traning_stop(final_eph_en)