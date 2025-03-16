# import numpy as np
import tensorflow as tf
from sklearn.model_selection import train_test_split
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.preprocessing.text import Tokenizer
from function.layers import typeOfLayer
from sklearn.preprocessing import LabelEncoder
import keras
import pickle
from tensorflow.keras import layers, models
from tensorflow.keras.layers import MultiHeadAttention








code = """
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.preprocessing.text import tokenizer_from_json
import pickle
from tensorflow.keras import layers
from tensorflow.keras.layers import MultiHeadAttention
import os
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
loaded_model = tf.keras.models.load_model(model_path, custom_objects=custom_objects, compile=False)
token_path = os.path.join(os.path.dirname(__file__), 'tokenizer.json')
with open(token_path) as f:
    data = f.read()
    loaded_tokenizer = tokenizer_from_json(data)
label_encoder_path = os.path.join(os.path.dirname(__file__), 'label_encoder.pkl')
with open(label_encoder_path, 'rb') as f:
    loaded_label_encoder = pickle.load(f)
def getResult(new_texts):
    maxlen = loaded_model.input_shape[1] 
    new_sequences = loaded_tokenizer.texts_to_sequences([new_texts])
    new_padded_sequences = pad_sequences(new_sequences, maxlen=maxlen, padding='post')
    predictions = loaded_model.predict(new_padded_sequences)
    predicted_classes = np.argmax(predictions, axis=1)
    predicted_label = loaded_label_encoder.inverse_transform(predicted_classes)[0]
    class_probabilities = {str(loaded_label_encoder.inverse_transform([i])[0]): float(prob) for i, prob in enumerate(predictions[0])}
    return predicted_label, class_probabilities
    
    
    """








final_eph = None
def traning_main_model(map_cat,callBack=None,isFinish=None,listOflayers=[],main_traning_stop=None,test_size =0.1,out_dim=64,learning=0.001,epochs= 2000,batch_size=32,profileName = "demo",model_name= "demo"):
    class LossAndErrorPrintingCallback(keras.callbacks.Callback):
      global final_eph
      def on_epoch_end(self, epoch, logs=None):
         global final_eph

         if isFinish():
            self.model.stop_training = True
         if callBack!=None:
             loss = str(logs["loss"])
             accuracy = str(logs["accuracy"])
             val_accuracy = str(logs["val_accuracy"])
             val_loss = str(logs["val_loss"])
             final_eph = {
                 "epoch":epoch,
                 "loss":loss,
                 "accuracy":accuracy,
                 "val_accuracy":val_accuracy,
                 "val_loss":val_loss,
                 "emit_type":"updateing_model"
                        }
             callBack(final_eph)
    txt_list = []
    keys = []
    for i in map_cat:
      if i == 'texts':
         txt_list = map_cat[i]
      elif i == 'label':
         keys = map_cat[i]
    label_encoder = LabelEncoder()
    encoded_labels = label_encoder.fit_transform(keys)
    num_classes = len(label_encoder.classes_)

    
    tokenizer = tf.keras.preprocessing.text.Tokenizer(oov_token='<OOV>', split=" ", filters="")
    tokenizer.fit_on_texts(txt_list)
    total_unique_words = len(tokenizer.word_index) + 1  
    num_words = total_unique_words
    sequences = tokenizer.texts_to_sequences(txt_list)
    maxlen = max(len(seq) for seq in sequences)
    padded_sequences = tf.keras.preprocessing.sequence.pad_sequences(sequences, padding='post', maxlen=maxlen)
    X_train, X_test, y_train, y_test = train_test_split(padded_sequences, encoded_labels, test_size=test_size, random_state=42)
    class MultiHeadSelfAttention(layers.Layer):
       def __init__(self, units, num_heads):
           super(MultiHeadSelfAttention, self).__init__()
           self.attention = MultiHeadAttention(num_heads=num_heads, key_dim=units)

       def call(self, inputs):
           attention_output = self.attention(inputs, inputs)
           return attention_output
    def build_model(vocab_size, max_length, num_classes):
       inputs = layers.Input(shape=(max_length,))
       x = layers.Embedding(input_dim=vocab_size, output_dim=out_dim)(inputs)
       for l_item in listOflayers:
          if l_item["type"] == "dense":
              x = layers.Dense(l_item["persep"]["active"], activation=l_item["activation"]["active"])(x)
          elif l_item["type"] == "multi_head_self_attention":
               x = MultiHeadSelfAttention(units=l_item["persep"]["active"], num_heads=l_item["l1"]["active"])(x) 
          elif l_item["type"] == "global_average_pooling_1D":
                 x = layers.GlobalAveragePooling1D()(x)
          elif l_item["type"] == "batch_normalization":
                 x = layers.BatchNormalization()(x)  
          elif l_item["type"] == "dropout":
             x = layers.Dropout(l_item["active"])(x)
       activation = 'softmax'
       if num_classes == 2:
         activation = 'sigmoid'
       else:
         activation = 'softmax'
       outputs = layers.Dense(num_classes, activation=activation)(x)
       model = models.Model(inputs=inputs, outputs=outputs)
       return model
    model = build_model(num_words,maxlen,num_classes)
    loss = None
    if num_classes == 2:
      loss = 'binary_crossentropy'
    else:
      loss = 'sparse_categorical_crossentropy'
    model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=learning), loss=loss, metrics=['accuracy'])
    print(model.summary())
    print(f"test size rate {test_size}")
    print(f"out dimensions {out_dim}")
    print(f"learning rate {learning}")
    print(f"epochs count {epochs}")
    print(f"batch size {batch_size}")
    model.fit(X_train, y_train, epochs=epochs, batch_size=batch_size, validation_data=(X_test, y_test),callbacks=[LossAndErrorPrintingCallback()])
    test_loss, test_acc = model.evaluate(X_test, y_test)
    model.save(f'models/{profileName}/{model_name}/text_classification_model.h5')
    with open(f'models/{profileName}/{model_name}/tokenizer.json', 'w') as f:
      f.write(tokenizer.to_json())
    with open(f'models/{profileName}/{model_name}/label_encoder.pkl', 'wb') as f:
      pickle.dump(label_encoder, f)
    with open(f"models/{profileName}/{model_name}/generated.py", "w") as file:
         file.write(code)

    if main_traning_stop!=None:
        final_eph["emit_type"] = "finishing_model"
        final_eph["final_loss"] = test_loss
        final_eph["final_acc"] = test_acc
        final_eph["profile_name"] = profileName
        final_eph["model_name"] = model_name
        main_traning_stop(final_eph)

