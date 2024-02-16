import tensorflow
import tensorflow_text
import tensorflow_hub as hub
import numpy

embedding_model = hub.load("https://tfhub.dev/google/universal-sentence-encoder-multilingual/3")