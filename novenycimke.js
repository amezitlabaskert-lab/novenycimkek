(function() {
    'use strict';
    function transform() {
        const container = document.querySelector('.post-body, .entry-content, article');
        if (!container || container.dataset.processed) return;

        let html = container.innerHTML;
        
        // 1. Lépés: Tisztítás - kiszedjük a zavaró HTML kódokat a név és a [latin] közül
        html = html.replace(/([^<>\n]+)\s*<span[^>]*>\s*\[<\/span>([^\[\]]+)\]/gi, '$1 [$2]');
        html = html.replace(/\[<span[^>]*>([^<>]+)<\/span>\]/gi, '[$1]');

        // 2. Lépés: Keresés (Magyar Név [Latin Név] formátumra)
        const plantRegex = /([^\[\n\r<]+)\s*\[([^\[\]]+)\]/gi;

        const newHtml = html.replace(plantRegex, (match, common, latin) => {
            if (common.trim().length < 2) return match;
            
            const cleanCommon = common.trim();
            const cleanLatin = latin.trim();

            // A keresésnél a latin névre ÉS a magyar névre is lövünk a biztonság kedvéért
            const searchUrl = `/search?q=${encodeURIComponent(cleanCommon + " " + cleanLatin)}`;

            return `<span class="p-chip" 
                    title="Keresés: ${cleanCommon}"
                    style="cursor:pointer !important; background:#4CAF50 !important; color:white !important; padding:6px 14px !important; border-radius:20px !important; display:inline-block !important; margin:4px !important; font-family:sans-serif !important; font-weight:bold !important; font-size:13px !important; box-shadow: 0 2px 5px rgba(0,0,0,0.3) !important; text-decoration:none !important; border:none !important;"
                    onclick="window.location.href='${searchUrl}'">
                    🌱 ${cleanCommon}</span>`;
        });

        if (html !== newHtml) {
            container.innerHTML = newHtml;
        }
        container.dataset.processed = "true";
    }

    window.addEventListener('load', transform);
    setTimeout(transform, 1500); // Biztonsági futtatás, ha lassú a blog
})();
