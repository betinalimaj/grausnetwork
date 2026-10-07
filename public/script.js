// ESTRUTURA DO GRAFO E BFS
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
}

function buscarCaminhosMinimos(grafo, origem, destino, limite = Infinity) {
  if (!grafo.adjacencias.has(origem) || !grafo.adjacencias.has(destino)) {
    return [];
  }

  const fila = [{ vertice: origem, caminho: [origem], distancia: 0 }];
  let inicioFila = 0;
  const menorDistancia = new Map();
  menorDistancia.set(origem, 0);
  const caminhos = [];

  while (inicioFila < fila.length) {
    const atual = fila[inicioFila++];

    if (atual.distancia > limite) continue;

    if (atual.vertice === destino) {
      caminhos.push(atual.caminho);
      continue;
    }

    const vizinhos = grafo.adjacencias.get(atual.vertice) || [];

    for (const vizinho of vizinhos) {
      const novaDistancia = atual.distancia + 1;
      if (novaDistancia > limite) continue;
      if (atual.caminho.includes(vizinho)) continue;

      const distanciaAnterior = menorDistancia.get(vizinho);

      if (distanciaAnterior === undefined || novaDistancia <= distanciaAnterior) {
        menorDistancia.set(vizinho, novaDistancia);
        fila.push({
          vertice: vizinho,
          caminho: [...atual.caminho, vizinho],
          distancia: novaDistancia
        });
      }
    }
  }

  if (caminhos.length === 0) return [];

  const menorComprimento = caminhos.reduce(
    (menor, caminho) => Math.min(menor, caminho.length - 1),
    Infinity
  );

  const caminhosMinimos = caminhos.filter(
    caminho => caminho.length - 1 === menorComprimento
  );

  return caminhosMinimos.map(caminho => ({
    caminho: caminho,
    comprimento: menorComprimento
  }));
}

function bfs(grafo, origem, destino) {
  return buscarCaminhosMinimos(grafo, origem, destino, Infinity);
}

function bfsAte8(grafo, origem, destino) {
  return buscarCaminhosMinimos(grafo, origem, destino, 8);
}

// LÓGICA DA INTERFACE E REQUISIÇÃO
const grafoGlobal = new Grafo();

document.addEventListener('DOMContentLoaded', () => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('.reveal').forEach((el, i) => {
    setTimeout(() => el.classList.add('in'), reduce ? 0 : 120 + i * 140);
  });

  const swap = document.querySelector('.swap');
  const origemSelect = document.getElementById('origem');
  const destinoSelect = document.getElementById('destino');

  swap?.addEventListener('click', () => {
    swap.classList.toggle('spin');
    const tempIndex = origemSelect.selectedIndex;
    origemSelect.selectedIndex = destinoSelect.selectedIndex;
    destinoSelect.selectedIndex = tempIndex;
  });

  const btnPrimary = document.querySelector('.btn-primary');
  const btnOutline = document.querySelector('.btn-outline');

  btnPrimary?.addEventListener('click', e => {
    executarEfeitoBotao(btnPrimary, e, reduce);
    executarBusca(false);
  });

  btnOutline?.addEventListener('click', e => {
    executarEfeitoBotao(btnOutline, e, reduce);
    executarBusca(true);
  });

  carregarDados();
});

async function carregarDados() {
  try {
    const response = await fetch('./data/latest_movies.json');
    if (!response.ok) throw new Error(`Status HTTP: ${response.status}`);

    const filmes = await response.json();
    const atoresSet = new Set();

    filmes.forEach(filme => {
      grafoGlobal.adicionarVertice(filme.title);
      if (Array.isArray(filme.cast)) {
        filme.cast.forEach(ator => {
          atoresSet.add(ator);
          grafoGlobal.adicionarAresta(filme.title, ator);
        });
      }
    });

    const atoresOrdenados = Array.from(atoresSet).sort();

    const origemSelect = document.getElementById('origem');
    const destinoSelect = document.getElementById('destino');

    origemSelect.innerHTML = '<option value="">Selecione...</option>';
    destinoSelect.innerHTML = '<option value="">Selecione...</option>';

    atoresOrdenados.forEach(ator => {
      origemSelect.add(new Option(ator, ator));
      destinoSelect.add(new Option(ator, ator));
    });

    atualizarContador(atoresOrdenados.length, filmes.length);

  } catch (error) {
    console.error('Erro ao carregar a base de dados:', error);
  }
}

function atualizarContador(totalAtores, totalFilmes) {
  const elAtores = document.querySelector('[data-count="25"]');
  const elFilmes = document.querySelector('[data-count="17"]');

  if (elAtores) elAtores.dataset.count = totalAtores;
  if (elFilmes) elFilmes.dataset.count = totalFilmes;

  document.querySelectorAll('[data-count]').forEach(el => {
    const end = +el.dataset.count;
    el.textContent = '0';
    const t0 = performance.now() + 200, dur = 900;
    const tick = now => {
      const p = Math.min(Math.max((now - t0) / dur, 0), 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

function executarEfeitoBotao(btn, e, reduce) {
  if (!reduce) {
    const r = btn.getBoundingClientRect();
    const s = document.createElement('span');
    s.className = 'ripple';
    s.style.cssText = `width:40px;height:40px;left:${e.clientX - r.left - 20}px;top:${e.clientY - r.top - 20}px`;
    btn.appendChild(s);
    s.addEventListener('animationend', () => s.remove());
  }
  btn.classList.add('loading');
  setTimeout(() => btn.classList.remove('loading'), 1200);
}

function executarBusca(limitar8Arestas = false) {
  const atorOrigem = document.getElementById('origem').value;
  const atorDestino = document.getElementById('destino').value;

  if (!atorOrigem || !atorDestino || atorOrigem === 'Selecione...' || atorDestino === 'Selecione...') {
    alert('Por favor, selecione os dois atores.');
    return;
  }

  const resultados = limitar8Arestas
    ? bfsAte8(grafoGlobal, atorOrigem, atorDestino)
    : bfs(grafoGlobal, atorOrigem, atorDestino);

  exibirResultados(resultados, atorOrigem, atorDestino);
}

function exibirResultados(resultados, origem, destino) {
  const container = document.querySelector('.result');
  const emptyBox = container.querySelector('.empty');

  if (!resultados || resultados.length === 0) {
    emptyBox.style.display = 'block';
    emptyBox.innerHTML = `
      <h3>Nenhum caminho encontrado</h3>
      <p>Não há conexão entre <strong>${origem}</strong> e <strong>${destino}</strong> dentro do limite estabelecido</p>
    `;
    return;
  }

  let htmlResultados = '<div class="caminhos-container" style="padding: 1.5rem 0;">';

  resultados.forEach((res, index) => {
    htmlResultados += `
      <div class="caminho-item" style="margin-bottom: 1rem; background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 8px;">
        <p style="margin-bottom: 0.5rem; font-weight: bold;">Caminho ${index + 1} (${res.comprimento} conexões):</p>
        <p class="mono" style="font-size: 0.95rem; line-height: 1.6;">${res.caminho.join(' ➔ ')}</p>
      </div>
    `;
  });

  htmlResultados += '</div>';

  emptyBox.style.display = 'block';
  emptyBox.innerHTML = htmlResultados;
}