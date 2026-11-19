import express from 'express';
import { readFileSync } from 'node:fs';

const app = express();
const productos = JSON.parse(
  readFileSync(new URL('./data.json', import.meta.url), 'utf-8')
);

const normalizar = (t) =>
  t.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');

app.get('/api/productos', (req, res) => {
  const q = normalizar((req.query.q ?? '').toString().trim());
  const resultado = q
    ? productos.filter(
        (p) =>
          normalizar(p.nombre).includes(q) ||
          normalizar(p.categoria).includes(q)
      )
    : productos;
  res.json(resultado);
});

const PORT = 3001;
app.listen(PORT, () => console.log(`API lista en http://localhost:${PORT}`));
