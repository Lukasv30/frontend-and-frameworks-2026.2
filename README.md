# Front-End Frameworks · 2026.2

Repositório da disciplina **Front-End Frameworks** (Análise e Desenvolvimento de Sistemas, 2º período, UNINASSAU).

| Pasta | Encontro | Conteúdo |
|---|---|---|
| [`catalogo-api/`](catalogo-api/) | 10 · Unidade III (Roteamento e Rede) | Catálogo de produtos consumindo a API pública DummyJSON com JavaScript puro |

---

| Aluno | GitHub |
|------|--------|
| Lucas Victor Silva | [@Lukasv30](https://github.com/Lukasv30) 

---

## Encontro 10 · Catálogo de Produtos com API REST

Catálogo de produtos de uma lanchonete, construído com **HTML + CSS + JavaScript puro** (sem framework e sem bundler), que consome a API pública [DummyJSON](https://dummyjson.com) usando `fetch` e `async/await`.

### Funcionalidades

**Roteiro (passos 1 a 6)**

- Lista os produtos de uma categoria em cards com foto, nome e preço.
- Trata os quatro estados de uma tela que consome API: **carregando**, **erro**, **vazio** e **sucesso**.
- Mostra um botão para cada categoria devolvida pela API e troca os produtos ao clicar.
- Abre o detalhe do produto (foto, nome, categoria, preço e descrição) em um `<dialog>` modal.

**Desafios extras (seção 5 do roteiro)**

1. Botão **Tentar novamente** na mensagem de erro, que repete a última ação (categoria ou busca).
2. **Campo de busca** por nome de produto, usando o endpoint `/products/search`.
3. **Pedido da lanchonete** (carrinho): botão "Adicionar ao pedido" no detalhe e contador de itens e total no cabeçalho.

### Estrutura de pastas

```
catalogo-api/
  index.html   estrutura da página (áreas: busca, categorias, mensagem, catálogo e detalhe)
  style.css    aparência (grade de cards, botões, dialog)
  api.js       camada de serviço: conversa com a API (fetch)
  app.js       camada de tela: monta o DOM usando as funções do api.js
```

**Regra de arquitetura:** `api.js` só conversa com a API e não toca no DOM. `app.js` só mexe na tela e não contém nenhum `fetch`. Quem muda a API mexe em um arquivo; quem muda a tela mexe em outro.

### Fluxo de dados

1. `app.js` chama `getProdutos("groceries")` do `api.js`.
2. `api.js` faz o `fetch` na DummyJSON, verifica `resposta.ok` e devolve a lista de produtos.
3. `app.js` transforma cada produto em um card e coloca na tela.
4. Ao clicar em um card, `app.js` chama `getProduto(id)` e abre o `<dialog>` com os dados.

### Como executar

Não há dependências nem etapa de build.

1. Clone o repositório e abra a pasta `catalogo-api/`.
2. Abra `index.html` no navegador (duplo clique) **ou** use a extensão **Live Server** do VS Code para recarregar a página a cada salvamento.
3. É preciso ter acesso à internet para o endereço `dummyjson.com`.

### API utilizada

Endereço base: `https://dummyjson.com` (pública, sem chave e sem cadastro).

| Endpoint | Função em `api.js` | O que faz | Chave na resposta |
|---|---|---|---|
| `/products/categories` | `getCategorias()` | lista as categorias (`slug` e `name`) | lista direta (sem chave) |
| `/products/category/{slug}` | `getProdutos(categoria)` | produtos de uma categoria | `products` |
| `/products/{id}` | `getProduto(id)` | detalhes de um produto | objeto direto (sem chave) |
| `/products/search?q={texto}` | `buscarProdutos(texto)` | busca pelo nome do produto | `products` |

Campos do produto usados na tela: `id`, `title`, `price`, `category`, `description` e `thumbnail` (foto).

**Plano B:** se a DummyJSON estiver fora do ar, o roteiro indica o [JSONPlaceholder](https://jsonplaceholder.typicode.com/posts) com adaptação dos campos.

### Estados da tela e como testá-los

| Estado | Mensagem | Como provocar |
|---|---|---|
| Carregando | `Carregando...` | DevTools → Network → trocar "No throttling" por "Slow 3G" e apertar F5 |
| Erro | `Erro: Erro HTTP 404` + botão Tentar novamente | Em `api.js`, trocar `BASE` para `https://dummyjson.com/xx` temporariamente |
| Vazio | `Nenhum produto encontrado.` | Buscar um texto sem resultado, ou chamar `carregarProdutos("nada")` |
| Sucesso | (mensagem vazia, cards na tela) | Carregar normalmente |

### Decisões técnicas

- **`if (!resposta.ok)` é obrigatório.** O `fetch` só rejeita a Promise em falha de rede. Uma resposta 404 ou 500 é considerada "sucesso" pelo `fetch`, por isso a função `get()` lança um `Error` manualmente nesses casos.
- **`dados.products ?? []`** garante que `getProdutos` sempre devolva uma lista, mesmo que a API não envie a chave `products`. Isso permite que `app.js` trate o estado vazio com um simples `produtos.length === 0`.
- **`textContent` em vez de `innerHTML`.** O roteiro usa `innerHTML` por simplicidade, mas esta implementação cria os elementos com `createElement` e preenche o texto com `textContent`. Texto vindo de uma API externa nunca deve ser interpretado como HTML, para evitar XSS.
- **`encodeURIComponent`** no texto de busca, para que espaços e caracteres especiais não quebrem a URL.
- **Ordem dos scripts.** `api.js` vem antes de `app.js` no `index.html`, porque `app.js` usa funções globais declaradas no `api.js`.

### Problemas comuns

| O que aparece | O que verificar |
|---|---|
| Tela em branco, nada acontece | Abra o Console (F12) e leia a mensagem vermelha: ela diz o arquivo e a linha do erro |
| `getProdutos is not defined` | Em `index.html`, `api.js` precisa vir antes de `app.js` |
| `Erro: Failed to fetch` | Sem internet ou site bloqueado. Teste o endereço da API em uma aba nova |
| "Nenhum produto encontrado" em todas as categorias | Confira a URL em `getProdutos`: deve ser `/products/category/` + categoria |
| `Cannot read properties of null` | Algum `id` do `index.html` está diferente do usado no `getElementById` |
| Imagens não aparecem | Confira se o campo é `thumbnail`, escrito exatamente assim |
| Mudei o código e nada mudou | Salve o arquivo (Ctrl+S) e atualize com Ctrl+F5 |

### Checklist de conclusão

- [x] O catálogo carrega produtos reais da API.
- [x] A mensagem Carregando... aparece enquanto espera.
- [x] O erro é tratado e a mensagem é clara.
- [x] Os botões de categoria trocam os produtos da tela.
- [x] O clique no card abre o detalhe do produto.
- [x] Nenhum `fetch` dentro do `app.js`: todos ficam no `api.js`.
- [x] Desafio 1: botão Tentar novamente.
- [x] Desafio 2: campo de busca.
- [x] Desafio 3: pedido da lanchonete.

### Perguntas de reflexão

1. **Por que o `fetch` não lança erro quando a API responde 404, e o que fizemos para tratar isso?**
   O `fetch` só rejeita quando a requisição não chega ao servidor (sem rede, DNS, CORS). Um 404 é uma resposta HTTP válida. Por isso checamos `resposta.ok` e lançamos `new Error("Erro HTTP " + status)`.
2. **Quais são os estados de uma tela que consome API? Qual linha trata cada um?**
   Carregando (`mostrarMensagem("Carregando...")` antes do `await`), erro (bloco `catch` → `mostrarErro`), vazio (`produtos.length === 0` em `renderizarProdutos`) e sucesso (o laço que chama `criarCard`).
3. **Por que separamos `api.js` de `app.js`?**
   Separação de responsabilidades: a camada de serviço pode ser trocada ou testada sem mexer na tela, e vice-versa.
4. **Por que usamos `?? []` em `getProdutos`?**
   Para garantir que a função sempre devolva um array, mesmo se a resposta vier sem a chave `products`. Assim `app.js` nunca precisa checar `undefined`.
5. **O que acontece com a tela se a internet cair no meio da aula?**
   O `fetch` rejeita com `TypeError: Failed to fetch`, o `catch` captura e a tela mostra `Erro: Failed to fetch` com o botão Tentar novamente. A página não quebra.

### Referências

- [DummyJSON · documentação de produtos](https://dummyjson.com/docs/products)
- [MDN · Fetch API](https://developer.mozilla.org/pt-BR/docs/Web/API/Fetch_API)
- [MDN · async/await](https://developer.mozilla.org/pt-BR/docs/Learn/JavaScript/Asynchronous/Promises#async_e_await)
- [MDN · elemento `<dialog>`](https://developer.mozilla.org/pt-BR/docs/Web/HTML/Element/dialog)
