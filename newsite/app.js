/* ========= Data ========= */
const PUBLICATIONS = [
  {
    id: 'mth-play-2025',
    title: 'Potential of Play for Knowing Differently in More-than-Human Worlds',
    authors: ['Your Name', 'Coauthor One', 'Coauthor Two'],
    year: 2025,
    venue: 'CHI PLAY 2025 (PoP)',
    abstract: 'We explore play as a method for attuning to more-than-human relations, outlining design implications for situated practice and joyful care.',
    image: 'https://images.unsplash.com/photo-1520975940209-28fdb06f2fdb?q=80&w=1600&auto=format&fit=crop',
    links: { pdf:'#', doi:'#', publisher:'#' },
    projectTags: ['More-than-Human', 'Play']
  },
  {
    id: 'studio-roles-2025',
    title: 'Exploring Roles & Purposes in More-than-Human Design',
    authors: ['Your Name', 'Coauthor Three'],
    year: 2025,
    venue: 'Design Research Society (DRS)',
    abstract: 'A reflexive design studio experiment mapping roles and purposes in more-than-human design through hands-on probes.',
    image: 'https://images.unsplash.com/photo-1529101091764-c3526daf38fe?q=80&w=1600&auto=format&fit=crop',
    links: { pdf:'#', doi:'#', publisher:'#' },
    projectTags: ['More-than-Human', 'Studio']
  },
  {
    id: 'mycelium-ethno-2024',
    title: 'Playing-alongside Shroom Growth: Joyful Care with Mycelium',
    authors: ['Your Name', 'Collaborator'],
    year: 2024,
    venue: 'Journal of Sustainable HCI',
    abstract: 'A collaborative ethnography examining playful care practices around growing mycelium and implications for sustainable interaction design.',
    image: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?q=80&w=1600&auto=format&fit=crop',
    links: { pdf:'#', doi:'#', publisher:'#' },
    projectTags: ['Fungi', 'Care', 'More-than-Human']
  },
  {
    id: 'biomaterials-2023',
    title: 'Hands-on Biomaterials in HCI: A Practice-Led Review',
    authors: ['Your Name'],
    year: 2023,
    venue: 'Interacting with Computers',
    abstract: 'A review foregrounding hands-on prototyping with living materials as a source of design knowledge and methods.',
    image: 'https://images.unsplash.com/photo-1549880338-65ddcdfd017b?q=80&w=1600&auto=format&fit=crop',
    links: { pdf:'#', doi:'#', publisher:'#' },
    projectTags: ['Biomaterials', 'Tangible']
  },
  {
    id: 'forest-wearable-2021',
    title: 'Wearables for Playful Forest-Human Interaction',
    authors: ['Your Name', 'Team'],
    year: 2021,
    venue: 'DIS Workshop',
    abstract: 'Concepts for playful forest-human interaction via soft wearable probes, emphasizing joy, care, and reciprocity.',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1600&auto=format&fit=crop',
    links: { pdf:'#', doi:'#', publisher:'#' },
    projectTags: ['Wearables', 'Fashion', 'Play']
  },
  {
    id: 'transhuman-comm-2022',
    title: 'Transhuman Communication: Mapping Cross-Species Modalities',
    authors: ['Your Name', 'Colleague'],
    year: 2022,
    venue: 'HTI Conference',
    abstract: 'We prototype mappings between human and non-human modalities (plants, fungi, bacteria) to make their signals perceptible.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1600&auto=format&fit=crop',
    links: { pdf:'#', doi:'#', publisher:'#' },
    projectTags: ['Translation', 'Sensors', 'Transhuman']
  },
  /* NEW: example HRI project */
  {
    id: 'hri-cues-2024',
    title: 'Social Cues in Human-Robot-Interaction Wearables',
    authors: ['Your Name', 'Collaborator'],
    year: 2024,
    venue: 'HRI Workshop',
    abstract: 'Wearable cues for proxemics and mutual attention in human-robot interaction; early probes and field notes.',
    image: 'https://images.unsplash.com/photo-1520974722072-5f1d2c0c4d7f?q=80&w=1600&auto=format&fit=crop',
    links: { pdf:'#', doi:'#', publisher:'#' },
    projectTags: ['HRI', 'Wearables', 'Tangible']
  },
];

