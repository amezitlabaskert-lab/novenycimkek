(function() {
    'use strict';
    function transform() {
        const container = document.querySelector('.post-body, .entry-content, article');
        if (!container || container.dataset.processed) return;

        let html = container.innerHTML;
        // Tisztítás: szögletes zárójel körüli szemét eltüntetése
        html = html.replace(/\[<span[^>]*>|<\/span>\]|\[\s+|\]/g, (m) => m.includes('[') ? '[' : ']');

        const plantRegex = /([^\[\n\r<]+)\s?\[([A-Z\s0-9\-\'\.]+)\]/gi;

        container.innerHTML = html.replace(plantRegex, (match, name, latin) => {
            if (name.trim().length < 2) return match;
            const cleanLatin = latin.trim();
            const cleanName = name.trim();

            return `<span class="p-chip" 
                    style="cursor:pointer; background:#e8f5e9 !important; color:#2e7d32 !important; padding:4px 12px; border-radius:15px; border:2px solid #4CAF50; display:inline-block; margin:4px; font-family:sans-serif; font-weight:bold; font-size:14px; box-shadow: 2px 2px 5px rgba(0,0,0,0.1);"
                    onclick="window.location.href='/search?q=${encodeURIComponent(cleanLatin)}'">
                    🌱 ${cleanName}</span>`;
        });
        container.dataset.processed = "true";
    }
    window.addEventListener('load', transform);
    setTimeout(transform, 1000);
})();
