const Grafo = require("./src/grafo");

const filmes = require("./public/data/latest_movies.json");

const grafo = new Grafo();

// 1. Montar o grafo
for (const filme of filmes) {
  grafo.adicionarVertice(filme.title);
  if (Array.isArray(filme.cast)) {
    for (const ator of filme.cast) {
      grafo.adicionarAresta(filme.title, ator);
    }
  }
}

// 2. Filtrar apenas os vértices que são atores
const conjuntoFilmes = new Set(filmes.map(f => f.title));
const todosAtores = Array.from(grafo.adjacencias.keys()).filter(v => !conjuntoFilmes.has(v));
const conjuntoAtores = new Set(todosAtores);

console.log(`🔍 Analisando ${todosAtores.length} atores e ${filmes.length} filmes...\n`);

let maiorDistancia = 0;
let melhorResultado = null;

// 3. Rodar BFS a partir de cada ator para encontrar o caminho mais longo
for (let i = 0; i < todosAtores.length; i++) {
  const origem = todosAtores[i];
  
  const fila = [{ vertice: origem, caminho: [origem] }];
  const visitados = new Set([origem]);
  let inicioFila = 0;

  while (inicioFila < fila.length) {
    const atual = fila[inicioFila++];
    
    if (conjuntoAtores.has(atual.vertice) && atual.vertice !== origem) {
      const arestas = atual.caminho.length - 1;
      
      if (arestas > maiorDistancia) {
        maiorDistancia = arestas;
        melhorResultado = {
          origem: origem,
          destino: atual.vertice,
          arestas: arestas,
          caminho: atual.caminho
        };
        console.log(`🚀 Novo recorde: ${arestas} conexões entre "${origem}" e "${atual.vertice}"`);
      }
    }

    const vizinhos = grafo.adjacencias.get(atual.vertice) || [];
    for (const vizinho of vizinhos) {
      if (!visitados.has(vizinho)) {
        visitados.add(vizinho);
        fila.push({
          vertice: vizinho,
          caminho: [...atual.caminho, vizinho]
        });
      }
    }
  }
}

// 4. Exibir o resultado final
console.log("\n");
if (melhorResultado) {
  console.log(`🏆 MAIOR CAMINHO ENCONTRADO (${melhorResultado.arestas} CONEXÕES):`);
  console.log(`Ator 1: ${melhorResultado.origem}`);
  console.log(`Ator 2: ${melhorResultado.destino}`);
  console.log("\nCaminho completo:");
  console.log(melhorResultado.caminho.join(" ➔ "));
} else {
  console.log("Nenhum caminho foi encontrado");
}