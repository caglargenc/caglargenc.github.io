/* ========= Google Sheet source (your published link) =========
   https://docs.google.com/spreadsheets/d/e/2PACX-1vSXlWmdKOU4QcbHpmft1qtMB-mmnfVPETQQ97bMn304ZeYVMiEuelDFWZcrzeczPyhXU1Voi4bBqKXZ/pubhtml?gid=0&single=true
*/
const SHEET_PUBLIC_EID = '2PACX-1vSXlWmdKOU4QcbHpmft1qtMB-mmnfVPETQQ97bMn304ZeYVMiEuelDFWZcrzeczPyhXU1Voi4bBqKXZ';
const SHEET_GID        = '0';
function sheetUrlJSON(){
  return `https://docs.google.com/spreadsheets/d/e/${SHEET_PUBLIC_EID}/gviz/tq?tqx=out:json&gid=${encodeURIComponent(SHEET_GID)}`;
}
function sheetUrlCSV(){
  return `https://docs.google.com/spreadsheets/d/e/${SHEET_PUBLIC_EID}/pub?gid=${encodeURIComponent(SHEET_GID)}&single=true&output=csv`;
}

/* ========= Research Areas ↔ Tag filters ========= */
const RESEARCH_AREAS = {
  'more-than-human-design': { title: 'More-Than-Human Design', requiredTags: ['More-than-Human'] },
  'fashionable-wearables': { title: 'Fashionable Wearables',   requiredTags: ['Wearables'] },
  'transhuman-communication': { title: 'Transhuman Communication', requiredTags: ['Transhuman'] },
  'tangible-interaction-design': { title: 'Tangible Interaction Design', requiredTags: ['Tangible'] },
  'human-robot-interaction': { title: 'Human-Robot-Interaction', requiredTags: ['HRI'] }
};

/* ========= Utilities & tiny tests ========= */
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
      const id='t'; console.assert(buildShareUrl(id).includes('#/pub/t'),'share url ok');
    }
    const a={title:'A',year:2020}, b={title:'B',year:2021};
    console.assert(byNewest(a,b)>0 && byOldest(a,b)<0 && byTitle(a,b)<0,'comparators ok');
  } catch(e){ console.warn('Runtime tests failed', e); }
})();

/* --- YouTube helpers (watch/shorts/youtu.be/embed) --- */
function getYouTubeId(u){
  try {
    const url = new URL(u);
    const host = url.hostname.replace(/^www\./,'');
    if (host === 'youtu.be') return url.pathname.slice(1);
    if (host.includes('youtube.com') && url.pathname.startsWith('/shorts/')) {
      return url.pathname.split('/').filter(Boolean)[1];
    }
    if (host.includes('youtube.com')) {
      const v = url.searchParams.get('v');
      if (v) return v;
      const path = url.pathname.split('/').filter(Boolean);
      if (path[0] === 'embed' && path[1]) return path[1];
    }
  } catch {}
  return null;
}
function youTubeIframe(id){
  const src = `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&playsinline=1&origin=${encodeURIComponent(location.origin)}`;
  const iframe = el('iframe', {
    src,
    title: 'YouTube video',
    frameborder: '0',
    allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
    allowfullscreen: 'true',
    referrerpolicy: 'strict-origin-when-cross-origin'
  });
  const outer = el('div', { class: 'video-embed' });
  const box = el('div', { class: 'video-embed__box' });
  box.appendChild(iframe);
  outer.appendChild(box);
  return outer;
}
function youTubeThumb(id, originalUrl){
  const thumb = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  const wrap = el('div', { class: 'yt-thumb', onclick: () => {
    const embed = youTubeIframe(id);
    wrap.replaceWith(embed);
  }});
  wrap.appendChild(el('img', { src: thumb, alt: 'YouTube thumbnail' }));
  const play = el('div', { class: 'yt-play' });
  wrap.appendChild(play);

  const linkRow = el('div', { class: 'muted', style: 'margin:8px 0' });
  let host = 'YouTube';
  try { host = new URL(originalUrl).hostname.replace(/^www\./,''); } catch {}
  linkRow.append('If the player fails, open externally: ',
    el('a', { href: originalUrl, target: '_blank', rel: 'noreferrer' }, host)
  );

  const container = el('div', {});
  container.appendChild(wrap);
  container.appendChild(linkRow);
  return container;
}

