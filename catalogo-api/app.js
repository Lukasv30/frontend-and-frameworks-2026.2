// app.js - camada de tela
// Este arquivo SÓ mexe no DOM. Todo fetch fica no api.js.

const areaCatalogo = document.getElementById("catalogo");
const areaMensagem = document.getElementById("mensagem");
const areaCategorias = document.getElementById("categorias");
const caixaDetalhe = document.getElementById("detalhe");
const formBusca = document.getElementById("busca");
const campoBusca = document.getElementById("busca-texto");
const areaPedido = document.getElementById("pedido");

// Desafio extra 3: pedido da lanchonete (carrinho)
const pedido = [];

// Guarda a última ação para o botão "Tentar novamente" (desafio extra 1)
let ultimaAcao = null;

// ---------- helpers de tela ----------

function mostrarMensagem(texto) {
  areaMensagem.textContent = texto;
}

// Desafio extra 1: mensagem de erro com botão "Tentar novamente"
function mostrarErro(erro) {
  areaMensagem.textContent = "Erro: " + erro.message + " ";
  if (ultimaAcao) {
    const botao = document.createElement("button");
    botao.textContent = "Tentar novamente";
    botao.addEventListener("click", ultimaAcao);
    areaMensagem.appendChild(botao);
  }
}

function atualizarPedido() {
  const total = pedido.reduce(function (soma, item) {
    return soma + item.price;
  }, 0);
  areaPedido.textContent =
    "Pedido: " + pedido.length + (pedido.length === 1 ? " item" : " itens") +
    " - US$ " + total.toFixed(2);
}

function marcarCategoriaAtiva(slug) {
  for (const botao of areaCategorias.querySelectorAll("button")) {
    botao.classList.toggle("ativo", botao.dataset.slug === slug);
  }
}

// ---------- cards ----------

function criarCard(produto) {
  const card = document.createElement("article");
  card.className = "card";

  // textContent (e não innerHTML) para dados vindos de fora: evita XSS
  const foto = document.createElement("img");
  foto.src = produto.thumbnail;
  foto.alt = produto.title;
  foto.loading = "lazy";

  const nome = document.createElement("h3");
  nome.textContent = produto.title;

  const preco = document.createElement("p");
  preco.textContent = "US$ " + produto.price;

  card.append(foto, nome, preco);

  card.addEventListener("click", function () {
    abrirDetalhe(produto.id);
  });
  return card;
}

function renderizarProdutos(produtos) {
  areaCatalogo.innerHTML = "";
  if (produtos.length === 0) {
    mostrarMensagem("Nenhum produto encontrado.");
    return;
  }
  mostrarMensagem("");
  for (const produto of produtos) {
    areaCatalogo.appendChild(criarCard(produto));
  }
}

// ---------- detalhe ----------

async function abrirDetalhe(id) {
  try {
    const produto = await getProduto(id);
    caixaDetalhe.innerHTML = "";

    const foto = document.createElement("img");
    foto.src = produto.thumbnail;
    foto.alt = produto.title;

    const titulo = document.createElement("h2");
    titulo.textContent = produto.title;

    const resumo = document.createElement("p");
    resumo.textContent = produto.category + " - US$ " + produto.price;

    const descricao = document.createElement("p");
    descricao.textContent = produto.description;

    const botaoAdicionar = document.createElement("button");
    botaoAdicionar.textContent = "Adicionar ao pedido";
    botaoAdicionar.addEventListener("click", function () {
      pedido.push(produto);
      atualizarPedido();
      botaoAdicionar.textContent = "Adicionado!";
      botaoAdicionar.disabled = true;
    });

    const botaoFechar = document.createElement("button");
    botaoFechar.textContent = "Fechar";
    botaoFechar.addEventListener("click", function () {
      caixaDetalhe.close();
    });

    caixaDetalhe.append(foto, titulo, resumo, descricao, botaoAdicionar, botaoFechar);
    caixaDetalhe.showModal();
  } catch (erro) {
    mostrarErro(erro);
  }
}

// ---------- estados: carregando / erro / vazio / sucesso ----------

async function carregarProdutos(categoria) {
  ultimaAcao = function () { carregarProdutos(categoria); };
  marcarCategoriaAtiva(categoria);
  areaCatalogo.innerHTML = "";
  mostrarMensagem("Carregando...");
  try {
    const produtos = await getProdutos(categoria);
    renderizarProdutos(produtos);
  } catch (erro) {
    mostrarErro(erro);
  }
}

async function buscar(texto) {
  ultimaAcao = function () { buscar(texto); };
  marcarCategoriaAtiva(null);
  areaCatalogo.innerHTML = "";
  mostrarMensagem("Carregando...");
  try {
    const produtos = await buscarProdutos(texto);
    renderizarProdutos(produtos);
  } catch (erro) {
    mostrarErro(erro);
  }
}

// ---------- categorias ----------

async function carregarCategorias() {
  try {
    const categorias = await getCategorias();
    for (const cat of categorias) {
      const botao = document.createElement("button");
      botao.textContent = cat.name;
      botao.dataset.slug = cat.slug;
      botao.addEventListener("click", function () {
        carregarProdutos(cat.slug);
      });
      areaCategorias.appendChild(botao);
    }
    marcarCategoriaAtiva("groceries");
  } catch (erro) {
    mostrarErro(erro);
  }
}

// ---------- eventos ----------

formBusca.addEventListener("submit", function (evento) {
  evento.preventDefault();
  const texto = campoBusca.value.trim();
  if (texto === "") {
    carregarProdutos("groceries");
    return;
  }
  buscar(texto);
});

// ---------- início ----------

carregarProdutos("groceries");
carregarCategorias();
atualizarPedido();