/* ========= Research Areas ↔ Tag filters ========= */
const RESEARCH_AREAS = {
  'more-than-human-design': {
    title: 'More-Than-Human Design',
    requiredTags: ['More-than-Human']
  },
  'fashionable-wearables': {
    title: 'Fashionable Wearables',
    requiredTags: ['Wearables']  // add 'Fashion' if wanted
  },
  'transhuman-communication': {
    title: 'Transhuman Communication',
    requiredTags: ['Transhuman']
  },
  'tangible-interaction-design': {
    title: 'Tangible Interaction Design',
    requiredTags: ['Tangible']
  },
  /* NEW */
  'human-robot-interaction': {
    title: 'Human-Robot-Interaction',
    requiredTags: ['HRI']
  }
};

/* ========= Utilities ========= */
const uniqSorted = (arr) => Array.from(new Set(arr)).sort((a,b)=>String(a).localeCompare(String(b)));
const byNewest = (a,b)=>b.year-a.year;
const byOldest = (a,b)=>a.year-b.year;
const byTitle = (a,b)=>a.title.localeCompare(b.title);
function buildShareUrl(id){
  if (typeof window==='undefined') return `#/pub/${id}`;
  return `${window.location.origin}${window.location.pathname}#/pub/${id}`;
}
(function tests(){
  try {
    if (typeof window!=='undefined'){
      const id='t'; console.assert(buildShareUrl(id).includes('#/pub/t'),'share url');
    }
    const a={title:'A',year:2020}, b={title:'B',year:2021};
    console.assert(byNewest(a,b)>0 && byOldest(a,b)<0 && byTitle(a,b)<0,'comparators ok');
  } catch(e){ console.warn('Runtime tests failed', e); }
})();

/* ========= Tiny DOM helper ========= */
const $app = document.getElementById('app');
document.getElementById('year').textContent = new Date().getFullYear();
function el(tag, attrs={}, kids=[]){
  const n=document.createElement(tag);
  for (const [k,v] of Object.entries(attrs)){
    if (k==='class') n.className=v;
    else if (k.startsWith('on') && typeof v==='function') n.addEventListener(k.slice(2).toLowerCase(), v);
    else n.setAttribute(k, v);
  }
  for (const c of [].concat(kids)) if (c!=null) n.appendChild(typeof c==='string'?document.createTextNode(c):c);
  return n;
}

/* ========= Components ========= */
function FiltersBar(state, setState, allTags){
  const wrap=el('div',{class:'filters'});
  const row=el('div',{class:'filters__row'});

  const searchRow=el('div',{class:'search-row'});
  const input=el('input',{class:'input',type:'text',value:state.search,placeholder:'Search title, authors, venue, abstract…'});
  input.addEventListener('input',(e)=>setState({search:e.target.value}));
  const b1=el('button',{class:'btn',onclick:()=>setState({sort:'newest'})},'Newest');
  const b2=el('button',{class:'btn',onclick:()=>setState({sort:'oldest'})},'Oldest');
  const b3=el('button',{class:'btn',onclick:()=>setState({sort:'title'})},'Title A→Z');
  searchRow.append(input,b1,b2,b3);

  const chips=el('div',{class:'chips'});
  chips.appendChild(el('span',{class:'muted'},'Project tags:'));
  allTags.forEach(t=>{
    const ch=el('span',{class:'chip'+(state.projectTags.includes(t)?' active':''),onclick:()=>toggleTag(t)},t);
    chips.appendChild(ch);
  });
  if (state.projectTags.length>0){
    chips.appendChild(el('button',{class:'btn',onclick:()=>setState({projectTags:[]})},'Clear'));
  }

  row.append(searchRow,chips);
  wrap.appendChild(row);
  return wrap;

  function toggleTag(t){
    const on=state.projectTags.includes(t);
    const next=on?state.projectTags.filter(x=>x!==t):state.projectTags.concat(t);
    setState({projectTags:next});
  }
}

