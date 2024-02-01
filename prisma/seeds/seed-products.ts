import { PRICING } from "@prisma/client";
import { qdrantSeedProducts } from "../../qdrant/seed-products";
import { prisma } from "../../src/infra/database/prisma-service";

const productsCategories = [
  {
    name: "Hortaliças, legumes e verduras",
    items: [
      {
        name: "Abóbora Japonesa",
        pricing: "WEIGHT",
        image: "abobora_cabotia.jpg",
      },
      {
        name: "Abóbora Moranga",
        pricing: "WEIGHT",
        image: "abobora_moranga.jpg",
      },
      {
        name: "Abóbora Paulista",
        pricing: "WEIGHT",
        image: "abobora_paulista.jpg",
      },
      {
        name: "Abobrinha Brasileira",
        pricing: "WEIGHT",
        image: "abobrinha_brasileira.jpg",
      },
      {
        name: "Abobrinha Italiana",
        pricing: "WEIGHT",
        image: "abobrinha_italiana.jpg",
      },
      { name: "Acelga", pricing: "WEIGHT", image: "acelga.jpg" },
      { name: "Agrião", pricing: "WEIGHT", image: "agriao.jpg" },
      { name: "Aipim", pricing: "WEIGHT", image: "aipim.jpg" },
      { name: "Alcachofra", pricing: "WEIGHT", image: "alcachofra.jpg" },
      { name: "Alecrim", pricing: "WEIGHT", image: "alecrim.jpg" },
      {
        name: "Alface Americana",
        pricing: "WEIGHT",
        image: "alface_americana.jpg",
      },
      { name: "Alface Crespa", pricing: "WEIGHT", image: "alface_crespa.jpg" },
      { name: "Alface Lisa", pricing: "WEIGHT", image: "alface_lisa.jpg" },
      { name: "Alface Mimosa", pricing: "WEIGHT", image: "alface_mimosa.jpg" },
      {
        name: "Alface Quatro Estações",
        pricing: "WEIGHT",
        image: "alface_quatro_estacoes.jpg",
      },
      { name: "Alface Roxa", pricing: "WEIGHT", image: "alface_roxa.jpg" },
      { name: "Alho", pricing: "WEIGHT", image: "alho.jpg" },
      { name: "Alho Poró", pricing: "WEIGHT", image: "alho_poro.jpg" },
      { name: "Batata Baroa", pricing: "WEIGHT", image: "batata_baroa.jpg" },
      { name: "Batata Branca", pricing: "WEIGHT", image: "batata_branca.jpg" },
      {
        name: "Batata Doce Amarela",
        pricing: "WEIGHT",
        image: "batata_doce_amarela.jpg",
      },
      {
        name: "Batata Doce Rosada",
        pricing: "WEIGHT",
        image: "batata_doce_rosada.jpg",
      },
      { name: "Batata Rosa", pricing: "WEIGHT", image: "batata_rosa.jpg" },
      {
        name: "Berinjela Comum",
        pricing: "WEIGHT",
        image: "berinjela_comum.jpg",
      },
      {
        name: "Berinjela Japonesa",
        pricing: "WEIGHT",
        image: "berinjela_japonesa.jpg",
      },
      { name: "Beterraba", pricing: "WEIGHT", image: "beterraba.jpg" },
      { name: "Brócolis", pricing: "WEIGHT", image: "brocolis.jpg" },
      { name: "Cebola", pricing: "WEIGHT", image: "cebola.jpg" },
      { name: "Cebola Roxa", pricing: "WEIGHT", image: "cebola_roxa.jpg" },
      { name: "Cebolinha", pricing: "WEIGHT", image: "cebolinha.jpg" },
      { name: "Cenoura", pricing: "WEIGHT", image: "cenoura.jpg" },
      { name: "Chuchu", pricing: "WEIGHT", image: "chuchu.jpg" },
      { name: "Coentro", pricing: "WEIGHT", image: "coentro.jpg" },
      { name: "Cogumelo", pricing: "WEIGHT", image: "cogumelo.jpg" },
      { name: "Couve", pricing: "WEIGHT", image: "couve.jpg" },
      {
        name: "Couve Bruxelas",
        pricing: "WEIGHT",
        image: "couve_bruxelas.jpg",
      },
      { name: "Couve-Flor", pricing: "WEIGHT", image: "couve_flor.jpg" },
      { name: "Erva-Doce", pricing: "WEIGHT", image: "erva_doce.jpg" },
      { name: "Espinafre", pricing: "WEIGHT", image: "espinafre.jpg" },
      { name: "Gengibre", pricing: "WEIGHT", image: "gengibre.jpg" },
      { name: "Hortelã", pricing: "WEIGHT", image: "hortela.jpg" },
      { name: "Inhame", pricing: "WEIGHT", image: "inhame.jpg" },
      { name: "Louro", pricing: "WEIGHT", image: "louro.jpg" },
      { name: "Manjericão", pricing: "WEIGHT", image: "manjericao.jpg" },
      { name: "Mostarda", pricing: "WEIGHT", image: "mostarda.jpg" },
      { name: "Nabo", pricing: "WEIGHT", image: "nabo.jpg" },
      { name: "Palmito", pricing: "WEIGHT", image: "palmito.jpg" },
      { name: "Pepino", pricing: "WEIGHT", image: "pepino.jpg" },
      {
        name: "Pimenta Cambuci",
        pricing: "WEIGHT",
        image: "pimenta_cambuci.jpg",
      },
      {
        name: "Pimenta Malagueta",
        pricing: "WEIGHT",
        image: "pimenta_malagueta.jpg",
      },
      {
        name: "Pimenta Vermelha",
        pricing: "WEIGHT",
        image: "pimenta_vermelha.jpg",
      },
      {
        name: "Pimentão Amarelo",
        pricing: "WEIGHT",
        image: "pimentao_amarelo.jpg",
      },
      {
        name: "Pimentão Verde",
        pricing: "WEIGHT",
        image: "pimentao_verde.jpg",
      },
      {
        name: "Pimentão Vermelho",
        pricing: "WEIGHT",
        image: "pimentao_vermelho.jpg",
      },
      {
        name: "Pimenta Dedo-de-moça",
        pricing: "WEIGHT",
        image: "pimenta_dedo_de_moca.jpg",
      },
      { name: "Quiabo", pricing: "WEIGHT", image: "quiabo.jpg" },
      { name: "Rabanete", pricing: "WEIGHT", image: "rabanete.jpg" },
      { name: "Repolho", pricing: "WEIGHT", image: "repolho.jpg" },
      { name: "Rúcula", pricing: "WEIGHT", image: "rucula.jpg" },
      { name: "Salsa", pricing: "WEIGHT", image: "salsa.jpg" },
      { name: "Salsão", pricing: "WEIGHT", image: "salsao.jpg" },
      { name: "Tomate Cereja", pricing: "WEIGHT", image: "tomate_cereja.jpg" },
      { name: "Tomate Gaúcho", pricing: "WEIGHT", image: "tomate_gaucho.jpg" },
      {
        name: "Tomate Italiano",
        pricing: "WEIGHT",
        image: "tomate_italiano.jpg",
      },
      {
        name: "Tomate Longa Vida",
        pricing: "WEIGHT",
        image: "tomate_longa_vida.jpg",
      },
      { name: "Tomilho", pricing: "WEIGHT", image: "tomilho.jpg" },
      { name: "Vagem", pricing: "WEIGHT", image: "vagem.jpg" },
    ],
  },
  {
    name: "Frutas",
    items: [
      { name: "Abacate", pricing: "WEIGHT", image: "abacate.jpg" },
      { name: "Abacaxi", pricing: "WEIGHT", image: "abacaxi.jpg" },
      { name: "Acerola", pricing: "WEIGHT", image: "acerola.jpg" },
      { name: "Ameixa", pricing: "WEIGHT", image: "ameixa.jpg" },
      { name: "Amora", pricing: "WEIGHT", image: "amora.jpg" },
      { name: "Araçá", pricing: "WEIGHT", image: "araca.jpg" },
      {
        name: "Banana Caturra",
        pricing: "WEIGHT",
        image: "banana_caturra.jpg",
      },
      { name: "Banana Maçã", pricing: "WEIGHT", image: "banana_maca.jpg" },
      { name: "Banana Nanica", pricing: "WEIGHT", image: "banana_nanica.jpg" },
      { name: "Banana Prata", pricing: "WEIGHT", image: "banana_prata.jpg" },
      { name: "Bergamota", pricing: "WEIGHT", image: "bergamota.jpg" },
      { name: "Butiá", pricing: "WEIGHT", image: "butia.jpg" },
      { name: "Caqui", pricing: "WEIGHT", image: "caqui.jpg" },
      { name: "Carambola", pricing: "WEIGHT", image: "carambola.jpg" },
      { name: "Cereja", pricing: "WEIGHT", image: "cereja.jpg" },
      { name: "Figo", pricing: "WEIGHT", image: "figo.jpg" },
      { name: "Framboesa", pricing: "WEIGHT", image: "framboesa.jpg" },
      { name: "Goiaba", pricing: "WEIGHT", image: "goiaba.jpg" },
      { name: "Jabuticaba", pricing: "WEIGHT", image: "jabuticaba.jpg" },
      {
        name: "Laranja do Céu",
        pricing: "WEIGHT",
        image: "laranja_do_ceu.jpg",
      },
      { name: "Laranja Pera", pricing: "WEIGHT", image: "laranja_pera.jpg" },
      {
        name: "Laranja Umbigo",
        pricing: "WEIGHT",
        image: "laranja_umbigo.jpg",
      },
      {
        name: "Limão Bergamota",
        pricing: "WEIGHT",
        image: "limao_bergamota.jpg",
      },
      { name: "Limão Taiti", pricing: "WEIGHT", image: "limao_taiti.jpg" },
      { name: "Maçã Nacional Fuji", pricing: "WEIGHT", image: "maca_fuji.jpg" },
      { name: "Maçã Nacional Gala", pricing: "WEIGHT", image: "maca_gala.jpg" },
      { name: "Mamão Formosa", pricing: "WEIGHT", image: "mamao_formosa.jpg" },
      { name: "Mamão Papaya", pricing: "WEIGHT", image: "mamao_papaya.jpg" },
      { name: "Manga", pricing: "WEIGHT", image: "manga.jpg" },
      {
        name: "Maracujá Azedo",
        pricing: "WEIGHT",
        image: "maracuja_azedo.jpg",
      },
      { name: "Maracujá Doce", pricing: "WEIGHT", image: "maracuja_doce.jpg" },
      { name: "Melancia", pricing: "WEIGHT", image: "melancia.jpg" },
      { name: "Melão Amarelo", pricing: "WEIGHT", image: "melao_amarelo.jpg" },
      {
        name: "Melão Casca de Carvalho",
        pricing: "WEIGHT",
        image: "melao_casca_de_carvalho.jpg",
      },
      { name: "Morango", pricing: "WEIGHT", image: "morango.jpg" },
      { name: "Pera", pricing: "WEIGHT", image: "pera.jpg" },
      { name: "Uva", pricing: "WEIGHT", image: "uva.jpg" },
    ],
  },
  {
    name: "Cereais e grãos",
    items: [
      { name: "Amendoim", pricing: "WEIGHT", image: "amendoim.jpg" },
      { name: "Arroz Branco", pricing: "WEIGHT", image: "arroz_branco.jpg" },
      { name: "Arroz Cateto", pricing: "WEIGHT", image: "arroz_cateto.jpg" },
      {
        name: "Arroz Integral",
        pricing: "WEIGHT",
        image: "arroz_integral.jpg",
      },
      {
        name: "Arroz Parboilizado",
        pricing: "WEIGHT",
        image: "arroz_parboilizado.jpg",
      },
      { name: "Ervilha Comum", pricing: "WEIGHT", image: "ervilha_comum.jpg" },
      { name: "Ervilha Torta", pricing: "WEIGHT", image: "ervilha_torta.jpg" },
      { name: "Favas", pricing: "WEIGHT", image: "fava.jpg" },
      { name: "Feijão Azuki", pricing: "WEIGHT", image: "feijao_azuki.jpg" },
      { name: "Feijão Branco", pricing: "WEIGHT", image: "feijao_azuki.jpg" },
      {
        name: "Feijão Carioca",
        pricing: "WEIGHT",
        image: "feijao_carioca.jpg",
      },
      {
        name: "Feijão Fradinho",
        pricing: "WEIGHT",
        image: "feijao_fradinho.jpg",
      },
      { name: "Feijão Preto", pricing: "WEIGHT", image: "feijao_preto.jpg" },
      {
        name: "Feijão Vermelho",
        pricing: "WEIGHT",
        image: "feijao_vermelho.jpg",
      },
      { name: "Grão de Bico", pricing: "WEIGHT", image: "grao_de_bico.jpg" },
      { name: "Lentilha", pricing: "WEIGHT", image: "lentilha.jpg" },
      { name: "Milho", pricing: "WEIGHT", image: "milho.jpg" },
    ],
  },
  {
    name: "Origem animal",
    items: [
      {
        name: "Queijo Colonial",
        pricing: "WEIGHT",
        image: "queijo_colonial.jpg",
      },
      { name: "Ricota", pricing: "WEIGHT", image: "ricota.jpg" },
      { name: "Leite", pricing: "WEIGHT", image: "leite.jpg" },
      { name: "Mel", pricing: "WEIGHT", image: "mel.jpg" },
      { name: "Ovo Branco", pricing: "WEIGHT", image: "ovo_branco.jpg" },
      { name: "Ovo de Codorna", pricing: "WEIGHT", image: "ovo_codorna.jpg" },
      { name: "Ovo vermelho", pricing: "WEIGHT", image: "ovo_vermelho.jpg" },
    ],
  },
];

export async function seedProducts() {
  await prisma.productType.deleteMany();

  for (const category of productsCategories) {
    await prisma.productType.create({
      data: {
        name: category.name,
        products: {
          create: category.items.map((item) => ({
            name: item.name,
            pricing: item.pricing as PRICING,
            image: item.image,
          })),
        },
      },
    });
  }

  const products = await prisma.product.findMany();

  await qdrantSeedProducts(products);
}
