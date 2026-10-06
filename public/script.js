(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Entrada em sequência
  document.querySelectorAll('.reveal').forEach((el, i) => {
    setTimeout(() => el.classList.add('in'), reduce ? 0 : 120 + i * 140);
  });

  // 2. Contagem dos números (atores / filmes)
  document.querySelectorAll('[data-count]').forEach(el => {
    const end = +el.dataset.count;
    if (reduce) return;
    const t0 = performance.now() + 700, dur = 900;
    el.textContent = '0';
    const tick = now => {
      const p = Math.min(Math.max((now - t0) / dur, 0), 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });

  // 3. Botão de inverter atores: gira e troca os valores
  const swap = document.querySelector('.swap');
  const origem = document.getElementById('origem');
  const destino = document.getElementById('destino');
  swap?.addEventListener('click', () => {
    swap.classList.toggle('spin');
    const a = origem.selectedIndex;
    origem.selectedIndex = destino.selectedIndex;
    destino.selectedIndex = a;
  });

  // 4. Ripple nos botões + estado de carregando
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', e => {
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
    });
  });
})();