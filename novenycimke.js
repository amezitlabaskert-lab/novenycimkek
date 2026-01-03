(function() {
    'use strict';
    function transform() {
        // Megkeressük a posztot
        const container = document.querySelector('.post-body, .entry-content, article');
        if (!container || container.dataset.processed) return;

        // 1. ELŐKEZELÉS: Kivesszük a belső span-eket a zárójelek környékéről, 
        // hogy a regex lássa a tiszta szöveget
        let html = container.innerHTML;
        
        // Ez a rész kiszedi a span-eket a szögletes zárójelek közül
        const cleanRegex = /\[<span[^>]*>|<\/span>\]|\[\s+|\]/g;
        html = html.replace(cleanRegex, (m) => m.includes('[') ? '[' : ']');

        // 2. KERESÉS ÉS ÁTALAKÍTÁS
        const plantRegex = /([^\[\n\r<]+)\s?\[([A-Z\s0-9\-\'\.]+)\]/gi;

        const updatedHtml = html.replace(plantRegex, (match, name, latin) => {
            // Csak akkor alakítjuk át, ha értelmes név van előtte
            if (name.trim().length < 2) return match;

            return `<span class="p-chip" data-latin="${latin.trim()}" 
                    style="cursor:pointer; background:#e8f5e9; color:#2e7d32; padding:3px 10px; border-radius:15px; border:1px solid #c8e6c9; display:inline-block; margin:2px; font-family:sans-serif; font-size:14px;"
                    onclick="window.location.href='/search?q=data-latin%3D%22${encodeURIComponent(latin.trim())}%22'">
                    🌱 ${name.trim()}</span>`;
        });

        container.innerHTML = updatedHtml;
        container.dataset.processed = "true";
    }

    // Futtatás több hullámban a biztonság kedvéért
    if (document.readyState === 'complete') transform();
    else window.addEventListener('load', transform);
    
    // Tartalék, ha a sablonod késve töltené be a tartalmat
    setTimeout(transform, 1000);
})();