function Card(p, onOpen, onTagClick){
  const card=el('div',{class:'card'});
  const imgbox=el('div',{class:'imgbox'},[el('img',{src:p.image,alt:p.title})]);
  const body=el('div',{class:'card-body'},[
    el('h3',{class:'card-title'},p.title),
    el('div',{class:'card-meta'},`${p.authors.join(', ')} · ${p.venue} · ${p.year}`),
    el('p',{class:'card-abstract'},p.abstract),
    (()=>{
      const tags=el('div',{class:'chips'});
      (p.projectTags||[]).forEach(t=>tags.appendChild(el('span',{class:'chip',title:'Filter by tag',onclick:()=>onTagClick(t)},t)));
      return tags;
    })(),
    (()=>{
      const row=el('div',{class:'row-split'});
      row.appendChild(el('span',{class:'link-sm',onclick:()=>onOpen(p)},'View details'));
      const links=el('div',{class:'links'});
      if (p.links?.pdf) links.appendChild(el('a',{class:'link-sm',href:p.links.pdf,target:'_blank',rel:'noreferrer'},'PDF'));
      if (p.links?.doi) links.appendChild(el('a',{class:'link-sm',href:p.links.doi,target:'_blank',rel:'noreferrer'},'DOI'));
      if (p.links?.publisher) links.appendChild(el('a',{class:'link-sm',href:p.links.publisher,target:'_blank',rel:'noreferrer'},'Publisher'));
      row.appendChild(links);
      return row;
    })()
  ]);
  card.append(imgbox,body);
  return card;
}

function Detail(pub, onBack){
  const root=el('div',{class:'detail'});
  root.appendChild(el('a',{class:'link-sm',href:'#/publications',onclick:(e)=>{e.preventDefault();onBack();}},'← Back to all publications'));
  const grid=el('div',{class:'detail-grid'});
  const left=el('div',{class:'detail-left'},[( ()=>{const bx=el('div',{class:'imgbox'}); bx.appendChild(el('img',{src:pub.image,alt:pub.title})); return bx;})()]);
  const right=el('div',{},[
    el('h1',{class:'detail-title'},pub.title),
    el('div',{class:'detail-sub'},pub.authors.join(', ')),
    el('div',{class:'detail-sub'},`${pub.venue} · ${pub.year}`),
    ( ()=>{const t=el('div',{class:'chips'}); (pub.projectTags||[]).forEach(x=>t.appendChild(el('span',{class:'chip'},x))); return t;})(),
    el('p',{class:'detail-abstract'},pub.abstract),
    ( ()=>{
      const row=el('div',{class:'links'});
      if (pub.links?.pdf) row.appendChild(el('a',{class:'link-sm',href:pub.links.pdf,target:'_blank',rel:'noreferrer'},'PDF'));
      if (pub.links?.doi) row.appendChild(el('a',{class:'link-sm',href:pub.links.doi,target:'_blank',rel:'noreferrer'},'DOI'));
      if (pub.links?.publisher) row.appendChild(el('a',{class:'link-sm',href:pub.links.publisher,target:'_blank',rel:'noreferrer'},'Publisher'));
      row.appendChild(el('span',{class:'link-sm',onclick:()=>{
        const url=buildShareUrl(pub.id);
        navigator.clipboard?.writeText(url);
        alert(`Link copied to clipboard! ${url}`);
      }},'Copy link'));
      return row;
    })()
  ]);
  grid.append(left,right);
  root.appendChild(grid);
  return root;
}

/* ========= Views ========= */
const state = { search:'', sort:'newest', projectTags:[] };
function setState(p){ Object.assign(state,p); render(); }

