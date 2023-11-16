import { QdrantClient } from "@qdrant/js-client-rest";
import { env } from "../env";

export const qdrant = new QdrantClient({ url: env.QDRANT_URL });
