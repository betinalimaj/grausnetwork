const filmes = require("./public/data/latest_movies.json");

const grafo = new Map();

function conectar(a1, a2) {
  if (!grafo.has(a1)) grafo.set(a1, new Set());
  if (!grafo.has(a2)) grafo.set(a2, new Set());
  grafo.get(a1).add(a2);
  grafo.get(a2).add(a1);
}

for (const filme of filmes) {
  if (Array.isArray(filme.cast)) {
    const elenco = filme.cast;
    for (let i = 0; i < elenco.length; i++) {
      for (let j = i + 1; j < elenco.length; j++) {
        conectar(elenco[i], elenco[j]);
      }
    }
  }
}

const todosAtores = Array.from(grafo.keys());
console.log(`🔍 Mapeando os 30 maiores caminhos entre os ${todosAtores.length} atores...\n`);

const todosParesLongos = [];

// 2. BFS para encontrar todas as distâncias > 8 graus
for (let i = 0; i < todosAtores.length; i++) {
  const origem = todosAtores[i];
  const distancias = new Map([[origem, 0]]);
  const fila = [origem];
  let ponteiro = 0;

  while (ponteiro < fila.length) {
    const atual = fila[ponteiro++];
    const distAtual = distancias.get(atual);

    const vizinhos = grafo.get(atual) || new Set();
    for (const vizinho of vizinhos) {
      if (!distancias.has(vizinho)) {
        const novaDist = distAtual + 1;
        distancias.set(vizinho, novaDist);
        fila.push(vizinho);

        // Guarda pares com mais de 8 graus (origem < vizinho evita duplicados A-B e B-A)
        if (novaDist > 8 && origem < vizinho) {
          todosParesLongos.push({
            ator1: origem,
            ator2: vizinho,
            graus: novaDist
          });
        }
      }
    }
  }
}

// 3. Ordenar estritamente do MAIOR grau para o menor
todosParesLongos.sort((a, b) => b.graus - a.graus);

// 4. Pegar as 30 maiores combinações
const top30 = todosParesLongos.slice(0, 30);

console.log("🏆 AS 30 COMBINAÇÕES COM OS MAIORES CAMINHOS DA BASE (> 8 GRAUS):\n");

if (top30.length === 0) {
  console.log("Nenhum par conectado com mais de 8 graus foi encontrado na base");
} else {
  top30.forEach((par, idx) => {
    console.log(`${idx + 1}. [${par.graus} GRAUS]`);
    console.log(`   Ator 1: "${par.ator1}"`);
    console.log(`   Ator 2: "${par.ator2}"\n`);
  });
}