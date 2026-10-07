const Grafo = require("./grafo");
const { seed } = require("./seed");
const filmes = require("../public/data/latest_movies.json");
const { bfs, bfsAte8, bfsComLimite } = require("./bfs");

const grafo = new Grafo();

seed(grafo, filmes);

console.log("GRAFO");
grafo.mostrar();

console.log("\nTESTE 1: BFS normal");

const resultado = bfs(grafo, "Ken Kirzinger", "Monica Keena");

if (resultado.length > 0) {
  for (const resultadoAtual of resultado) {
    console.log("Caminho:", resultadoAtual.caminho.join(" -> "));

    console.log("Número de arestas:", resultadoAtual.comprimento);
  }
} else {
  console.log("Nenhum relacionamento encontrado");
}

console.log("\nTESTE 2: BFS com limites de 1 aresta");

const testeLimite = bfsComLimite(grafo, "Ken Kirzinger", "Monica Keena", 1);

if (testeLimite.length > 0) {
  for (const resultadoAtual of testeLimite) {
    console.log("Caminho:", resultadoAtual.caminho.join(" -> "));

    console.log("Número de arestas:", resultadoAtual.comprimento);
  }
} else {
  console.log("Nenhum caminho encontrado dentro do limite");
}

console.log("\nTESTE 3: BFS com limites de 8 arestas");

const resultadoBFS8 = bfsAte8(grafo, "Ken Kirzinger", "Monica Keena");

if (resultadoBFS8.length > 0) {
  for (const resultadoAtual of resultadoBFS8) {
    console.log("Caminho:", resultadoAtual.caminho.join(" -> "));

    console.log("Número de arestas:", resultadoAtual.comprimento);
  }
} else {
  console.log("Nenhum relacionamento encontrado em até 8 arestas");
}

console.log("\nTESTE 4: Ator inexistente");

const testeInexistente = bfsAte8(
  grafo,
  "Ken Kirzinger",
  "Ator (que nao existe)",
);

if (testeInexistente.length > 0) {
  for (const resultadoAtual of testeInexistente) {
    console.log("Caminho:", resultadoAtual.caminho.join(" -> "));

    console.log("Número de arestas:", resultadoAtual.comprimento);
  }
} else {
  console.log("Nenhum relacionamento encontrado");
}

console.log("\nTESTE 5: Múltiplos caminhos mínimos");

const grafoTeste = new Grafo();

grafoTeste.adicionarAresta("Ator A", "Filme 1");
grafoTeste.adicionarAresta("Filme 1", "Ator B");

grafoTeste.adicionarAresta("Ator A", "Filme 2");
grafoTeste.adicionarAresta("Filme 2", "Ator B");

const multiplosCaminhos = bfs(grafoTeste, "Ator A", "Ator B");

if (multiplosCaminhos.length > 0) {
  console.log("Quantidade de caminhos:", multiplosCaminhos.length);

  for (const resultadoAtual of multiplosCaminhos) {
    console.log("Caminho:", resultadoAtual.caminho.join(" -> "));

    console.log("Número de arestas:", resultadoAtual.comprimento);
  }
} else {
  console.log("Nenhum caminho encontrado.");
}
