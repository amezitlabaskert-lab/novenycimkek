(function() {
    'use strict';
    function transform() {
        const container = document.querySelector('.post-body, .entry-content, article');
        if (!container || container.dataset.processed) return;

        let html = container.innerHTML;
        html = html.replace(/\[<span[^>]*>|<\/span>\]|\[\s+|\]/g, (m) => m.includes('[') ? '[' : ']');

        // Regex a formátumhoz
        const plantRegex = /([^\[\n\r<]+)\s?\[([A-Z\s0-9\-\'\.]+)\]/gi;

        container.innerHTML = html.replace(plantRegex, (match, name, latin) => {
            if (name.trim().length < 2) return match;
            const cleanLatin = latin.trim();
            const cleanName = name.trim();

            // Vizuálisan vonzóbb gomb stílus (Box-shadow és Hover-hatás)
            return `<span class="p-chip" 
                    title="Kattints az összes ${cleanName} megtekintéséhez!"
                    style="cursor:pointer; background:#4CAF50 !important; color:white !important; padding:5px 15px; border-radius:20px; display:inline-block; margin:5px; font-family:sans-serif; font-weight:600; font-size:13px; box-shadow: 0 2px 4px rgba(0,0,0,0.2); transition: all 0.2s ease;"
                    onmouseover="this.style.background='#388E3C'; this.style.transform='translateY(-1px)';"
                    onmouseout="this.style.background='#4CAF50'; this.style.transform='translateY(0)';"
                    onclick="window.location.href='/search/label/${encodeURIComponent(cleanLatin)}'">
                    🌱 ${cleanName}</span>`;
        });
        container.dataset.processed = "true";
    }
    window.addEventListener('load', transform);
    setTimeout(transform, 1000);
})();
