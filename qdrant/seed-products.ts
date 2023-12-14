import "@tensorflow/tfjs-node";
import { QdrantClient } from "@qdrant/js-client-rest";
import * as universalSenteceEncoder from "@tensorflow-models/universal-sentence-encoder";
import { env } from "../src/infra/env";
import { Product } from "@prisma/client";

const client = new QdrantClient({ url: env.QDRANT_URL });

export async function qdrantSeedProducts(products: Product[]) {
  await client.recreateCollection("products", {
    vectors: {
      distance: "Cosine",
      size: 512,
    },
  });

  const model = await universalSenteceEncoder.load();

  const productsNames = products.map(({ name }) => name);

  const productsIds = products.map(({ id }) => id);

  const embeddings = (await model.embed(productsNames)).arraySync();

  await client.upsert("products", {
    batch: {
      ids: productsIds.map((id) => id),
      vectors: embeddings.map((value) => value),
      payloads: productsNames.map((name) => ({
        name,
      })),
    },
  });
}
