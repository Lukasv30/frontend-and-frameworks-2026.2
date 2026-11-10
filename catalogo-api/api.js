// api.js - camada de serviço
// Este arquivo SÓ conversa com a API (fetch). Nada de DOM aqui.

const BASE = "https://dummyjson.com"; // "https://dummyjson.com/xx"


// O "garçom": todas as outras funções pedem a ela.
async function get(caminho) {
  const resposta = await fetch(BASE + caminho);
  // fetch NÃO lança erro em 404/500: precisamos checar resposta.ok
  if (!resposta.ok) {
    throw new Error("Erro HTTP " + resposta.status);
  }
  return resposta.json();
}

async function getCategorias() {
  // a API já devolve a lista pronta (objetos com slug e name)
  return get("/products/categories");
}

async function getProdutos(categoria) {
  const dados = await get("/products/category/" + categoria);
  // ?? [] garante uma lista vazia quando a API não manda "products"
  return dados.products ?? [];
}

async function getProduto(id) {
  // a API devolve direto o objeto do produto (sem lista)
  return get("/products/" + id);
}

// Desafio extra 2: busca pelo nome do produto
async function buscarProdutos(texto) {
  const dados = await get("/products/search?q=" + encodeURIComponent(texto));
  return dados.products ?? [];
}
