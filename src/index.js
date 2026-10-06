const Grafo = require("./grafo");
const filmes = require("../data/latest_movies.json");
const { bfs, bfsAte8, bfsComLimite } = require("./bfs");

const grafo = new Grafo();

// ==========================================
// SEED DOS DADOS
// ==========================================

function seed(grafo, filmes) {
    for (const filme of filmes) {
        grafo.adicionarVertice(filme.title);

        for (const ator of filme.cast) {
            grafo.adicionarAresta(filme.title, ator);
        }
    }
}

seed(grafo, filmes);

// ==========================================
// MOSTRAR O GRAFO
// ==========================================

console.log("=== GRAFO ===");
grafo.mostrar();

// ==========================================
// TESTE 1 - BFS NORMAL
// ==========================================

console.log("\n=== TESTE 1: BFS NORMAL ===");

const resultado = bfs(
    grafo,
    "Ken Kirzinger",
    "Monica Keena"
);

if (resultado.length > 0) {
    for (const resultadoAtual of resultado) {
        console.log(
            "Caminho:",
            resultadoAtual.caminho.join(" -> ")
        );

        console.log(
            "Número de arestas:",
            resultadoAtual.comprimento
        );
    }
} else {
    console.log("Nenhum relacionamento encontrado.");
}

// ==========================================
// TESTE 2 - BFS COM LIMITE DE 1 ARESTA
// ==========================================

console.log("\n=== TESTE 2: BFS COM LIMITE DE 1 ARESTA ===");

const testeLimite = bfsComLimite(
    grafo,
    "Ken Kirzinger",
    "Monica Keena",
    1
);

if (testeLimite.length > 0) {
    for (const resultadoAtual of testeLimite) {
        console.log(
            "Caminho:",
            resultadoAtual.caminho.join(" -> ")
        );

        console.log(
            "Número de arestas:",
            resultadoAtual.comprimento
        );
    }
} else {
    console.log("Nenhum caminho encontrado dentro do limite.");
}

// ==========================================
// TESTE 3 - BFS COM LIMITE DE 8
// ==========================================

console.log("\n=== TESTE 3: BFS COM LIMITE DE 8 ARESTAS ===");

const resultadoBFS8 = bfsAte8(
    grafo,
    "Ken Kirzinger",
    "Monica Keena"
);

if (resultadoBFS8.length > 0) {
    for (const resultadoAtual of resultadoBFS8) {
        console.log(
            "Caminho:",
            resultadoAtual.caminho.join(" -> ")
        );

        console.log(
            "Número de arestas:",
            resultadoAtual.comprimento
        );
    }
} else {
    console.log("Nenhum relacionamento encontrado em até 8 arestas.");
}

// ==========================================
// TESTE 4 - ATOR INEXISTENTE
// ==========================================

console.log("\n=== TESTE 4: ATOR INEXISTENTE ===");

const testeInexistente = bfsAte8(
    grafo,
    "Ken Kirzinger",
    "Ator Que Nao Existe"
);

if (testeInexistente.length > 0) {
    for (const resultadoAtual of testeInexistente) {
        console.log(
            "Caminho:",
            resultadoAtual.caminho.join(" -> ")
        );

        console.log(
            "Número de arestas:",
            resultadoAtual.comprimento
        );
    }
} else {
    console.log("Nenhum relacionamento encontrado.");
}

// ==========================================
// TESTE 5 - MÚLTIPLOS CAMINHOS MÍNIMOS
// ==========================================

console.log("\n=== TESTE 5: MÚLTIPLOS CAMINHOS MÍNIMOS ===");

const grafoTeste = new Grafo();

// Primeiro caminho:
// Ator A -> Filme 1 -> Ator B
grafoTeste.adicionarAresta("Ator A", "Filme 1");
grafoTeste.adicionarAresta("Filme 1", "Ator B");

// Segundo caminho:
// Ator A -> Filme 2 -> Ator B
grafoTeste.adicionarAresta("Ator A", "Filme 2");
grafoTeste.adicionarAresta("Filme 2", "Ator B");

const multiplosCaminhos = bfs(
    grafoTeste,
    "Ator A",
    "Ator B"
);

if (multiplosCaminhos.length > 0) {
    console.log(
        "Quantidade de caminhos:",
        multiplosCaminhos.length
    );

    for (const resultadoAtual of multiplosCaminhos) {
        console.log(
            "Caminho:",
            resultadoAtual.caminho.join(" -> ")
        );

        console.log(
            "Número de arestas:",
            resultadoAtual.comprimento
        );
    }
} else {
    console.log("Nenhum caminho encontrado.");
}

