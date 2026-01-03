//<![CDATA[
(function() {
    'use strict';
    function transform() {
        // Keressük a poszt tartalmát több lehetséges néven is
        var container = document.querySelector('.post-body, .entry-content, article, .post');
        if (!container || container.dataset.processed) return;

        var html = container.innerHTML;
        
        // 1. TISZTÍTÁS: Kiszórjuk a zavaró SPAN-eket a szögletes zárójel környékéről
        // Ez megakadályozza, hogy a motor elcsússzon a láthatatlan kódokon
        html = html.replace(/\[<span[^>]*>|<\/span>\]/gi, '');
        
        // 2. KERESÉS: Magyar Név [Latin Név]
        // Olyan mintát keresünk, ami nem tartalmaz HTML kacsacsőrt (< >) a nevekben
        var plantRegex = /([^\[\n\r<>]+)\s*\[([^\[\]<>]+)\]/gi;

        var newHtml = html.replace(plantRegex, function(match, common, latin) {
            var cleanCommon = common.trim();
            
            // Ha a Blogger elválasztó kódja (separator) belecsúszna az elejébe, levágjuk
            if (cleanCommon.indexOf('>') !== -1) {
                cleanCommon = cleanCommon.split('>').pop().trim();
            }
            
            var cleanLatin = latin.trim();
            if (cleanCommon.length < 2) return match;

            // KERESÉS: A latin névre keresünk rá, mert az a legstabilabb pont
            var searchUrl = '/search?q=' + encodeURIComponent(cleanLatin);

            // STÍLUS: Sötétzöld, kerek gomb, árnyékkal, hogy egyértelmű legyen
            return '<span class="p-chip" title="Keresés erre: ' + cleanLatin + '" ' +
                   'style="cursor:pointer!important;background-color:#4CAF50!important;color:white!important;' +
                   'padding:6px 14px!important;border-radius:20px!important;display:inline-block!important;' +
                   'margin:4px!important;font-family:sans-serif!important;font-weight:bold!important;' +
                   'font-size:13px!important;box-shadow:0 2px 5px rgba(0,0,0,0.3)!important;border:none!important;" ' +
                   'onclick="window.location.href=\'' + searchUrl + '\'">' +
                   '🌱 ' + cleanCommon + '</span>';
        });

        if (html !== newHtml) {
            container.innerHTML = newHtml;
        }
        container.dataset.processed = "true";
    }

    // Biztonsági indítások: azonnal, betöltéskor és picit később is
    if (document.readyState === 'complete') transform();
    window.addEventListener('load', transform);
    setTimeout(transform, 1000);
    setTimeout(transform, 2500);
})();
//]]>
