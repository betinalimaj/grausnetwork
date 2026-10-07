const Grafo = require("./grafo");

function seed(grafo, filmes) {
  if (!(grafo instanceof Grafo)) {
    throw new TypeError("seed espera uma instância da classe Grafo");
  }

  for (const filme of filmes) {
    if (!filme || typeof filme.title !== "string") {
      continue;
    }

    grafo.adicionarVertice(filme.title);

    if (!Array.isArray(filme.cast)) {
      continue;
    }

    for (const ator of filme.cast) {
      grafo.adicionarAresta(filme.title, ator);
    }
  }
}

module.exports = {
  seed,
};
