import spacy
from spacy.training.example import Example
import random

# Step 1: Prepare Your Custom Training Data
TRAIN_DATA = [
    ("Hello world! How are you doing today?", {"entities": []}),
    ("Barack Obama visited New York yesterday.", {"entities": [(0, 2, "PERSON"), (22, 30, "GPE")]}),
    
    
]

# Step 2: Create a Blank Model
nlp = spacy.blank("en")  # Blank model, no pre-trained weights

# Step 3: Create the NER Pipeline
# Add NER component to the pipeline (since it's a blank model, we'll add a new NER component)
ner = nlp.add_pipe("ner", last=True)

# Step 4: Add Labels to the NER Pipeline
ner.add_label("PERSON")
ner.add_label("GPE")

# Step 5: Prepare for Training (no pre-trained model, so we don't need to load anything)
optimizer = nlp.begin_training()

# Step 6: Train the Model
for epoch in range(20):  # Train for 20 epochs
    print(f"Epoch {epoch+1}")
    random.shuffle(TRAIN_DATA)
    
    # Shuffle and iterate over the training data
    for text, annotations in TRAIN_DATA:
        # Create Example object
        doc = nlp.make_doc(text)
        example = Example.from_dict(doc, annotations)
        
        # Update the model with the Example
        nlp.update([example], drop=0.5)

    print(f"Epoch {epoch+1} complete")

# Step 7: Save the Trained Model
nlp.to_disk("my_custom_ner_model")

# Step 8: Load and Test the Trained Model

# Load the trained model
nlp = spacy.load("my_custom_ner_model")

# Test the model on a new sentence
test_sentence = "Barack Obama visited Paris yesterday."
doc = nlp(test_sentence)

# Print the recognized entities
print("\nRecognized Entities:")
for ent in doc.ents:
    print(f"Entity: {ent.text}, Label: {ent.label_}")
