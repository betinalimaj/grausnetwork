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

  if (caminhos.length === 0) return [];

  const menorComprimento = caminhos.reduce(
    (menor, caminho) => Math.min(menor, caminho.length - 1),
    Infinity,
  );

  const caminhosMinimos = caminhos.filter(
    (caminho) => caminho.length - 1 === menorComprimento,
  );

  return caminhosMinimos.map((caminho) => ({
    caminho: caminho,
    comprimento: menorComprimento,
  }));
}

function bfs(grafo, origem, destino) {
  return buscarCaminhosMinimos(grafo, origem, destino, Infinity);
}

function bfsAte8(grafo, origem, destino) {
  return buscarCaminhosMinimos(grafo, origem, destino, 8);
}

const grafoGlobal = new Grafo();

document.addEventListener("DOMContentLoaded", () => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.querySelectorAll(".reveal").forEach((el, i) => {
    setTimeout(() => el.classList.add("in"), reduce ? 0 : 120 + i * 140);
  });

  const swap = document.querySelector(".swap");
  const origemSelect = document.getElementById("origem");
  const destinoSelect = document.getElementById("destino");

  swap?.addEventListener("click", () => {
    swap.classList.toggle("spin");
    const tempIndex = origemSelect.selectedIndex;
    origemSelect.selectedIndex = destinoSelect.selectedIndex;
    destinoSelect.selectedIndex = tempIndex;
    origemSelect.dispatchEvent(new Event("change"));
    destinoSelect.dispatchEvent(new Event("change"));
  });

  const btnPrimary = document.querySelector(".btn-primary");
  const btnOutline = document.querySelector(".btn-outline");

  btnPrimary?.addEventListener("click", (e) => {
    executarEfeitoBotao(btnPrimary, e, reduce);
    executarBusca(false);
  });

  btnOutline?.addEventListener("click", (e) => {
    executarEfeitoBotao(btnOutline, e, reduce);
    executarBusca(true);
  });

  document.getElementById("reset")?.addEventListener("click", reiniciarBusca);

  iniciarCombos();
  carregarDados();
});

async function carregarDados() {
  try {
    const response = await fetch("./data/latest_movies.json");
    if (!response.ok) throw new Error(`Status HTTP: ${response.status}`);

    const filmes = await response.json();
    const atoresSet = new Set();

    filmes.forEach((filme) => {
      grafoGlobal.adicionarVertice(filme.title);
      if (Array.isArray(filme.cast)) {
        filme.cast.forEach((ator) => {
          atoresSet.add(ator);
          grafoGlobal.adicionarAresta(filme.title, ator);
        });
      }
    });

    const atoresOrdenados = Array.from(atoresSet).sort();

    const origemSelect = document.getElementById("origem");
    const destinoSelect = document.getElementById("destino");

    origemSelect.innerHTML = '<option value="">Selecione...</option>';
    destinoSelect.innerHTML = '<option value="">Selecione...</option>';

    atoresOrdenados.forEach((ator) => {
      origemSelect.add(new Option(ator, ator));
      destinoSelect.add(new Option(ator, ator));
    });

    atualizarContador(atoresOrdenados.length, filmes.length);
  } catch (error) {
    console.error("Erro ao carregar a base de dados:", error);
  }
}

