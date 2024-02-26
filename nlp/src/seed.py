import json
import tensorflow
import tensorflow_text
import tensorflow_hub as hub
import numpy as np
from qdrant_client.models import Distance, VectorParams, Batch

from utils.normalize import normalize
from qdrant_service import qdrant_client

with open('./products.json', 'r') as json_file:
    products_data = json.load(json_file)

model = hub.load("https://tfhub.dev/google/universal-sentence-encoder-multilingual/3")

qdrant_client.recreate_collection(
    collection_name="products",
    vectors_config=VectorParams(size=512, distance=Distance.COSINE),
)

products = []
for products_by_category in products_data:
    for i, product in enumerate(products_by_category['items']):
        value_normalized = normalize(product['name'])

        vector = model([value_normalized]).numpy().tolist()[0]

        products.append(
            {"id": i, "name": product['name'], "vector": vector }
        )

qdrant_client.upsert(
    collection_name="products",
    points=Batch(
    ids=[item["id"] for item in products],
    payloads=[{"name": item["name"]} for item in products],
    vectors=[item["vector"] for item in products],
    ),
)

print("\n Your database is now sync with your seed. 🌱")
