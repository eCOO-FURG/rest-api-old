import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

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

async function seed() {
  const admin_account = await prisma.account.create({
    data: {
      id: "test-account",
      email: "admin@ecoo.com.br",
      password: await hash("12345678", 8),
      verified_at: new Date(),
    },
  });

  await prisma.person.create({
    data: {
      account_id: admin_account.id,
      first_name: "Admin",
      last_name: "Account",
      cpf: "58267172033",
    },
  });

  await prisma.product.createMany({
    data: products.map((name) => ({ name })),
  });
}

seed()
  .then(async () => {
    await prisma.$disconnect();
  })

  .catch(async (e) => {
    console.error(e);

    await prisma.$disconnect();

    process.exit(1);
  });