function publicationsView(){
  const frag=document.createDocumentFragment();

  const allTags = uniqSorted(PUBLICATIONS.flatMap(p=>p.projectTags||[]));
  frag.appendChild(FiltersBar(state,setState,allTags));

  const q=state.search.trim().toLowerCase();
  let list=PUBLICATIONS.filter(p=>{
    const hay = (p.title+' '+p.authors.join(' ')+' '+p.venue+' '+p.abstract).toLowerCase();
    const inText = hay.includes(q);
    const matchTags = state.projectTags.length ? state.projectTags.every(t => (p.projectTags||[]).includes(t)) : true;
    return inText && matchTags;
  });
  if (state.sort==='newest') list=list.slice().sort(byNewest);
  if (state.sort==='oldest') list=list.slice().sort(byOldest);
  if (state.sort==='title')  list=list.slice().sort(byTitle);

  if (list.length===0){
    frag.appendChild(el('div',{class:'muted'},'No results match your filters.'));
  } else {
    const grid=el('div',{class:'grid'});
    list.forEach(p=>grid.appendChild(Card(p,(pub)=>nav(`/pub/${pub.id}`),(t)=>setState({projectTags:[t]}))));
    frag.appendChild(grid);
  }
  return frag;
}

function researchListView(slug){
  const area = RESEARCH_AREAS[slug];
  if (!area) return el('div',{class:'prose'},[el('h2',{},'Not Found'), el('p',{},'Unknown research area.')]);

  const h = el('div',{class:'prose'},[
    el('h2',{},area.title),
    el('p',{class:'muted'},`Showing projects tagged with: ${area.requiredTags.join(' + ')}`)
  ]);

  const grid=el('div',{class:'grid'});
  const list = PUBLICATIONS.filter(p => area.requiredTags.every(t => (p.projectTags||[]).includes(t)));
  list.forEach(p => grid.appendChild(Card(p,(pub)=>nav(`/pub/${pub.id}`),(t)=>{})));

  const frag=document.createDocumentFragment();
  frag.appendChild(h);
  frag.appendChild(grid);
  return frag;
}

function cvView(){
  return el('div',{class:'prose'},[
    el('h2',{},'Curriculum Vitae'),
    el('p',{},'Add your CV content here (PDF link, short bio, appointments, awards, grants, teaching, service, etc.).')
  ]);
}
function aboutView(){
  return el('div',{class:'prose'},[
    el('h2',{},'About'),
    el('p',{},'Short description of your research program and interests. Replace this text with your content.')
  ]);
}

/* ========= Router ========= */
function nav(route){ window.location.hash = route; }
function render(){
  $app.innerHTML='';
  const hash = window.location.hash.slice(1) || '/publications';
  const pubMatch = hash.match(/^\/pub\/(.+)$/);
  const researchMatch = hash.match(/^\/research\/([a-z0-9-]+)$/);

  if (pubMatch){
    const id=pubMatch[1];
    const pub=PUBLICATIONS.find(p=>p.id===id);
    $app.appendChild(pub?Detail(pub,()=>nav('/publications')):el('div',{},'Not found'));
    return;
  }
  if (researchMatch){
    $app.appendChild(researchListView(researchMatch[1]));
    return;
  }
  if (hash==='/publications'){ $app.appendChild(publicationsView()); return; }
  if (hash==='/cv'){ $app.appendChild(cvView()); return; }
  if (hash==='/about'){ $app.appendChild(aboutView()); return; }
  if (hash==='/research'){
    const list = el('div',{class:'prose'},[
      el('h2',{},'Research'),
      el('p',{},'Choose an area from the Research menu above or from the list below.')
    ]);
    const ul = el('ul',{}, Object.entries(RESEARCH_AREAS).map(([slug,meta]) => el('li',{}, el('a',{href:`#/research/${slug}`},meta.title))));
    $app.append(list,ul);
    return;
  }
  $app.appendChild(publicationsView());
}
window.addEventListener('hashchange', render);
render();
