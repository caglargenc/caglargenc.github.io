(function() {
    // Utility functions (assume these are defined elsewhere or add them here)
    function err(e) { console.error(e); }
    function formatAuthors(list) {
        if (!Array.isArray(list) || !list.length) return '';
        if (list.length === 1) return list[0];
        if (list.length === 2) return list.join(' & ');
        return list.slice(0, -1).join(', ') + ' & ' + list[list.length - 1];
    }

    // Dummy implementations for missing functions (replace with real ones)
    async function loadPublications() {
        // Replace with actual fetch logic
        return [];
    }
    function renderPublicationsPortfolio() {
        // Replace with actual render logic
    }
    function renderPublicationDetail() {
        // Replace with actual render logic
    }

    async function main() {
        let data;
        const container = document.getElementById('publication-detail') || document.body; // Adjust selector as needed
        const id = ""; // Set publication id as needed

        try {
            data = await loadPublications();
        } catch(e) {
            err(e);
            container.innerHTML = '<p>Could not load publications data.</p>';
            return;
        }

        const p = data.find(x => String(x.id) === String(id));
        if (!p) {
            container.innerHTML = '<p>Publication not found. <a href="publications.html">Back to all publications</a></p>';
            return;
        }

        const authors = formatAuthors(p.authors);
        container.innerHTML = `
<div class="pub-detail-wrap">
    <div class="pub-detail-media">${p.image ? `<img src="${p.image}" alt="${p.title} cover">` : ''}</div>
    <div class="pub-detail-body">
        <h1 class="pub-detail-title">${p.title}</h1>
        <p class="pub-detail-authors">${authors}${p.year ? ` • ${p.year}` : ''}${p.venue ? ` • ${p.venue}` : ''}</p>
        ${p.tags && p.tags.length ? `<div class="pub-tags">${p.tags.map(t=>`<span class='tag'>${t}</span>`).join('')}</div>` : ''}
        ${p.abstract ? `<h3>Abstract</h3><p class="pub-abstract">${p.abstract}</p>` : ''}
        <div class="pub-links">
            ${p.pdfUrl ? `<a class="btn" href="${p.pdfUrl}" target="_blank" rel="noopener">View PDF</a>` : ''}
            ${p.doi ? `<a class="btn" href="${p.doi}" target="_blank" rel="noopener">DOI</a>` : ''}
            ${p.projectUrl ? `<a class="btn" href="${p.projectUrl}">Project</a>` : ''}
            <a class="btn btn-outline" href="publications.html">All Publications</a>
        </div>
    </div>
</div>`;
    }

    // ===== Minimal self-tests (do not depend on network) =====
    function assert(c,m){ if(!c) throw new Error(m); }
    function runTests(){
        try {
            assert(formatAuthors([]) === '', 'formatAuthors empty');
            assert(formatAuthors(['A']) === 'A', 'formatAuthors single');
            assert(formatAuthors(['A','B']) === 'A & B', 'formatAuthors pair');
            assert(formatAuthors(['A','B','C']) === 'A, B & C', 'formatAuthors list');
            const badge = document.getElementById('tests-status');
            if (badge) { badge.textContent = '✓ Tests passed'; badge.classList.add('ok'); }
        } catch (e) {
            const badge = document.getElementById('tests-status');
            if (badge) { badge.textContent = '✗ Tests failed: ' + e.message; badge.classList.add('fail'); }
        }
    }

    window.__pubs = { loadPublications, renderPublicationsPortfolio, renderPublicationDetail };

    function onReady(){
        renderPublicationsPortfolio();
        renderPublicationDetail();
        runTests();
        main(); // Call main async function
    }
    (document.readyState === 'loading')
        ? document.addEventListener('DOMContentLoaded', onReady)
        : onReady();
})();