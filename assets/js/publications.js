// ===== Data (replace with real publications) =====
let PUBLICATIONS = [];

function parseRow(r){
  const authors = (r.authors || '').split(';').map(s => s.trim()).filter(Boolean);
  const projectTags = (r.projectTags || '').split(';').map(s => s.trim()).filter(Boolean);
  const links = {
    pdf: r.pdf && r.pdf !== '#' ? r.pdf : '',
    doi: r.doi && r.doi !== '#' ? r.doi : ''
  };
  return {
    id: r.id,
    title: r.title,
    authors,
    year: Number(r.year) || '',
    venue: r.venue || '',
    abstractShort: r.abstractShort || '',
    abstractFull: r.abstractFull || '',
    image: r.image || '',
    links,
    projectTags
  };
}

function loadPublicationsFromCSV(url){
  return new Promise((resolve, reject) => {
    if (!url) return reject(new Error('CSV URL missing'));
    Papa.parse(url, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (res) => {
        try {
          const rows = res.data.map(parseRow).filter(p => p.id && p.title);
          resolve(rows);
        } catch(e){ reject(e); }
      },
      error: (err) => reject(err)
    });
  });
}

// Bootstrapping: load then render
(async function init(){
  try {
    PUBLICATIONS = await loadPublicationsFromCSV(window.PUBS_CSV_URL);
  } catch (e){
    console.error('Failed to load publications from CSV:', e);
    PUBLICATIONS = []; // fallback: keep empty or define a tiny hardcoded sample
  }
  render(); // call your existing render() after data is ready
})();


// ===== Utils =====
const uniqSorted = (arr) => Array.from(new Set(arr)).sort((a,b) => String(a).localeCompare(String(b)));
const byNewest = (a,b) => b.year - a.year;
const byOldest = (a,b) => a.year - b.year;
const byTitle = (a,b) => a.title.localeCompare(b.title);

function summarizeAbstract(p, maxChars = 220) {
  if (p.abstractShort) return p.abstractShort;
  const src = p.abstractFull || p.abstract || '';
  if (src.length <= maxChars) return src;
  // trim to whole word
  const cut = src.slice(0, maxChars);
  return cut.slice(0, cut.lastIndexOf(' ')) + '…';
}
function buildShareUrl(id) {
  if (typeof window === 'undefined') return `#/pub/${id}`;
  return `${window.location.origin}${window.location.pathname}#/pub/${id}`;
}
// tiny runtime checks
(function(){
  try {
    if (typeof window !== 'undefined') {
      const id = 'test-xyz';
      console.assert(buildShareUrl(id) === `${window.location.origin}${window.location.pathname}#/pub/${id}`, 'buildShareUrl');
    }
    const a={title:'A',year:2020}, b={title:'B',year:2021};
    console.assert(byNewest(a,b)>0 && byOldest(a,b)<0 && byTitle(a,b)<0, 'comparators');
  } catch(e){ console.warn('Runtime tests failed:', e); }
})();

// ===== Tiny DOM helper =====
const $app = document.getElementById('app');
const $filters = document.getElementById('filters');
function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k,v] of Object.entries(attrs)) {
    if (k === 'class') node.className = v;
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2).toLowerCase(), v);
    else node.setAttribute(k, v);
  }
  for (const c of [].concat(children)) {
    if (c == null) continue;
    node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
  }
  return node;
}

// ===== Components =====
function FiltersBar(state, setState, allProjectTags) {
  const wrap = el('div');
  const row = el('div', { class: 'pf-row' });

  const searchRow = el('div', { class: 'pf-search' });
  const input = el('input', { type: 'text', value: state.search, placeholder: 'Search title, authors, venue, abstract…' });
  input.addEventListener('input', (e) => setState({ search: e.target.value }));
  const b1 = el('button', { class: 'pf-btn', onclick: () => setState({ sort: 'newest' }) }, 'Newest');
  const b2 = el('button', { class: 'pf-btn', onclick: () => setState({ sort: 'oldest' }) }, 'Oldest');
  const b3 = el('button', { class: 'pf-btn', onclick: () => setState({ sort: 'title' }) }, 'Title A→Z');
  searchRow.append(input, b1, b2, b3);

  const tagsRow = el('div', { class: 'pf-tags' });
  allProjectTags.forEach(t => {
    const chip = el('span', { class: 'pf-chip' + (state.projectTags.includes(t) ? ' active' : ''), onclick: () => toggleTag(t) }, t);
    tagsRow.appendChild(chip);
  });
  if (state.projectTags.length > 0) {
    tagsRow.appendChild(el('span', { class: 'pf-clr_btn', onclick: () => setState({ projectTags: [] }) }, 'Clear'));
  }

  row.appendChild(searchRow);
  row.appendChild(tagsRow);
  wrap.appendChild(row);
  return wrap;

  function toggleTag(t){
    const on = state.projectTags.includes(t);
    const next = on ? state.projectTags.filter(x => x !== t) : state.projectTags.concat(t);
    setState({ projectTags: next });
  }
}

