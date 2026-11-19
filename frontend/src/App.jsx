import { useState, useEffect } from 'react';

export default function App() {
  const [query, setQuery] = useState('');
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const timer = setTimeout(async () => {
      try {
        setCargando(true);
        setError(null);
        const res = await fetch(
          `/api/productos?q=${encodeURIComponent(query)}`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error(`Error ${res.status}`);
        setProductos(await res.json());
      } catch (err) {
        if (err.name !== 'AbortError') setError(err.message);
      } finally {
        setCargando(false);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  return (
    <main style={{ maxWidth: 600, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1>Catálogo</h1>

      <input
        type="search"
        placeholder="Buscar producto o categoría..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ width: '100%', padding: '0.6rem', fontSize: '1rem' }}
      />

      {cargando && <p>Buscando...</p>}
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      {!cargando && !error && productos.length === 0 && <p>Sin resultados.</p>}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {productos.map((p) => (
          <li key={p.id} style={{ padding: '0.6rem 0', borderBottom: '1px solid #ddd' }}>
            <strong>{p.nombre}</strong> <small>({p.categoria})</small>
            <div>${p.precio.toFixed(2)}</div>
          </li>
        ))}
      </ul>
    </main>
  );
}