/* --- Vimeo + file embeds + fallback --- */
function getVimeoId(u){
  try {
    const url = new URL(u);
    if (url.hostname.includes('vimeo.com')) {
      const id = url.pathname.split('/').filter(Boolean)[0];
      return /^\d+$/.test(id) ? id : null;
    }
  } catch {}
  return null;
}
function buildVideoEmbed(url){
  const yt = getYouTubeId(url);
  if (yt) return youTubeThumb(yt, url);

  const vm = getVimeoId(url);
  if (vm) {
    const iframe = el('iframe', {
      src: `https://player.vimeo.com/video/${vm}`,
      title: 'Vimeo video',
      frameborder: '0',
      allow: 'autoplay; fullscreen; picture-in-picture',
      allowfullscreen: 'true',
      referrerpolicy: 'strict-origin-when-cross-origin'
    });
    const outer = el('div', { class: 'video-embed' });
    const box = el('div', { class: 'video-embed__box' });
    box.appendChild(iframe); outer.appendChild(box);
    const tip = el('div', { class: 'muted', style: 'margin:8px 0' },
      'Seeing Error 153? On Vimeo, allow embedding for your domains in Settings → Privacy.');
    const linkRow = el('div', { class: 'muted', style: 'margin:8px 0' });
    linkRow.append('If the player fails, open externally: ',
      el('a', { href: url, target: '_blank', rel: 'noreferrer' }, 'Vimeo'));
    const container = el('div', {});
    container.appendChild(outer);
    container.appendChild(tip);
    container.appendChild(linkRow);
    return container;
  }

  if (/\.(mp4|webm|ogg)(\?|$)/i.test(url)) {
    const container = el('div', {});
    const video = el('video', { controls: 'true', playsinline: 'true', style: 'width:100%; height:auto' });
    video.src = url;
    container.appendChild(video);
    const linkRow = el('div', { class: 'muted', style: 'margin:8px 0' });
    linkRow.append('Open video file: ', el('a', { href: url, target: '_blank', rel: 'noreferrer' }, 'download/play'));
    container.appendChild(linkRow);
    return container;
  }

  const note = el('div', { class: 'muted' }, 'This video may not allow embedding. Open in a new tab: ');
  note.appendChild(el('a', { href: url, target: '_blank', rel: 'noreferrer' }, url));
  return note;
}

/* ========= DOM helpers ========= */
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

/* ========= Load publications from Google Sheets (GViz → CSV fallback) ========= */
let PUBLICATIONS = [];

// helper to find an index by trying several header names
function idxAny(cols, names){
  for (const name of names){
    const i = cols.findIndex(c => (c||'').toLowerCase() === name.toLowerCase());
    if (i !== -1) return i;
  }
  return -1;
}