function PublicationCard(p, onOpen, onTagClick) {
  const card = el('div', { class: 'card' });
 const imgbox = el('div', { class: 'imgbox' }, [
    el('a', { href: `#/pub/${p.id}`, onclick: (e) => { e.preventDefault(); onOpen(p); } }, [
      el('img', { src: p.image, alt: p.title })
    ])
  ]);
  const body = el('div', { class: 'card-body' }, [
    el('h3', { class: 'card-title' }, [
      el('a', { href: `#/pub/${p.id}`, onclick: (e) => { e.preventDefault(); onOpen(p); }, style: 'color: inherit; text-decoration: none;' }, p.title)
    ]),
    el('div', { class: 'card-meta' }, [
        document.createTextNode(`${p.authors.join(', ')}`),
        el('br'),
        el('em', {}, p.venue),
        document.createTextNode(` · ${p.year}`)
    ]),
    el('p', { class: 'card-abstract' }, summarizeAbstract(p)),
    (function(){
      const tags = el('div', { class: 'card-tags' });
      (p.projectTags || []).forEach(t =>
        tags.appendChild(el('span', { class: 'pf-chip', title: 'Filter by project tag', onclick: () => onTagClick(t) }, t))
      );
      return tags;
    })(),
    (function(){
      const row = el('div', { class: 'row-split' });
      row.appendChild(el('span', { class: 'link-sm', onclick: () => onOpen(p) }, 'View details'));
      const links = el('div', { class: 'links' });
      if (p.links?.pdf) links.appendChild(el('a', { class: 'link-sm', href: p.links.pdf, target: '_blank', rel: 'noreferrer' }, 'PDF'));
      if (p.links?.doi) links.appendChild(el('a', { class: 'link-sm', href: p.links.doi, target: '_blank', rel: 'noreferrer' }, 'DOI'));
      row.appendChild(links);
      return row;
    })()
  ]);

  card.appendChild(imgbox);
  card.appendChild(body);
  return card;
}

function PublicationDetail(pub, onBack){
  const root = el('div', { class: 'detail' });
  root.appendChild(el('button', { class: 'link-sm back-link', onclick: onBack }, '← Back to all publications'));

  const grid = el('div', { class: 'detail-grid' }, [
  el('div', { class: 'detail-left' }, [
    (function(){
      const bx = el('div', { class: 'imgbox' });
      bx.appendChild(el('img', { src: pub.image, alt: pub.title }));
      return bx;
    })()
  ]),
  el('div', {}, [
    el('h1', { class: 'detail-title' }, pub.title),
    el('div', { class: 'detail-sub' }, pub.authors.join(', ')),
    el('div', { class: 'detail-sub' }, [
      el('br'),
      el('em', {}, pub.venue),
      document.createTextNode(` · ${pub.year}`)
    ]),
    (function(){ const wrap = el('div', { class: 'detail-tags' }); (pub.projectTags||[]).forEach(t => wrap.appendChild(el('span', { class: 'pf-chip' }, t))); return wrap; })(),
    el('p', { class: 'detail-abstract' }, pub.abstractFull || pub.abstract || pub.abstractShort || ''),
    (function(){
      const row = el('div', { class: 'links' });
      if (pub.links?.pdf) row.appendChild(el('a', { class: 'link-sm', href: pub.links.pdf, target: '_blank', rel: 'noreferrer' }, 'PDF'));
      if (pub.links?.doi) row.appendChild(el('a', { class: 'link-sm', href: pub.links.doi, target: '_blank', rel: 'noreferrer' }, 'DOI'));
      return row;
    })()
  ])
]);
root.appendChild(grid);
  return root;
}

// ===== App state + simple hash-router =====
const state = { search: '', sort: 'newest', projectTags: [] };
function setState(patch){ Object.assign(state, patch); render(); }

function listView(){
  const frag = document.createDocumentFragment();

  // filters
  const allProjectTags = uniqSorted(PUBLICATIONS.flatMap(p => p.projectTags || []));
  $filters.innerHTML = '';
  $filters.appendChild(FiltersBar(state, setState, allProjectTags));

  // filter + sort
  const q = state.search.trim().toLowerCase();
  let list = PUBLICATIONS.filter(p => {
    const inText = (p.title + ' ' + p.authors.join(' ') + ' ' + p.venue + ' ' + p.abstract).toLowerCase().includes(q);
    const hasTags = state.projectTags.length ? state.projectTags.every(t => (p.projectTags||[]).includes(t)) : true; // AND logic
    return inText && hasTags;
  });
  if (state.sort === 'newest') list = list.slice().sort(byNewest);
  if (state.sort === 'oldest') list = list.slice().sort(byOldest);
  if (state.sort === 'title')  list = list.slice().sort(byTitle);

  if (list.length === 0) {
    frag.appendChild(el('div', { class: 'empty' }, 'No results match your filters.'));
  } else {
    const grid = el('div', { class: 'grid' });
    list.forEach(p => grid.appendChild(PublicationCard(p, (pub) => navTo(`/pub/${pub.id}`), (t) => setState({ projectTags: [t] }))));
    frag.appendChild(grid);
  }
  return frag;
}

function detailView(id){
  const pub = PUBLICATIONS.find(p => p.id === id);
  if (!pub) return el('div', { class: 'empty' }, 'Not found.');
  return PublicationDetail(pub, () => navTo('/'));
}

function navTo(route){ window.location.hash = route; }
function render(){
  $app.innerHTML = '';
  const hash = window.location.hash.slice(1) || '/';
  const m = hash.match(/^\/pub\/(.+)$/);
  $app.appendChild(m ? detailView(m[1]) : listView());
}

window.addEventListener('hashchange', render);
render();