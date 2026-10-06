class Grafo {
  constructor() {
    this.adjacencias = new Map();
  }

  adicionarVertice(vertice) {
    if (!this.adjacencias.has(vertice)) {
      this.adjacencias.set(vertice, []);
    }
  }

  adicionarAresta(origem, destino) {
    this.adicionarVertice(origem);
    this.adicionarVertice(destino);

    if (!this.adjacencias.get(origem).includes(destino)) {
      this.adjacencias.get(origem).push(destino);
    }

    if (!this.adjacencias.get(destino).includes(origem)) {
      this.adjacencias.get(destino).push(origem);
    }
  }

  mostrar() {
    for (const [vertice, vizinhos] of this.adjacencias) {
      console.log(`${vertice} -> ${vizinhos.join(", ")}`);
    }
  }
}

module.exports = Grafo;