async function loadPublicationsFromSheet(){
  // Try GViz first
  try {
    const res = await fetch(sheetUrlJSON(), { cache: 'no-store' });
    if (!res.ok) throw new Error(`GViz fetch failed: ${res.status}`);
    const text = await res.text();
    const json = JSON.parse(text.replace(/^[\s\S]*setResponse\(/, '').replace(/\);\s*$/, ''));

    const cols = json.table.cols.map(c => (c.label || '').trim());
    const rows = json.table.rows || [];

    const ix = {
      id:             idxAny(cols, ['id']),
      title:          idxAny(cols, ['title']),
      authors:        idxAny(cols, ['authors']),
      year:           idxAny(cols, ['year']),
      venue:          idxAny(cols, ['venue']),
      abstract:       idxAny(cols, ['abstract']),
      abstractShort:  idxAny(cols, ['abstractshort','abstract short']),
      abstractFull:   idxAny(cols, ['abstractfull','abstract full']),
      image:          idxAny(cols, ['image','imageurl','thumbnail','thumb','img']),
      pdf:            idxAny(cols, ['pdf','pdflink','pdf link']),
      doi:            idxAny(cols, ['doi']),
      publisher:      idxAny(cols, ['publisher','publisher link','acm']),
      video:          idxAny(cols, ['video','videos']),
      projectTags:    idxAny(cols, ['projecttags','project tags'])
    };
    function cell(r,i){ const c=r.c[i]; return (c?.f ?? c?.v ?? '').toString().trim(); }
    const split = (s, seps=';') => s ? s.split(new RegExp(`[${seps}]+`, 'g')).map(x=>x.trim()).filter(Boolean) : [];
    const splitPipes = (s) => s ? s.split('|').map(x=>x.trim()).filter(Boolean) : [];

    PUBLICATIONS = rows.map(r=>{
      const links={};
      const pdf=cell(r,ix.pdf); if(pdf) links.pdf=pdf;
      const doi=cell(r,ix.doi); if(doi) links.doi=doi;
      const publisher=cell(r,ix.publisher); if(publisher) links.publisher=publisher;
      const videoRaw = cell(r,ix.video);
      if (videoRaw){ const vids=splitPipes(videoRaw); links.video = (vids.length<=1) ? (vids[0]||'') : vids; }

      const authors=split(cell(r,ix.authors),';,');
      const projectTags=split(cell(r,ix.projectTags),';,');
      const yearStr=cell(r,ix.year);
      const year=Number(yearStr)|| (yearStr?Number(yearStr.replace(/[^\d]/g,'')):undefined);

      // choose first non-empty image among supported columns
      const image = cell(r,ix.image);

      return {
        id: cell(r,ix.id) || cryptoRandomId(),
        title: cell(r,ix.title),
        authors, year,
        venue: cell(r,ix.venue),
        abstract: cell(r,ix.abstract),
        abstractShort: cell(r,ix.abstractShort),
        abstractFull: cell(r,ix.abstractFull),
        image,
        links,
        projectTags
      };
    }).filter(p=>p.title);
    if (!PUBLICATIONS.length) throw new Error('No rows parsed from GViz JSON');
    return;
  } catch (e) {
    console.warn('GViz failed, falling back to CSV:', e);
  }

  // CSV fallback
  const res2 = await fetch(sheetUrlCSV(), { cache: 'no-store' });
  if (!res2.ok) throw new Error(`CSV fetch failed: ${res2.status}. Ensure the same tab (gid=${SHEET_GID}) is published.`);
  const csv = await res2.text();
  const rows2 = parseCSV(csv); // returns objects with LOWERCASED keys

  const split = (s, seps=';') => s ? s.split(new RegExp(`[${seps}]+`, 'g')).map(x=>x.trim()).filter(Boolean) : [];
  const splitPipes = (s) => s ? s.split('|').map(x=>x.trim()).filter(Boolean) : [];

  PUBLICATIONS = rows2.map(r=>{
    const links={};
    const get = (...keys) => {
      for (const k of keys){ if (r[k]) return r[k]; }
      return '';
    };
    if(get('pdf','pdflink','pdf link')) links.pdf = get('pdf','pdflink','pdf link');
    if(get('doi')) links.doi = get('doi');
    if(get('publisher','publisher link','acm')) links.publisher = get('publisher','publisher link','acm');
    if(get('video','videos')){
      const vids = get('video','videos').split('|').map(s=>s.trim()).filter(Boolean);
      links.video = vids.length<=1 ? (vids[0]||'') : vids;
    }

    const authors=split(get('authors')||'', ';,');
    const projectTags=split(get('projecttags','project tags')||'', ';,');
    const yearStr=get('year')||'';
    const year=Number(yearStr)|| (yearStr?Number(yearStr.replace(/[^\d]/g,'')):undefined);

    const image = get('image','imageurl','thumbnail','thumb','img');

    return {
      id: get('id') || cryptoRandomId(),
      title: get('title') || '',
      authors, year,
      venue: get('venue') || '',
      abstract: get('abstract') || '',
      abstractShort: get('abstractshort','abstract short') || '',
      abstractFull: get('abstractfull','abstract full') || '',
      image,
      links,
      projectTags
    };
  }).filter(p=>p.title);
  if (!PUBLICATIONS.length) throw new Error('No rows parsed from CSV');
}

