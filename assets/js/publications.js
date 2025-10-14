// ===== Data (replace with real publications) =====
const PUBLICATIONS = [
  {
    id: 'mth-play-2025',
    title: 'Potential of Play for Knowing Differently in More-than-Human Worlds',
    authors: ['Your Name', 'Coauthor One', 'Coauthor Two'],
    year: 2025,
    venue: 'CHI PLAY 2025 (PoP)',
    abstract: 'We explore play as a method for attuning to more-than-human relations, outlining design implications for situated practice and joyful care.',
    image: 'https://images.unsplash.com/photo-1520975940209-28fdb06f2fdb?q=80&w=1600&auto=format&fit=crop',
    links: { pdf: '#', doi: '#', publisher: '#' },
    projectTags: ['More-than-Human', 'Play'],
  },
  {
    id: 'studio-roles-2025',
    title: 'Exploring Roles & Purposes in More-than-Human Design',
    authors: ['Your Name', 'Coauthor Three'],
    year: 2025,
    venue: 'Design Research Society (DRS)',
    abstract: 'A reflexive design studio experiment mapping roles and purposes in more-than-human design through hands-on probes.',
    image: 'https://images.unsplash.com/photo-1529101091764-c3526daf38fe?q=80&w=1600&auto=format&fit=crop',
    links: { pdf: '#', doi: '#', publisher: '#' },
    projectTags: ['More-than-Human', 'Studio'],
  },
  {
    id: 'mycelium-ethno-2024',
    title: 'Playing-alongside Shroom Growth: Joyful Care with Mycelium',
    authors: ['Your Name', 'Collaborator'],
    year: 2024,
    venue: 'Journal of Sustainable HCI',
    abstract: 'A collaborative ethnography examining playful care practices around growing mycelium and implications for sustainable interaction design.',
    image: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?q=80&w=1600&auto=format&fit=crop',
    links: { pdf: '#', doi: '#', publisher: '#' },
    projectTags: ['Fungi', 'Care'],
  },
  {
    id: 'biomaterials-2023',
    title: 'Hands-on Biomaterials in HCI: A Practice-Led Review',
    authors: ['Your Name'],
    year: 2023,
    venue: 'Interacting with Computers',
    abstract: 'A review foregrounding hands-on prototyping with living materials as a source of design knowledge and methods.',
    image: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?q=80&w=1600&auto=format&fit=crop',
    links: { pdf: '#', doi: '#', publisher: '#' },
    projectTags: ['Biomaterials'],
  },
];

// ===== Utils =====
const uniqSorted = (arr) => Array.from(new Set(arr)).sort((a,b) => String(a).localeCompare(String(b)));
const byNewest = (a,b) => b.year - a.year;
const byOldest = (a,b) => a.year - b.year;
const byTitle = (a,b) => a.title.localeCompare(b.title);
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
  const imgbox = el('div', { class: 'imgbox' }, [ el('img', { src: p.image, alt: p.title }) ]);
  const body = el('div', { class: 'card-body' }, [
    el('h3', { class: 'card-title' }, p.title),
    el('div', { class: 'card-meta' }, `${p.authors.join(', ')} · ${p.venue} · ${p.year}`),
    el('p', { class: 'card-abstract' }, p.abstract),
    (function(){
      const tags = el('div', { class: 'card-tags' });
      (p.projectTags || []).forEach(t => tags.appendChild(el('span', { class: 'pf-chip', title: 'Filter by project tag', onclick: () => onTagClick(t) }, t)));
      return tags;
    })(),
    (function(){
      const row = el('div', { class: 'row-split' });
      row.appendChild(el('span', { class: 'link-sm', onclick: () => onOpen(p) }, 'View details'));
      const links = el('div', { class: 'links' });
      if (p.links?.pdf) links.appendChild(el('a', { class: 'link-sm', href: p.links.pdf, target: '_blank', rel: 'noreferrer' }, 'PDF'));
      if (p.links?.doi) links.appendChild(el('a', { class: 'link-sm', href: p.links.doi, target: '_blank', rel: 'noreferrer' }, 'DOI'));
      if (p.links?.publisher) links.appendChild(el('a', { class: 'link-sm', href: p.links.publisher, target: '_blank', rel: 'noreferrer' }, 'Publisher'));
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

  const grid = el('div', { class: 'detail-grid' });
  const left = el('div', { class: 'detail-left' }, [
    (function(){ const bx = el('div', { class: 'imgbox' }); bx.appendChild(el('img', { src: pub.image, alt: pub.title })); return bx; })()
  ]);

  const right = el('div', {}, [
    el('h1', { class: 'detail-title' }, pub.title),
    el('div', { class: 'detail-sub' }, pub.authors.join(', ')),
    el('div', { class: 'detail-sub' }, `${pub.venue} · ${pub.year}`),
    (function(){ const wrap = el('div', { class: 'detail-tags' }); (pub.projectTags||[]).forEach(t => wrap.appendChild(el('span', { class: 'pf-chip' }, t))); return wrap; })(),
    el('p', { class: 'detail-abstract' }, pub.abstract),
    (function(){
      const row = el('div', { class: 'links' });
      if (pub.links?.pdf) row.appendChild(el('a', { class: 'link-sm', href: pub.links.pdf, target: '_blank', rel: 'noreferrer' }, 'PDF'));
      if (pub.links?.doi) row.appendChild(el('a', { class: 'link-sm', href: pub.links.doi, target: '_blank', rel: 'noreferrer' }, 'DOI'));
      if (pub.links?.publisher) row.appendChild(el('a', { class: 'link-sm', href: pub.links.publisher, target: '_blank', rel: 'noreferrer' }, 'Publisher'));
      row.appendChild(el('span', {
        class: 'link-sm',
        onclick: () => {
          const url = buildShareUrl(pub.id);
          navigator.clipboard?.writeText(url);
          alert(`Link copied to clipboard! ${url}`);
        }
      }, 'Copy link'));
      return row;
    })()
  ]);

  grid.append(left, right);
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