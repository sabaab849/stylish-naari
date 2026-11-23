// Search index for the header search (assets/js/search.js), built from assets/data/products.json.
// Served at /search-index.json by serve.mjs and written to dist/ by build.mjs. Kept small (a few KB per saree is
// too much: products.json itself is over half a megabyte), so it holds only what a result shows and what a
// shopper might type: name and its meaning, descriptor, colours, fabric, weave, border, motif, craft, edit.
export function searchIndex(data) {
  const catName = Object.fromEntries((data.categories || []).map((c) => [c.slug, c.name]));
  const editName = Object.fromEntries(Object.entries(data.edits || {}).map(([k, e]) => [k, e.title]));
  return data.products.map((p) => {
    const a = p.attributes || {};
    const img = p.images[0];
    const words = [
      p.nameMeaning, a.fabric, a.weave, a.range, a.colourway, a.border, a.motif, a.origin,
      ...(p.colours || []).map((c) => c.name),
      ...(p.variants || []).map((v) => v.name),
      ...(p.categories || []).map((c) => catName[c]),
      ...(p.edits || []).map((e) => editName[e]),
      a.blousePiece ? 'blouse piece' : '',
      a.booti ? `${a.booti} booti buti buta` : '', // booti work (set-booti.cjs): every spelling matches
    ].filter(Boolean).join(' · ');
    return {
      s: p.slug,
      n: p.name,
      d: p.descriptor || '',
      p: p.price ?? null,
      f: p.priceMax && p.priceMax !== p.price ? 1 : 0, // "From" price
      i: img.src,
      o: img.pos || '',
      k: words,
    };
  });
}

// Shortcuts shown before anything is typed: the crafts, from the categories (top level only)
export function searchSuggestions(data) {
  return (data.categories || []).filter((c) => !c.parent && c.group === 'craft').map((c) => ({ t: c.name, h: `/categories/${c.slug}` }));
}