/* Minimal CSV → objects (headers lowercased for reliable access) */
function parseCSV(text){
  const rows=[]; let i=0, field='', row=[], inQuotes=false;
  const pushField=()=>{row.push(field);field='';};
  const pushRow=()=>{rows.push(row);row=[];};
  while(i<text.length){
    const ch=text[i];
    if(inQuotes){
      if(ch==='\"'){ if(text[i+1]==='\"'){field+='\"';i++;} else {inQuotes=false;} }
      else field+=ch;
    }else{
      if(ch==='\"') inQuotes=true;
      else if(ch===',') pushField();
      else if(ch==='\n'){pushField();pushRow();}
      else if(ch!=='\r') field+=ch;
    }
    i++;
  }
  if(field.length||row.length){pushField();pushRow();}
  const headers=rows.shift().map(h=>h.trim().toLowerCase());
  return rows
    .filter(r=>r.length && r.some(v=>v.trim().length))
    .map(r=>{
      const o={}; headers.forEach((h,idx)=>o[h]=(r[idx]??'').trim()); return o;
    });
}
function cryptoRandomId(){
  try{ return 'row-'+crypto.getRandomValues(new Uint32Array(1))[0].toString(16); }
  catch{ return 'row-'+Math.random().toString(16).slice(2); }
}