function atualizarContador(totalAtores, totalFilmes) {
  const elAtores = document.querySelector('[data-count="25"]');
  const elFilmes = document.querySelector('[data-count="17"]');

  if (elAtores) elAtores.dataset.count = totalAtores;
  if (elFilmes) elFilmes.dataset.count = totalFilmes;

  document.querySelectorAll("[data-count]").forEach((el) => {
    const end = +el.dataset.count;
    el.textContent = "0";
    const t0 = performance.now() + 200,
      dur = 900;
    const tick = (now) => {
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
    const s = document.createElement("span");
    s.className = "ripple";
    s.style.cssText = `width:40px;height:40px;left:${e.clientX - r.left - 20}px;top:${e.clientY - r.top - 20}px`;
    btn.appendChild(s);
    s.addEventListener("animationend", () => s.remove());
  }
  btn.classList.add("loading");
  setTimeout(() => btn.classList.remove("loading"), 1200);
}

function executarBusca(limitar8Arestas = false) {
  const atorOrigem = document.getElementById("origem").value;
  const atorDestino = document.getElementById("destino").value;

  if (
    !atorOrigem ||
    !atorDestino ||
    atorOrigem === "Selecione..." ||
    atorDestino === "Selecione..."
  ) {
    alert("Por favor, selecione os dois atores.");
    return;
  }

  const resultados = limitar8Arestas
    ? bfsAte8(grafoGlobal, atorOrigem, atorDestino)
    : bfs(grafoGlobal, atorOrigem, atorDestino);

  exibirResultados(resultados, atorOrigem, atorDestino);
}

const $ = (id) => document.getElementById(id);

const esc = (txt) =>
  String(txt).replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[c],
  );

function exibirResultados(resultados, origem, destino) {
  const empty = $("empty");
  const content = $("content");

  if (!resultados || resultados.length === 0) {
    $("empty-title").textContent = "Nenhum relacionamento encontrado";
    $("empty-text").innerHTML =
      `Não há relacionamento entre ${esc(origem)} e ${esc(destino)} na base selecionada.<br>Caminhos encontrados: 0`;

    empty.hidden = false;
    content.hidden = true;
    $("paths").innerHTML = "";
    $("badge").hidden = false;
    $("reset").hidden = true;
    $("foot-count").textContent = "A conexão está nos detalhes.";
    return;
  }

  $("res-origem").textContent = origem;
  $("res-destino").textContent = destino;
  $("res-count").textContent = resultados.length;
  $("foot-count").textContent =
    `${resultados.length} ${resultados.length === 1 ? "caminho encontrado" : "caminhos encontrados"}`;

  $("paths").innerHTML = resultados
    .map((res, i) => {
      const linha = res.caminho
        .map((no, j) =>
          j % 2 === 0
            ? `<span class="actor">${esc(no)}</span>`
            : `<span class="movie">${esc(no)}</span>`,
        )
        .join('<span class="arrow">→</span>');

      return `
      <article class="path">
        <header class="path-head">
          <h4>Caminho ${i + 1}</h4>
          <span class="mono path-len">Comprimento: <b>${res.comprimento}</b> arestas</span>
        </header>
        <p class="path-line">${linha}</p>
      </article>`;
    })
    .join("");

  empty.hidden = true;
  content.hidden = false;
  $("badge").hidden = true;
  $("reset").hidden = false;
}

function reiniciarBusca() {
  $("empty-title").textContent = "Seu próximo roteiro começa aqui";
  $("empty-text").textContent =
    "Escolha dois atores e descubra os filmes que cruzam seus caminhos.";
  $("empty").hidden = false;
  $("content").hidden = true;
  $("paths").innerHTML = "";
  $("reset").hidden = true;
  $("badge").hidden = false;
  $("foot-count").textContent = "A conexão está nos detalhes.";
}

function iniciarCombos() {
  const normalizar = (t) =>
    t
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();

  document.querySelectorAll(".select").forEach((wrap) => {
    const select = wrap.querySelector("select");
    if (!select) return;

    select.classList.add("native");
    select.tabIndex = -1;
    select.setAttribute("aria-hidden", "true");

    const trigger = document.createElement("button");
    trigger.type = "button";
    trigger.className = "combo-trigger";
    trigger.setAttribute("aria-haspopup", "listbox");
    trigger.setAttribute("aria-expanded", "false");
    trigger.innerHTML = '<span class="combo-label">Selecione...</span>';
    select.before(trigger);

    const panel = document.createElement("div");
    panel.className = "combo-panel";
    panel.hidden = true;
    panel.innerHTML = `
      <div class="combo-search">
        <svg class="icon icon-sm" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg>
        <input type="text" placeholder="Buscar ator..." autocomplete="off" spellcheck="false" aria-label="Buscar ator">
      </div>
      <ul class="combo-list" role="listbox"></ul>`;
    wrap.appendChild(panel);

    const label = trigger.querySelector(".combo-label");
    const input = panel.querySelector("input");
    const lista = panel.querySelector(".combo-list");
    let itens = [];
    let ativo = -1;

    function renderizar() {
      const termo = normalizar(input.value.trim());
      const comeca = (o) => normalizar(o.text).startsWith(termo);
      const palavra = (o) => normalizar(o.text).includes(" " + termo);

      itens = Array.from(select.options)
        .filter((o) => o.value && (comeca(o) || palavra(o)))
        .sort((a, b) => Number(comeca(b)) - Number(comeca(a)));

      if (!itens.length) {
        ativo = -1;
        lista.innerHTML = '<li class="combo-empty">Nenhum ator encontrado</li>';
        return;
      }

      const idxSelecionado = itens.findIndex((o) => o.value === select.value);
      ativo = termo || idxSelecionado < 0 ? 0 : idxSelecionado;

      lista.innerHTML = itens
        .map(
          (o, i) => `
        <li class="combo-item${o.value === select.value ? " selected" : ""}${i === ativo ? " active" : ""}"
            role="option" data-i="${i}" aria-selected="${o.value === select.value}">
          <span>${esc(o.text)}</span>
          <svg class="icon icon-sm check" viewBox="0 0 24 24"><path d="m5 12 5 5 9-10" /></svg>
        </li>`,
        )
        .join("");

      lista.querySelector(".active")?.scrollIntoView({ block: "nearest" });
    }

    function marcarAtivo(novo) {
      if (!itens.length) return;
      ativo = (novo + itens.length) % itens.length;
      lista
        .querySelectorAll(".combo-item")
        .forEach((li, i) => li.classList.toggle("active", i === ativo));
      lista.children[ativo]?.scrollIntoView({ block: "nearest" });
    }

    function abrir() {
      input.value = "";
      renderizar();
      panel.hidden = false;
      wrap.classList.add("open");
      trigger.setAttribute("aria-expanded", "true");
      input.focus({ preventScroll: true });
    }

    function fechar() {
      if (panel.hidden) return;
      panel.hidden = true;
      wrap.classList.remove("open");
      trigger.setAttribute("aria-expanded", "false");
    }

    function selecionar(i) {
      const opcao = itens[i];
      if (!opcao) return;
      select.value = opcao.value;
      select.dispatchEvent(new Event("change"));
      fechar();
      trigger.focus();
    }

    select.addEventListener("change", () => {
      const opcao = select.selectedOptions[0];
      if (select.value && opcao) {
        label.textContent = opcao.text;
        trigger.classList.add("has-value");
      } else {
        label.textContent = "Selecione...";
        trigger.classList.remove("has-value");
      }
    });

    wrap.addEventListener("click", (e) => {
      if (panel.contains(e.target)) return;
      panel.hidden ? abrir() : fechar();
    });

    trigger.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        if (panel.hidden) abrir();
      }
    });

    input.addEventListener("input", renderizar);
    input.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        marcarAtivo(ativo + 1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        marcarAtivo(ativo - 1);
      } else if (e.key === "Enter") {
        e.preventDefault();
        selecionar(ativo);
      } else if (e.key === "Escape") {
        e.preventDefault();
        fechar();
        trigger.focus();
      } else if (e.key === "Tab") {
        fechar();
      }
    });

    lista.addEventListener("mousemove", (e) => {
      const li = e.target.closest(".combo-item");
      if (li && +li.dataset.i !== ativo) marcarAtivo(+li.dataset.i);
    });
    lista.addEventListener("click", (e) => {
      const li = e.target.closest(".combo-item");
      if (li) selecionar(+li.dataset.i);
    });

    document.addEventListener("click", (e) => {
      if (!wrap.contains(e.target)) fechar();
    });

    if (select.id) {
      document
        .querySelector(`label[for="${select.id}"]`)
        ?.addEventListener("click", (e) => {
          e.preventDefault();
          trigger.focus();
        });
    }
  });
}
