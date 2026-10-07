const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const RAIZ = __dirname; 

const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp'
};

const servidor = http.createServer((req, res) => {
  let caminho;
  try {
    caminho = decodeURIComponent(req.url.split('?')[0]);
  } catch {
    res.writeHead(400);
    return res.end('Requisição inválida');
  }

  if (caminho === '/') caminho = '/index.html';

  const arquivo = path.normalize(path.join(RAIZ, caminho));
  if (!arquivo.startsWith(RAIZ)) {
    res.writeHead(403);
    return res.end('Acesso negado');
  }

  fs.readFile(arquivo, (erro, conteudo) => {
    if (erro) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('404 - Arquivo não encontrado');
    }

    const tipo = TIPOS[path.extname(arquivo).toLowerCase()] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': tipo });
    res.end(conteudo);
  });
});

servidor.listen(PORT, () => {
  console.log(`Cinebusca rodando em http://localhost:${PORT}`);
});