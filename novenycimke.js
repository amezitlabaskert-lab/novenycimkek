(function() {
    'use strict';
    function transform() {
        // Keressük a poszt tartalmát a Blogger sablonokban szokásos helyeken
        var containers = document.querySelectorAll('.post-body, .entry-content, article, [itemprop="articleBody"]');
        
        containers.forEach(function(container) {
            // Megállítjuk, ha már egyszer lefutott ezen a dobozon
            if (container.dataset.processed) return;

            var html = container.innerHTML;
            
            // 1. TISZTÍTÁS: Kiszórjuk a zavaró HTML kódokat a szögletes zárójel környékéről
            html = html.replace(/\[<span[^>]*>|<\/span>\]/gi, '');

            // 2. KERESÉS: Magyar Név [Latin Név]
            // Olyan szöveget keresünk, ami NEM tartalmaz HTML kacsacsőrt (< >) a nevekben
            var plantRegex = /([^\[\n\r<>]+)\s*\[([^\[\]<>]+)\]/gi;

            var newHtml = html.replace(plantRegex, function(match, common, latin) {
                var cleanCommon = common;
                
                // Ha a Blogger elválasztó kódja (separator) belecsúszna az elejébe, 
                // csak az utolsó '>' utáni részt (a tiszta nevet) tartjuk meg.
                if (cleanCommon.indexOf('>') !== -1) {
                    cleanCommon = cleanCommon.substring(cleanCommon.lastIndexOf('>') + 1);
                }
                
                cleanCommon = cleanCommon.trim();
                var cleanLatin = latin.trim();

                // Ha a név túl rövid (pl. csak egy írásjel), nem csinálunk gombot
                if (cleanCommon.length < 2) return match;

                // KERESÉS: A latin névre keresünk rá, mert ez a legbiztosabb találat
                var searchUrl = '/search?q=' + encodeURIComponent(cleanLatin);

                // STÍLUS: Sötétzöld, kerek gomb, árnyékkal és fehér betűvel
                return '<span class="p-chip" title="Keresés: ' + cleanLatin + '" ' +
                       'style="cursor:pointer!important;background-color:#4CAF50!important;color:white!important;' +
                       'padding:6px 14px!important;border-radius:20px!important;display:inline-block!important;' +
                       'margin:4px!important;font-family:sans-serif!important;font-weight:bold!important;' +
                       'font-size:13px!important;box-shadow:0 2px 5px rgba(0,0,0,0.3)!important;border:none!important;" ' +
                       'onclick="window.location.href=\'' + searchUrl + '\'">' +
                       '🌱 ' + cleanCommon + '</span>';
            });

            if (html !== newHtml) {
                container.innerHTML = newHtml;
                container.dataset.processed = "true";
            }
        });
    }

    // Folyamatos figyelés, ha a Blogger késve töltené be a tartalmat
    setInterval(transform, 1500);
})();
