import "@tensorflow/tfjs-node";
import { QdrantClient } from "@qdrant/js-client-rest";
import * as universalSenteceEncoder from "@tensorflow-models/universal-sentence-encoder";
import { env } from "../src/infra/env";

const client = new QdrantClient({ url: env.QDRANT_URL });

const products = [
  "Abóbora Cabotiá",
  "Abóbora Japonesa",
  "Abóbora Moranga",
  "Abóbora Paulista",
  "Abobrinha Brasileira",
  "Abobrinha Italiana",
  "Acelga",
  "Agrião",
  "Aipim",
  "Alcachofra",
  "Alecrim",
  "Alface Americana",
  "Alface Crespa",
  "Alface Lisa",
  "Alface Mimosa",
  "Alface Quatro Estações",
  "Alface Roxa",
  "Alho",
  "Alho Poró",
  "Batata Baroa",
  "Batata Branca",
  "Batata Doce Amarela",
  "Batata Doce Rosada",
  "Batata Rosa",
  "Berinjela Comum",
  "Berinjela Japonesa",
  "Beterraba",
  "Brócolis",
  "Cebola",
  "Cebola Roxa",
  "Cebolinha",
  "Cenoura",
  "Chuchu",
  "Coentro",
  "Cogumelo",
  "Couve",
  "Couve Bruxelas",
  "Couve-Flor",
  "Erva-Doce",
  "Espinafre",
  "Gengibre",
  "Hortelã",
  "Inhame",
  "Louro",
  "Manjericão",
  "Mostarda",
  "Nabo",
  "Palmito",
  "Pepino",
  "Pimenta Cambuci",
  "Pimenta Malagueta",
  "Pimenta Vermelha",
  "Pimentão Amarelo",
  "Pimentão Verde",
  "Pimentão Vermelho",
  "Pimenta Dedo-de-moça",
  "Quiabo",
  "Rabanete",
  "Repolho",
  "Rúcula",
  "Salsa",
  "Salsão",
  "Tomate Cereja",
  "Tomate Gaúcho",
  "Tomate Italiano",
  "Tomate Longa Vida",
  "Tomilho",
  "Vagem",
  "Abacate",
  "Abacaxi",
  "Acerola",
  "Ameixa",
  "Amora",
  "Araçá",
  "Banana Caturra",
  "Banana Maçã",
  "Banana Nanica",
  "Banana Prata",
  "Bergamota",
  "Butiá",
  "Caqui",
  "Carambola",
  "Cereja",
  "Figo",
  "Framboesa",
  "Goiaba",
  "Jabuticaba",
  "Laranja do Céu",
  "Laranja Pera",
  "Laranja Umbigo",
  "Limão Bergamota",
  "Limão Taiti",
  "Maçã Nacional Fuji",
  "Maçã Nacional Gala",
  "Mamão Formosa",
  "Mamão Papaya",
  "Manga",
  "Maracujá Azedo",
  "Maracujá Doce",
  "Melancia",
  "Melão Amarelo",
  "Melão Casca de Carvalho",
  "Morango",
  "Pera",
  "Uva",
  "Amendoim",
  "Arroz Branco",
  "Arroz Cateto",
  "Arroz Integral",
  "Arroz Parboilizado",
  "Ervilha Comum",
  "Ervilha Torta",
  "Favas",
  "Feijão Azuki",
  "Feijão Branco",
  "Feijão Carioca",
  "Feijão Fradinho",
  "Feijão Preto",
  "Feijão Vermelho",
  "Grão de Bico",
  "Lentilha",
  "Milho",
];

function removeAccents(text: string) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export async function seed() {
  await client.recreateCollection("products", {
    vectors: {
      distance: "Cosine",
      size: 512,
    },
  });

  const model = await universalSenteceEncoder.load();

  const processedProducts = products.map((product) => removeAccents(product));

  const embeddings = (await model.embed(processedProducts)).arraySync();

  const productsWithEmbeddings = products.map((product, index) => ({
    name: product,
    embeeding: embeddings[index],
  }));

  await client.upsert("products", {
    batch: {
      vectors: productsWithEmbeddings.map((product) => product.embeeding),
      ids: productsWithEmbeddings.map((_, index) => index),
      payloads: productsWithEmbeddings.map((product) => ({
        name: product.name,
      })),
    },
  });
}

seed();
