function bfs(grafo, origem, destino) {
  return buscarCaminhosMinimos(grafo, origem, destino, Infinity);
}

function bfsAte8(grafo, origem, destino) {
  return buscarCaminhosMinimos(grafo, origem, destino, 8);
}

function bfsComLimite(grafo, origem, destino, limite) {
  return buscarCaminhosMinimos(grafo, origem, destino, limite);
}

function buscarCaminhosMinimos(grafo, origem, destino, limite) {
  if (!grafo.adjacencias.has(origem)) {
    return [];
  }

  if (!grafo.adjacencias.has(destino)) {
    return [];
  }

  const fila = [
    {
      vertice: origem,
      caminho: [origem],
      distancia: 0,
    },
  ];

  let inicioFila = 0;

  const menorDistancia = new Map();
  menorDistancia.set(origem, 0);

  const caminhos = [];

  while (inicioFila < fila.length) {
    const atual = fila[inicioFila];
    inicioFila++;

    if (atual.distancia > limite) {
      continue;
    }

    if (atual.vertice === destino) {
      caminhos.push(atual.caminho);
      continue;
    }

    const vizinhos = grafo.adjacencias.get(atual.vertice);

    for (const vizinho of vizinhos) {
      const novaDistancia = atual.distancia + 1;

      if (novaDistancia > limite) {
        continue;
      }

      if (atual.caminho.includes(vizinho)) {
        continue;
      }

      const distanciaAnterior = menorDistancia.get(vizinho);

      if (
        distanciaAnterior === undefined ||
        novaDistancia <= distanciaAnterior
      ) {
        menorDistancia.set(vizinho, novaDistancia);

        fila.push({
          vertice: vizinho,
          caminho: [...atual.caminho, vizinho],
          distancia: novaDistancia,
        });
      }
    }
  }

  if (caminhos.length === 0) {
    return [];
  }

  const menorComprimento = caminhos.reduce((menor, caminho) => {
    return Math.min(menor, caminho.length - 1);
  }, Infinity);

  const caminhosMinimos = caminhos.filter(
    (caminho) => caminho.length - 1 === menorComprimento,
  );

  return caminhosMinimos.map((caminho) => ({
    caminho: caminho,
    comprimento: menorComprimento,
  }));
}

module.exports = {
  bfs,
  bfsAte8,
  bfsComLimite,
};
