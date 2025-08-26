// Estrutura de dados e mock de "fetch" (pode trocar por sua API depois)

export const NoticiasData = [
  {
    id: "n1",
    titulo: "Astrônomos identificam um novo e estranho objeto na Via Láctea",
    subtitulo:
      "Segundo um estudo publicado nesta quarta-feira (28), uma equipe internacional relatou que o corpo celeste — que pode ser uma estrela, um par de estrelas ou algo totalmente diferente — está emitindo raios X ao mesmo tempo em que dispara ondas de rádio.",
    imagem:
      "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?q=80&w=1200&auto=format&fit=crop",
    views: 32700,
    comments: 94,
    regiao: "Sudeste",
    dataIso: "2025-04-17T15:30:00-03:00",
    thumb:
      "https://i.pinimg.com/736x/17/0b/fd/170bfddc163423fcd4b2444e807edc27.jpg",
  },
  {
    id: "n2",
    titulo: "Desemprego vai ter um aumento de 6,5% no trimestre",
    subtitulo: "",
    imagem:
      "https://i.pinimg.com/736x/17/0b/fd/170bfddc163423fcd4b2444e807edc27.jpg",
    views: 1120,
    comments: 12,
    regiao: "Sudeste",
    dataIso: "2025-04-17T15:30:00-03:00",
    thumb:
      "https://i.pinimg.com/736x/17/0b/fd/170bfddc163423fcd4b2444e807edc27.jpg",
  },
  {
    id: "n3",
    titulo: "Desemprego vai ter um aumento de 6,5% no trimestre",
    subtitulo: "",
    imagem:
      "https://i.pinimg.com/736x/17/0b/fd/170bfddc163423fcd4b2444e807edc27.jpg",
    views: 980,
    comments: 6,
    regiao: "Sudeste",
    dataIso: "2025-04-17T15:30:00-03:00",
    thumb:
      "https://i.pinimg.com/736x/17/0b/fd/170bfddc163423fcd4b2444e807edc27.jpg",
  },
  {
    id: "n4",
    titulo: "Desemprego vai ter um aumento de 6,5% no trimestre",
    subtitulo: "",
    imagem:
      "https://i.pinimg.com/736x/17/0b/fd/170bfddc163423fcd4b2444e807edc27.jpg",
    views: 870,
    comments: 5,
    regiao: "Sudeste",
    dataIso: "2025-04-17T15:30:00-03:00",
    thumb:
      "https://i.pinimg.com/736x/17/0b/fd/170bfddc163423fcd4b2444e807edc27.jpg",
  },
  {
    id: "n5",
    titulo: "Desemprego vai ter um aumento de 6,5% no trimestre",
    subtitulo: "",
    imagem:
      "https://i.pinimg.com/736x/17/0b/fd/170bfddc163423fcd4b2444e807edc27.jpg",
    views: 860,
    comments: 4,
    regiao: "Sudeste",
    dataIso: "2025-04-17T15:30:00-03:00",
    thumb:
      https://i.pinimg.com/736x/17/0b/fd/170bfddc163423fcd4b2444e807edc27.jpg,
  },
];

export async function fetchNoticias({ page = 1, pageSize = 5 } = {}) {
  // mock “assíncrono”
  await new Promise((r) => setTimeout(r, 250));
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const items = NoticiasData.slice(start, end);
  return { items, hasMore: end < NoticiasData.length };
}
