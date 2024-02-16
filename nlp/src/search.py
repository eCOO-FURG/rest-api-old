import os

from utils.normalize import normalize
from qdrant_service import qdrant_client
from model import embedding_model

def search(collection, query, limit=10):
    normalized_query = normalize(query)
    vector = embedding_model([normalized_query])[0].numpy().tolist()

    similar_vectors = qdrant_client.search(
        collection_name=collection,
        query_vector=vector,
        limit=limit,
        score_threshold= float(os.environ.get("EXPECTED_SIMILARITY_SCORE", 0.1))
    )

    return [
        {'name': item.payload['name'], 'score': item.score}
        for item in similar_vectors
    ]
