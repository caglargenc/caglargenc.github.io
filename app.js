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
  'human-robot-interaction': { title: 'Human-Robot-Interaction', requiredTags: ['Human-Robot Interaction'] }
};

/* ========= Profile / landing page content ========= */
const PROFILE = {
  photo: '/images/Caglar_caricature.png',
  bio: [
    `I am an <strong>HCI/Design Researcher</strong> at the <strong><a href="https://research.tuni.fi/gameful-realities/gameful-futures-lab/" target="_blank" rel="noreferrer">Gameful Futures Lab</a></strong> at Tampere University, Finland. I have an <i>Industrial Design</i> background (B.Sc. from Istanbul Technical University) and received my Ph.D. in <i>Interaction Design</i> from Koç University, Istanbul.`,

    `In my research, I use <strong>material-centered</strong>, <strong>speculative</strong>, and <strong>research-through-design</strong> approaches to explore <i>wearable interactive materials</i>, <i>posthuman and biomaterial play</i> for broadening the  design beyond the human. Currently, I am leading the <strong><a href="https://www.play-bio.com/" target="_blank" rel="noreferrer">Play-Bio project</a></strong> (Research Council of Finland, 2024-2028), which explores the design of playful experiences that can foster more-than-human relations, such as care and kinship, with everyday biomaterials such as bacteria, mushrooms, and plants.`
  ],
  links: [
    { label: 'E-mail', href: 'mailto:id.caglargenc@gmail.com', icon: 'email' },
    { label: 'Google Scholar', href: 'https://scholar.google.com/citations?user=IR51YrsAAAAJ&hl=en', icon: 'scholar' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/caglar-genc/', icon: 'linkedin' },
    { label: 'Instagram', href: 'https://www.instagram.com/caglarge/', icon: 'instagram' }
  ]
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

function isAbsoluteUrl(value){
  return /^(https?:)?\/\//i.test(value) || value.startsWith('mailto:') || value.startsWith('tel:');
}

function normalizeAssetPath(value){
  if (!value) return '';
  const v = String(value).trim();
  if (!v) return '';

  // keep external links, hash links, and already-rooted paths as-is
  if (
    isAbsoluteUrl(v) ||
    v.startsWith('/') ||
    v.startsWith('#') ||
    v.startsWith('data:')
  ) {
    return v;
  }

  // make repo/local assets resolve from site root
  return `/${v.replace(/^\.?\//, '')}`;
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
    venueShort:     idxAny(cols, ['venueShort', 'venue short']),
    type:           idxAny(cols, ['type']),
    abstract:       idxAny(cols, ['abstract']),
    abstractShort:  idxAny(cols, ['abstractshort','abstract short']),
    abstractFull:   idxAny(cols, ['abstractfull','abstract full']),
    image:          idxAny(cols, ['image','imageurl','thumbnail','thumb','img']),
    pdf:            idxAny(cols, ['pdf','pdflink','pdf link']),
    doi:            idxAny(cols, ['doi']),
    publisher:      idxAny(cols, ['publisher','publisher link','acm']),
    video:          idxAny(cols, ['video','videos']),
    projectTags:    idxAny(cols, ['projecttags','project tags']),
    methodTags:     idxAny(cols, ['methodtags','method tags']),
    role:           idxAny(cols, ['role', 'roles']),
    selected:       idxAny(cols, ['selected'])
  };
    function cell(r,i){ const c=r.c[i]; return (c?.f ?? c?.v ?? '').toString().trim(); }
    const split = (s, seps=';') => s ? s.split(new RegExp(`[${seps}]+`, 'g')).map(x=>x.trim()).filter(Boolean) : [];
    const splitPipes = (s) => s ? s.split('|').map(x=>x.trim()).filter(Boolean) : [];

    PUBLICATIONS = rows.map(r=>{
      const links={};
      const pdf=normalizeAssetPath(cell(r,ix.pdf)); if(pdf) links.pdf=pdf;
      const doi=normalizeAssetPath(cell(r,ix.doi)); if(doi) links.doi=doi;
      const publisher=normalizeAssetPath(cell(r,ix.publisher)); if(publisher) links.publisher=publisher;
      const videoRaw = cell(r,ix.video);
      if (videoRaw){
        const vids=splitPipes(videoRaw).map(normalizeAssetPath);
        links.video = (vids.length<=1) ? (vids[0]||'') : vids;
      }
      const authors=split(cell(r,ix.authors),';,');
      const projectTags=split(cell(r,ix.projectTags),';,');
      const methodTags=split(cell(r,ix.methodTags),';,');
      const roleTags=split(cell(r,ix.role),';,');
      const yearStr=cell(r,ix.year);
      const year=Number(yearStr)|| (yearStr?Number(yearStr.replace(/[^\d]/g,'')):undefined);
      const selected = cell(r,ix.selected).trim().toLowerCase() === 'x';
      // choose first non-empty image among supported columns
      const image = normalizeAssetPath(cell(r,ix.image));

        return {
          id: cell(r,ix.id) || cryptoRandomId(),
          title: cell(r,ix.title),
          authors, year,
          venue: cell(r,ix.venue),
          venueShort: cell(r,ix.venueShort),
          type: cell(r,ix.type),
          abstract: cell(r,ix.abstract),
          abstractShort: cell(r,ix.abstractShort),
          abstractFull: cell(r,ix.abstractFull),
          image,
          links,
          projectTags,
          methodTags,
          roleTags,
          selected
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
    if(get('pdf','pdflink','pdf link')) links.pdf = normalizeAssetPath(get('pdf','pdflink','pdf link'));
      if(get('doi')) links.doi = normalizeAssetPath(get('doi'));
      if(get('publisher','publisher link','acm')) links.publisher = normalizeAssetPath(get('publisher','publisher link','acm'));
      if(get('video','videos')){
        const vids = get('video','videos').split('|').map(s=>normalizeAssetPath(s.trim())).filter(Boolean);
        links.video = vids.length<=1 ? (vids[0]||'') : vids;
      }

    const authors=split(get('authors')||'', ';,');
    const projectTags=split(get('projecttags','project tags')||'', ';,');
    const methodTags=split(get('methodtags','method tags')||'', ';,');
    const roleTags=split(get('role','roles')||'', ';,');
    const yearStr=get('year')||'';
    const year=Number(yearStr)|| (yearStr?Number(yearStr.replace(/[^\d]/g,'')):undefined);

    const selected = (get('selected') || '').trim().toLowerCase() === 'x';
    const image = normalizeAssetPath(get('image','imageurl','thumbnail','thumb','img'));

      return {
        id: get('id') || cryptoRandomId(),
        title: get('title') || '',
        authors, year,
        venue: get('venue') || '',
        venueShort: get('venueshort','venue short') || '',
        type: get('type') || '',
        abstract: get('abstract') || '',
        abstractShort: get('abstractshort','abstract short') || '',
        abstractFull: get('abstractfull','abstract full') || '',
        image,
        links,
        projectTags,
        methodTags,
        roleTags,
        selected
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
function FiltersBar(state,setState,allTags,allMethodTags){
  const wrap=el('div',{class:'filters'});
  const row=el('div',{class:'filters__row'});

  const searchRow=el('div',{class:'search-row'});
  const input=el('input',{class:'input',type:'text',value:state.search,placeholder:'Search title, authors, venue, abstract…'});
  input.addEventListener('input',(e)=>setState({search:e.target.value}));
  const b1=el('button',{class:'btn',onclick:()=>setState({sort:'newest'})},'Newest');
  const b2=el('button',{class:'btn',onclick:()=>setState({sort:'oldest'})},'Oldest');
  searchRow.append(input,b1,b2);

  const topicalChips=el('div',{class:'chips'});
  topicalChips.appendChild(el('span',{class:'muted'},'Topical tags:'));
  allTags.forEach(t=>{
    const ch=el(
      'span',
      {
        class:'chip'+(state.projectTags.includes(t)?' active':''),
        onclick:()=>toggleProjectTag(t)
      },
      t
    );
    topicalChips.appendChild(ch);
  });

  const methodChips=el('div',{class:'chips'});
  methodChips.appendChild(el('span',{class:'muted'},'Method tags:'));
  allMethodTags.forEach(t=>{
    const ch=el(
      'span',
      {
        class:'chip'+(state.methodTags.includes(t)?' active':''),
        onclick:()=>toggleMethodTag(t)
      },
      t
    );
    methodChips.appendChild(ch);
  });

  if(state.projectTags.length>0 || state.methodTags.length>0){
    const clearBtn = el(
      'button',
      {class:'btn',onclick:()=>setState({projectTags:[], methodTags:[]})},
      'Clear'
    );
    topicalChips.appendChild(clearBtn);
  }

  row.append(searchRow,topicalChips,methodChips);
  wrap.appendChild(row);
  return wrap;

  function toggleProjectTag(t){
    const on=state.projectTags.includes(t);
    const next=on ? state.projectTags.filter(x=>x!==t) : state.projectTags.concat(t);
    setState({projectTags:next});
  }

  function toggleMethodTag(t){
    const on=state.methodTags.includes(t);
    const next=on ? state.methodTags.filter(x=>x!==t) : state.methodTags.concat(t);
    setState({methodTags:next});
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
    imgNode = el(
      'div',
      {class:'imgbox__placeholder'},
      el('div',{class:'imgbox__placeholder-text'},'No image')
    );
  }

  const imgLink = el(
    'a',
    { class:'imgbox', href: detailHref, onclick:(e)=>{e.preventDefault(); onOpen(p);} },
    [ imgNode ]
  );

  const shortAbs = (p.abstractShort && p.abstractShort.trim().length)
    ? p.abstractShort
    : (p.abstract || '');

  const titleLink = el(
    'a',
    { href: detailHref, class:'card-title-link', onclick:(e)=>{e.preventDefault(); onOpen(p);} },
    p.title
  );

  const projectTagsRow = el('div',{class:'chips chips--top'});
  (p.projectTags||[]).forEach(t=>{
    projectTagsRow.appendChild(
      el('span',{class:'chip chip--small',title:'Filter by tag',onclick:()=>onTagClick(t)},t)
    );
  });

  const methodTagsRow = el('div',{class:'method-tags'});

  if ((p.methodTags || []).length) {
    methodTagsRow.appendChild(
      el('span', { class:'method-tags__label' }, 'Methods: ')
    );

    (p.methodTags || []).forEach((t, i, arr) => {
      methodTagsRow.appendChild(
        el(
          'button',
          {
            class:'method-tag method-tag--interactive',
            type:'button',
            title:'Filter by method tag',
            onclick:()=>onTagClick(t, 'method')
          },
          t
        )
      );

      if (i < arr.length - 1) {
        methodTagsRow.appendChild(
          el('span', { class:'method-tags__comma' }, ', ')
        );
      }
    });
  }

const body=el('div',{class:'card-body'},[
  (p.projectTags && p.projectTags.length) ? projectTagsRow : null,

  el('h3',{class:'card-title'},[ titleLink ]),
  p.venueShort
    ? el('div',{class:'card-venue-short'},p.venueShort)
    : null,

  p.type
    ? el('div',{class:'card-type'},p.type)
    : null,

  shortAbs ? el('p',{class:'card-abstract'},shortAbs) : null,

    (()=> {
      const row = el('div',{class:'row-split'});

      row.appendChild(
        el(
          'button',
          {
            class:'action-btn action-btn--text',
            type:'button',
            onclick:()=>onOpen(p)
          },
          'View details'
        )
      );

      const links = el('div',{class:'links links--actions'});

      if (p.links?.pdf) {
        links.appendChild(
          el(
            'a',
            {
              class:'action-btn action-btn--icon',
              href:p.links.pdf,
              target:'_blank',
              rel:'noreferrer',
              title:'Open PDF',
              'aria-label':'Open PDF'
            },
            el('i',{class:'bi bi-filetype-pdf','aria-hidden':'true'})
          )
        );
      }

      if (p.links?.doi) {
        links.appendChild(
          el(
            'a',
            {
              class:'action-btn action-btn--icon',
              href:p.links.doi,
              target:'_blank',
              rel:'noreferrer',
              title:'Open DOI',
              'aria-label':'Open DOI'
            },
            el('i',{class:'bi bi-link-45deg','aria-hidden':'true'})
          )
        );
      }

      if (p.links?.publisher) {
        links.appendChild(
          el(
            'a',
            {
              class:'action-btn action-btn--text',
              href:p.links.publisher,
              target:'_blank',
              rel:'noreferrer'
            },
            'Publisher'
          )
        );
      }

      row.appendChild(links);
      return row;
    })()
  ].filter(Boolean));

  card.append(imgLink,body);
  return card;
}

function isCaglarName(name){
  const normalized = String(name || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();

  return normalized === 'caglar genc';
}

function renderAuthors(authors = []){
  const wrap = el('div', { class: 'detail-authors' });

  authors.forEach((author, i) => {
    if (i > 0) wrap.appendChild(document.createTextNode(', '));

    if (isCaglarName(author)) {
      wrap.appendChild(el('strong', {}, author));
    } else {
      wrap.appendChild(document.createTextNode(author));
    }
  });

  return wrap;
}

function renderLabeledTagsLine(label, tags = []){
  const line = el('div', { class: 'detail-tagline' });

  line.appendChild(
    el('span', { class: 'detail-tagline__label' }, `${label}: `)
  );

  tags.forEach((tag, i) => {
    line.appendChild(
      el('span', { class: 'detail-tagline__tag' }, tag)
    );

    if (i < tags.length - 1) {
      line.appendChild(
        el('span', { class: 'detail-tagline__comma' }, ', ')
      );
    }
  });

  return line;
}


/* ======== Detail view ======== */
function Detail(pub,onBack){
  const root = el('div', { class:'detail' });

  root.appendChild(
    el(
      'a',
      {
        class:'link-sm',
        href:'#/publications',
        onclick:(e)=>{
          e.preventDefault();
          onBack();
        }
      },
      '← Back to all publications'
    )
  );

  const content = el('div', { class:'detail-right-only' });

  // project tags
  if (pub.projectTags && pub.projectTags.length) {
    const topTags = el('div', { class:'chips chips--top detail-project-tags' });
    (pub.projectTags || []).forEach(tag => {
      topTags.appendChild(
        el('span', { class:'chip chip--small' }, tag)
      );
    });
    content.appendChild(topTags);
  }

  // type above title
  if (pub.type) {
    content.appendChild(
      el('div', { class:'card-type detail-type' }, pub.type)
    );
  }

  // title
  content.appendChild(
    el('h1', { class:'detail-title' }, pub.title)
  );

  // authors
  if (pub.authors && pub.authors.length) {
    content.appendChild(renderAuthors(pub.authors));
  }

  // venue line
  if (pub.venueShort || pub.venue) {
    const venueLine = el('div', { class:'detail-venue-line' });

    if (pub.venueShort) {
      venueLine.appendChild(
        el('span', { class:'card-venue-short detail-venue-short' }, pub.venueShort)
      );
    }

    if (pub.venueShort && pub.venue) {
      venueLine.appendChild(
        el('span', { class:'detail-venue-sep' }, ' - ')
      );
    }

    if (pub.venue) {
      venueLine.appendChild(
        el('span', { class:'detail-venue-full' }, pub.venue)
      );
    }

    content.appendChild(venueLine);
  }

  // links directly after venue
  const linksRow = el('div', { class:'links links--actions detail-links' });

  if (pub.links?.pdf) {
    linksRow.appendChild(
      el(
        'a',
        {
          class:'action-btn action-btn--icon',
          href:pub.links.pdf,
          target:'_blank',
          rel:'noreferrer',
          title:'Open PDF',
          'aria-label':'Open PDF'
        },
        el('i', { class:'bi bi-filetype-pdf', 'aria-hidden':'true' })
      )
    );
  }

  if (pub.links?.doi) {
    linksRow.appendChild(
      el(
        'a',
        {
          class:'action-btn action-btn--icon',
          href:pub.links.doi,
          target:'_blank',
          rel:'noreferrer',
          title:'Open DOI',
          'aria-label':'Open DOI'
        },
        el('i', { class:'bi bi-link-45deg', 'aria-hidden':'true' })
      )
    );
  }

  if (pub.links?.publisher) {
    linksRow.appendChild(
      el(
        'a',
        {
          class:'action-btn action-btn--text',
          href:pub.links.publisher,
          target:'_blank',
          rel:'noreferrer'
        },
        'Publisher'
      )
    );
  }

  if (pub.links?.pdf || pub.links?.doi || pub.links?.publisher) {
    content.appendChild(linksRow);
  }

  // abstract 
  const full = (pub.abstractFull && pub.abstractFull.trim().length)
    ? pub.abstractFull
    : (pub.abstract || '');

  if (full) {
    content.appendChild(
      el('p', { class:'detail-abstract' }, full)
    );
  }

  // methods
  if (pub.methodTags && pub.methodTags.length) {
    content.appendChild(renderLabeledTagsLine('Methods', pub.methodTags));
  }

  // role
  if (pub.roleTags && pub.roleTags.length) {
    content.appendChild(renderLabeledTagsLine('Role', pub.roleTags));
  }



  // image after abstract
  if (pub.image) {
    const imgWrap = el('div', { class:'imgbox detail-image', style:'margin-top:16px;' });
    imgWrap.appendChild(
      el('img', { src:pub.image, alt:pub.title })
    );
    content.appendChild(imgWrap);
  }

  // video after image
  const videos = Array.isArray(pub.links?.video)
    ? pub.links.video
    : (pub.links?.video ? [pub.links.video] : []);

  if (videos.length > 0) {
    content.appendChild(el('h3', { class:'section-title' }, 'Video:'));

    if (videos.length === 1) {
      content.appendChild(buildVideoEmbed(videos[0]));
    } else {
      const selWrap = el('div', { class:'video-select' });
      const sel = el('select', { class:'input' });

      videos.forEach((u, i) => {
        let host = '';
        try {
          host = new URL(u).hostname.replace(/^www\./, '');
        } catch {
          host = `Video ${i + 1}`;
        }
        sel.appendChild(
          el('option', {}, `Video ${i + 1}: ${host}`)
        );
      });

      const slot = el('div');

      function render(idx){
        slot.innerHTML = '';
        slot.appendChild(buildVideoEmbed(videos[idx]));
      }

      sel.addEventListener('change', () => render(sel.selectedIndex));
      selWrap.appendChild(sel);
      content.appendChild(selWrap);
      content.appendChild(slot);
      render(0);
    }
  }

  root.appendChild(content);
  return root;
}
/* ========= Views & Router ========= */
const state={search:'',sort:'newest',projectTags:[],methodTags:[]};
function setState(p){Object.assign(state,p);render();}

function publicationsView(){
  const frag=document.createDocumentFragment();
  const allTags = uniqSorted(PUBLICATIONS.flatMap(p => p.projectTags || []));
  const allMethodTags = uniqSorted(PUBLICATIONS.flatMap(p => p.methodTags || []));
  frag.appendChild(FiltersBar(state,setState,allTags,allMethodTags));

  const q=state.search.trim().toLowerCase();
  let list=PUBLICATIONS.filter(p=>{
    const hay=(
      p.title+' '+
      p.authors.join(' ')+' '+
      p.venue+' '+
      (p.venueShort || '')+' '+
      (p.type || '')+' '+
      p.abstract+' '+
      (p.projectTags || []).join(' ')+' '+
      (p.methodTags || []).join(' ')
    ).toLowerCase();

    const inText=hay.includes(q);
    const matchProjectTags=state.projectTags.length
      ? state.projectTags.every(t => (p.projectTags || []).includes(t))
      : true;

    const matchMethodTags=state.methodTags.length
      ? state.methodTags.every(t => (p.methodTags || []).includes(t))
      : true;

    return inText && matchProjectTags && matchMethodTags;
  });
  if(state.sort==='newest') list=list.slice().sort(byNewest);
  if(state.sort==='oldest') list=list.slice().sort(byOldest);

  if(list.length===0){
    frag.appendChild(el('div',{class:'muted'},'No results match your filters.'));
  }else{
    const grid=el('div',{class:'grid'});
    list.forEach(p =>
      grid.appendChild(
        Card(
          p,
          (pub)=>nav(`/pub/${pub.id}`),
          (tag, type='project') => {
            if (type === 'method') {
              setState({ methodTags:[tag] });
            } else {
              setState({ projectTags:[tag] });
            }
          }
        )
      )
    );    
    frag.appendChild(grid);
  }
  return frag;
}

function researchListView(slug){
  const area=RESEARCH_AREAS[slug];
  if(!area) return el('div',{class:'prose'},[el('h2',{},'Not Found'),el('p',{},'Unknown research area.')]);

  const head=el('div',{class:'prose'},[el('h2',{},area.title),el('p',{class:'muted'},`Showing projects tagged with: ${area.requiredTags.join(' + ')}`)]);
  const grid=el('div',{class:'grid'});
  const list = PUBLICATIONS
  .filter(p => area.requiredTags.every(t => (p.projectTags || []).includes(t)))
  .slice()
  .sort(byNewest);

  list.forEach(p =>
    grid.appendChild(
      Card(
        p,
        (pub)=>nav(`/pub/${pub.id}`),
        (tag, type='project') => {
          if (type === 'method') {
            setState({ methodTags:[tag] });
          } else {
            setState({ projectTags:[tag] });
          }
        }
      )
    )
  );
  const frag=document.createDocumentFragment(); frag.append(head,grid); return frag;
}


function socialIcon(type){
  const wrap = el('span', { class: 'home-hero__icon', 'aria-hidden': 'true' });

  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', '20');
  svg.setAttribute('height', '20');
  svg.setAttribute('fill', 'currentColor');

  function add(tag, attrs){
    const node = document.createElementNS(svgNS, tag);
    Object.entries(attrs).forEach(([k,v]) => node.setAttribute(k, v));
    svg.appendChild(node);
  }

  switch(type){
    case 'email':
      add('path', {
        d: 'M4 7h16v10H4zM4 7l8 6 8-6'
      });
      break;

    case 'linkedin':
      add('path', {
        d: 'M6.5 8.5a1.2 1.2 0 1 1 0-2.4 1.2 1.2 0 0 1 0 2.4zM5.5 10h2v8h-2zm4 0h1.9v1.1h.03c.26-.5.92-1.3 2.57-1.3 2.75 0 3.26 1.8 3.26 4.14V18h-2v-3.57c0-.85-.02-1.95-1.19-1.95-1.19 0-1.37.93-1.37 1.89V18h-2z'
      });
      break;

    case 'instagram':
      add('path', {
        d: 'M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5zm4 4.5A4.5 4.5 0 1 0 16.5 12 4.5 4.5 0 0 0 12 7.5zm0 1.8A2.7 2.7 0 1 1 9.3 12 2.7 2.7 0 0 1 12 9.3zm5.2-2.4a1.05 1.05 0 1 0 1.05 1.05A1.05 1.05 0 0 0 17.2 6.9z'
      });
      break;

    case 'scholar':
      /* cleaner academic cap icon */
      add('path', {
        d: 'M12 4 2 9l10 5 8-4v5h2V9L12 4zm-6 8v3c0 1.7 3 3 6 3s6-1.3 6-3v-3l-6 3-6-3z'
      });
      break;

    default:
      add('circle', { cx:'12', cy:'12', r:'8' });
  }

  wrap.appendChild(svg);
  return wrap;
}

function SelectedPublicationsCarousel(){
  const items = PUBLICATIONS
    .filter(p => p.selected && p.image)
    .slice()
    .sort(byNewest);

  if (!items.length) return null;

const section = el('section', { class:'landing-carousel home-selected' });
const title = el('h2', { class:'home-recent__title' }, 'Selected Publications');
const viewport = el('div', { class:'landing-carousel__viewport' });
const track = el('div', { class:'landing-carousel__track' });

section.appendChild(title);

  items.forEach(pub => {
    const href = `#/pub/${pub.id}`;

    const card = el(
      'a',
      {
        class:'landing-carousel__item',
        href,
        onclick:(e)=>{
          e.preventDefault();
          nav(`/pub/${pub.id}`);
        }
      }
    );

    card.appendChild(
      el('img', {
        src: pub.image,
        alt: pub.title
      })
    );

    const overlay = el('div', { class:'landing-carousel__overlay' });

    if (pub.type) {
      overlay.appendChild(
        el('div', { class:'landing-carousel__type' }, pub.type)
      );
    }

    overlay.appendChild(
      el('div', { class:'landing-carousel__title' }, pub.title)
    );

    if (pub.venueShort) {
      overlay.appendChild(
        el('div', { class:'landing-carousel__venue' }, pub.venueShort)
      );
    }

    card.appendChild(overlay);
    track.appendChild(card);
  });

  viewport.appendChild(track);
  section.appendChild(viewport);

  const prevBtn = el(
    'button',
    {
      class:'landing-carousel__arrow landing-carousel__arrow--prev',
      type:'button',
      'aria-label':'Show previous publications'
    },
    '‹'
  );

  const nextBtn = el(
    'button',
    {
      class:'landing-carousel__arrow landing-carousel__arrow--next',
      type:'button',
      'aria-label':'Show next publications'
    },
    '›'
  );

  section.appendChild(prevBtn);
  section.appendChild(nextBtn);

  let currentPage = 0;
  let timer = null;
  let startX = 0;
  let currentX = 0;
  let isDragging = false;

function visibleCount(){
  const w = window.innerWidth;
  if (w <= 640) return 1;
  if (w <= 900) return 2;
  return 3;
}

  function totalPages(){
    return Math.max(1, Math.ceil(items.length / visibleCount()));
  }

  function update(animate = true){
    const count = visibleCount();
    const pages = totalPages();

    section.style.setProperty('--landing-visible-count', String(count));

    if (currentPage >= pages) currentPage = 0;
    if (currentPage < 0) currentPage = pages - 1;

    track.style.transition = animate ? 'transform .55s ease' : 'none';
    track.style.transform = `translateX(-${currentPage * 100}%)`;

    const shouldShowArrows = items.length > count;
    prevBtn.style.display = shouldShowArrows ? 'flex' : 'none';
    nextBtn.style.display = shouldShowArrows ? 'flex' : 'none';
  }

  function next(){
    currentPage = (currentPage + 1) % totalPages();
    update(true);
  }

  function prev(){
    currentPage = (currentPage - 1 + totalPages()) % totalPages();
    update(true);
  }

  function startAuto(){
    stopAuto();
    if (items.length > visibleCount()) {
      timer = setInterval(next, 4000);
    }
  }

  function stopAuto(){
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  prevBtn.addEventListener('click', () => {
    prev();
    startAuto();
  });

  nextBtn.addEventListener('click', () => {
    next();
    startAuto();
  });

  viewport.addEventListener('mouseenter', stopAuto);
  viewport.addEventListener('mouseleave', startAuto);

  viewport.addEventListener('touchstart', (e) => {
    if (!e.touches.length) return;
    stopAuto();
    isDragging = true;
    startX = e.touches[0].clientX;
    currentX = startX;
    track.style.transition = 'none';
  }, { passive: true });

  viewport.addEventListener('touchmove', (e) => {
    if (!isDragging || !e.touches.length) return;
    currentX = e.touches[0].clientX;
  }, { passive: true });

  viewport.addEventListener('touchend', () => {
    if (!isDragging) return;
    const deltaX = currentX - startX;
    const threshold = 50;

    isDragging = false;

    if (deltaX > threshold) {
      prev();
    } else if (deltaX < -threshold) {
      next();
    } else {
      update(true);
    }

    startAuto();
  });

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      update(false);
      startAuto();
    }, 120);
  });

  update(false);
  startAuto();

  return section;
}


function homeView(){
  const frag = document.createDocumentFragment();
  const isMobile = window.matchMedia('(max-width: 900px)').matches;

  const carousel = SelectedPublicationsCarousel();

  // hero / bio section
  const section = el('section', { class: 'home-hero' });

  const media = el('aside', { class: 'home-hero__media' });

  const photoWrap = el('div', { class: 'home-hero__photo' });
  photoWrap.appendChild(
    el('img', {
      src: PROFILE.photo,
      alt: 'Portrait of Çağlar Genç'
    })
  );

  media.append(photoWrap);

  const panel = el('div', { class: 'home-hero__panel prose' });

  PROFILE.bio.forEach(paragraph => {
    const p = el('p');
    p.innerHTML = paragraph;
    panel.appendChild(p);
  });

  // contact row (icons only)
  const reach = el('div', { class: 'reach-row', 'aria-label': 'Contact links' });
  const reachLinks = el('div', { class: 'reach-row__links' });

  PROFILE.links.forEach(link => {
    const a = el(
      'a',
      {
        class: 'reach-row__link',
        href: link.href,
        title: link.label,
        'aria-label': link.label,
        ...(link.href.startsWith('mailto:') ? {} : { target: '_blank', rel: 'noreferrer' })
      }
    );

    a.appendChild(socialIcon(link.icon));
    reachLinks.appendChild(a);
  });

  reach.append(reachLinks);
  panel.appendChild(reach);

  const emailLine = el(
    'div',
    { class: 'home-hero__email' },
    [
      el(
        'a',
        {
          href: 'mailto:id.caglargenc@gmail.com'
        },
        'id.caglargenc@gmail.com'
      )
    ]
  );

  panel.appendChild(emailLine);

  section.append(media, panel);

  // always show hero before carousel
  frag.appendChild(section);
  if (carousel) frag.appendChild(carousel);

  // most recent publications
  const recentSection = el('section', { class: 'home-recent' });

  recentSection.appendChild(
    el('h2', { class: 'home-recent__title' }, 'MOST RECENT PUBLICATIONS')
  );

  const recentList = PUBLICATIONS
    .filter(p => Number.isFinite(p.year))
    .slice()
    .sort(byNewest)
    .slice(0, 6);

  if (recentList.length) {
    const grid = el('div', { class: 'grid home-recent__grid' });

    recentList.forEach(p =>
      grid.appendChild(
        Card(
          p,
          (pub) => nav(`/pub/${pub.id}`),
          (tag, type='project') => {
            if (type === 'method') {
              setState({ methodTags:[tag] });
            } else {
              setState({ projectTags:[tag] });
            }
          }
        )
      )
    );

    recentSection.appendChild(grid);
  } else {
    recentSection.appendChild(
      el('div', { class:'muted' }, 'No recent publications found.')
    );
  }

  frag.appendChild(recentSection);

  return frag;
}


function cvView(){ return el('div',{class:'prose'},[el('h2',{},'Curriculum Vitae'),el('p',{},'Add your CV content here.')]); }
function aboutView(){ return el('div',{class:'prose'},[el('h2',{},'About'),el('p',{},'Short description of your research program and interests.')]); }

function nav(route){window.location.hash=route;}
function showLoading(on){const n=document.getElementById('loading'); if(n) n.style.display=on?'block':'none';}

function initMobileNav(){
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('mainnav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  window.addEventListener('hashchange', () => {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  });
}

initMobileNav();


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
  const hash=window.location.hash.slice(1)||'/';
  const pubMatch=hash.match(/^\/pub\/(.+)$/);
  const researchMatch=hash.match(/^\/research\/([a-z0-9-]+)$/);

 if(pubMatch){ const id=pubMatch[1]; const pub=PUBLICATIONS.find(p=>p.id===id); $app.appendChild(pub?Detail(pub,()=>nav('/publications')):el('div',{},'Not found')); return; }
  if(researchMatch){ $app.appendChild(researchListView(researchMatch[1])); return; }
  if(hash==='/' || hash==='/home'){ $app.appendChild(homeView()); return; }
  if(hash==='/publications'){ $app.appendChild(publicationsView()); return; }
  if(hash==='/cv'){ $app.appendChild(cvView()); return; }
  if(hash==='/about'){ $app.appendChild(aboutView()); return; }
  if(hash==='/research'){ $app.appendChild(publicationsView()); return; }
  $app.appendChild(publicationsView());
}

window.addEventListener('hashchange',render);
boot();