/* ========= UI bits ========= */
function FiltersBar(state,setState,allTags){
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
  chips.appendChild(el('span',{class:'muted'},'Topical tags:'));
  allTags.forEach(t=>{
    const ch=el('span',{class:'chip'+(state.projectTags.includes(t)?' active':''),onclick:()=>toggleTag(t)},t);
    chips.appendChild(ch);
  });
  if(state.projectTags.length>0){
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

/* === CARD: Title → Year → abstractShort → tags → links (PDF/DOI/Publisher)
       + Image and Title are clickable to open details
       + Placeholder if no image === */
function Card(p,onOpen,onTagClick){
  const detailHref = `#/pub/${p.id}`;
  const card=el('div',{class:'card'});

  let imgNode;
  if (p.image) {
    imgNode = el('img',{src:p.image,alt:p.title});
  } else {
    // placeholder
    imgNode = el('div',{class:'imgbox__placeholder'},
      el('div',{class:'imgbox__placeholder-text'},'No image'));
  }

  const imgLink = el(
    'a',
    { class:'imgbox', href: detailHref, onclick:(e)=>{e.preventDefault(); onOpen(p);} },
    [ imgNode ]
  );

  const shortAbs = (p.abstractShort && p.abstractShort.trim().length) ? p.abstractShort : (p.abstract || '');

  // Clickable TITLE
  const titleLink = el(
    'a',
    { href: detailHref, class:'card-title-link', onclick:(e)=>{e.preventDefault(); onOpen(p);} },
    p.title
  );

  const body=el('div',{class:'card-body'},[
    el('h3',{class:'card-title'},[ titleLink ]),
    el('div',{class:'card-meta'},`${p.year ?? ''}`),
    shortAbs ? el('p',{class:'card-abstract'},shortAbs) : null,
    (()=>{
      const tags=el('div',{class:'chips'});
      (p.projectTags||[]).forEach(t=>tags.appendChild(el('span',{class:'chip',title:'Filter by tag',onclick:()=>onTagClick(t)},t)));
      return tags;
    })(),
    (()=>{
      const row=el('div',{class:'row-split'});
      row.appendChild(el('span',{class:'link-sm',onclick:()=>onOpen(p)},'View details'));
      const links=el('div',{class:'links'});
      if (p.links?.pdf)       links.appendChild(el('a',{class:'link-sm',href:p.links.pdf,target:'_blank',rel:'noreferrer'},'PDF'));
      if (p.links?.doi)       links.appendChild(el('a',{class:'link-sm',href:p.links.doi,target:'_blank',rel:'noreferrer'},'DOI'));
      if (p.links?.publisher) links.appendChild(el('a',{class:'link-sm',href:p.links.publisher,target:'_blank',rel:'noreferrer'},'Publisher'));
      row.appendChild(links);
      return row;
    })()
  ].filter(Boolean));

  card.append(imgLink,body);
  return card;
}

/* ======== Detail view ======== */
function Detail(pub,onBack){
  const root=el('div',{class:'detail'});

  root.appendChild(el('a',{class:'link-sm',href:'#/publications',onclick:(e)=>{e.preventDefault();onBack();}},'← Back to all publications'));

  const content=el('div',{class:'detail-right-only'});
  content.appendChild(el('h1',{class:'detail-title'},pub.title));

  const tags=el('div',{class:'chips'}); (pub.projectTags||[]).forEach(x=>tags.appendChild(el('span',{class:'chip'},x))); content.appendChild(tags);

// Authors on their own line
if (pub.authors && pub.authors.length){
  content.appendChild(
    el('div', { class: 'detail-sub' }, pub.authors.join(', '))
  );
}

// Venue on its own line, in italics
if (pub.venue){
  content.appendChild(
    el('div', { class: 'detail-sub' }, el('em', {}, pub.venue))
  );
}

// Year on its own line
if (pub.year){
  content.appendChild(
    el('div', { class: 'detail-sub' }, String(pub.year))
  );
}



  if(pub.image){
    const imgWrap=el('div',{class:'imgbox',style:'margin-top:16px;'}); imgWrap.appendChild(el('img',{src:pub.image,alt:pub.title})); content.appendChild(imgWrap);
  }

  const full=(pub.abstractFull && pub.abstractFull.trim().length)? pub.abstractFull : (pub.abstract||'');
  if(full) content.appendChild(el('p',{class:'detail-abstract'},full));

  const linksRow=el('div',{class:'links'});
  if(pub.links?.pdf) linksRow.appendChild(el('a',{class:'link-sm',href:pub.links.pdf,target:'_blank',rel:'noreferrer'},'PDF'));
  if(pub.links?.doi) linksRow.appendChild(el('a',{class:'link-sm',href:pub.links.doi,target:'_blank',rel:'noreferrer'},'DOI'));
  content.appendChild(linksRow);

  const videos = Array.isArray(pub.links?.video)? pub.links.video : (pub.links?.video?[pub.links.video]:[]);
  if(videos.length>0){
    content.appendChild(el('h3',{class:'section-title'},'Watch'));
    if(videos.length===1){
      content.appendChild(buildVideoEmbed(videos[0]));
    }else{
      const selWrap=el('div',{class:'video-select'}); const sel=el('select',{class:'input'});
      videos.forEach((u,i)=>{let host='';try{host=new URL(u).hostname.replace(/^www\./,'');}catch{host=`Video ${i+1}`;} sel.appendChild(el('option',{},`Video ${i+1}: ${host}`));});
      const slot=el('div'); function render(idx){slot.innerHTML=''; slot.appendChild(buildVideoEmbed(videos[idx]));}
      sel.addEventListener('change',()=>render(sel.selectedIndex));
      selWrap.appendChild(sel); content.appendChild(selWrap); content.appendChild(slot); render(0);
    }
  }


  root.appendChild(content);
  return root;
}

/* ========= Views & Router ========= */
const state={search:'',sort:'newest',projectTags:[]};
function setState(p){Object.assign(state,p);render();}

function publicationsView(){
  const frag=document.createDocumentFragment();
  const allTags=uniqSorted(PUBLICATIONS.flatMap(p=>p.projectTags||[]));
  frag.appendChild(FiltersBar(state,setState,allTags));

  const q=state.search.trim().toLowerCase();
  let list=PUBLICATIONS.filter(p=>{
    const hay=(p.title+' '+p.authors.join(' ')+' '+p.venue+' '+p.abstract).toLowerCase();
    const inText=hay.includes(q);
    const matchTags=state.projectTags.length? state.projectTags.every(t=>(p.projectTags||[]).includes(t)) : true;
    return inText && matchTags;
  });
  if(state.sort==='newest') list=list.slice().sort(byNewest);
  if(state.sort==='oldest') list=list.slice().sort(byOldest);
  if(state.sort==='title')  list=list.slice().sort(byTitle);

  if(list.length===0){
    frag.appendChild(el('div',{class:'muted'},'No results match your filters.'));
  }else{
    const grid=el('div',{class:'grid'});
    list.forEach(p=>grid.appendChild(Card(p,(pub)=>nav(`/pub/${pub.id}`),(t)=>setState({projectTags:[t]}))));
    frag.appendChild(grid);
  }
  return frag;
}

function researchListView(slug){
  const area=RESEARCH_AREAS[slug];
  if(!area) return el('div',{class:'prose'},[el('h2',{},'Not Found'),el('p',{},'Unknown research area.')]);

  const head=el('div',{class:'prose'},[el('h2',{},area.title),el('p',{class:'muted'},`Showing projects tagged with: ${area.requiredTags.join(' + ')}`)]);
  const grid=el('div',{class:'grid'});
  const list=PUBLICATIONS.filter(p=>area.requiredTags.every(t=>(p.projectTags||[]).includes(t)));
  list.forEach(p=>grid.appendChild(Card(p,(pub)=>nav(`/pub/${pub.id}`),()=>{})));

  const frag=document.createDocumentFragment(); frag.append(head,grid); return frag;
}

function cvView(){ return el('div',{class:'prose'},[el('h2',{},'Curriculum Vitae'),el('p',{},'Add your CV content here.')]); }
function aboutView(){ return el('div',{class:'prose'},[el('h2',{},'About'),el('p',{},'Short description of your research program and interests.')]); }

function nav(route){window.location.hash=route;}
function showLoading(on){const n=document.getElementById('loading'); if(n) n.style.display=on?'block':'none';}

/* ========= Boot ========= */
async function boot(){
  try{ showLoading(true); await loadPublicationsFromSheet(); }
  catch(err){
    console.error(err);
    $app.innerHTML='';
    $app.appendChild(el('div',{class:'prose'},[
      el('h2',{},'Could not load publications'),
      el('p',{},'Make sure your Google Sheet is published to the web and publicly viewable.'),
      el('p',{},`Tip: In Google Sheets → File → Share → Publish to web → select the correct tab (gid=${SHEET_GID}) and publish.`),
      el('p',{},'Error: '+(err?.message||String(err)))
    ]));
    return;
  } finally { showLoading(false); }
  render();
}

/* ========= Router ========= */
function render(){
  $app.innerHTML='';
  const hash=window.location.hash.slice(1)||'/publications';
  const pubMatch=hash.match(/^\/pub\/(.+)$/);
  const researchMatch=hash.match(/^\/research\/([a-z0-9-]+)$/);

  if(pubMatch){ const id=pubMatch[1]; const pub=PUBLICATIONS.find(p=>p.id===id); $app.appendChild(pub?Detail(pub,()=>nav('/publications')):el('div',{},'Not found')); return; }
  if(researchMatch){ $app.appendChild(researchListView(researchMatch[1])); return; }
  if(hash==='/publications'){ $app.appendChild(publicationsView()); return; }
  if(hash==='/cv'){ $app.appendChild(cvView()); return; }
  if(hash==='/about'){ $app.appendChild(aboutView()); return; }
  if(hash==='/research'){
    const list=el('div',{class:'prose'},[el('h2',{},'Research'),el('p',{},'Choose an area from the Research menu above or from the list below.')]);
    const ul=el('ul',{},Object.entries(RESEARCH_AREAS).map(([slug,meta])=>el('li',{},el('a',{href:`#/research/${slug}`},meta.title))));
    $app.append(list,ul); return;
  }
  $app.appendChild(publicationsView());
}

window.addEventListener('hashchange',render);
boot();
