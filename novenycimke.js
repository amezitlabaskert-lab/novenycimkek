(function() {
    'use strict';

    function transformPlants() {
        // Megkeressük az összes lehetséges konténert, ahol a poszt szövege lehet
        var containers = document.querySelectorAll('.post-body, [itemprop="articleBody"], .entry-content, article');
        
        containers.forEach(function(container) {
            // Ha már egyszer feldolgoztuk ezt a konténert, nem futunk le újra
            if (container.dataset.plantsDone) return;
            
            var html = container.innerHTML;
            
            // 1. TISZTÍTÁS: Kiszórjuk a Blogger által beszúrt láthatatlan span-eket a zárójelek közül
            html = html.replace(/\[<span[^>]*>|<\/span>\]/gi, '');
            
            // 2. KERESÉS: Magyar Név [Latin Név] formátum azonosítása
            // Olyan szöveget keresünk, ami NEM tartalmaz HTML kacsacsőrt (< >) a nevekben
            var plantRegex = /([^\[\n\r<>]+)\s*\[([^\[\]<>]+)\]/gi;

            var newHtml = html.replace(plantRegex, function(match, common, latin) {
                var cleanCommon = common;
                
                // 3. SEBÉSZET: Ha a Blogger elválasztó kódja (separator div) belelógna a névbe,
                // akkor csak az utolsó '>' utáni részt (a tényleges nevet) tartjuk meg.
                if (cleanCommon.indexOf('>') !== -1) {
                    cleanCommon = cleanCommon.substring(cleanCommon.lastIndexOf('>') + 1);
                }
                
                cleanCommon = cleanCommon.trim();
                var cleanLatin = latin.trim();

                // Ha a név túl rövid vagy üres, nem csinálunk gombot
                if (cleanCommon.length < 2) return match;

                // KERESÉS: A latin névre keresünk rá a blogon a biztos találat érdekében
                var searchUrl = '/search?q=' + encodeURIComponent(cleanLatin);

                // MEGJELENÍTÉS: Sötétzöld "pirula" gomb, fehér betűkkel, 🌱 ikonnal
                return '<span class="p-chip" title="Összes találat: ' + cleanLatin + '" ' +
                       'style="cursor:pointer!important;background-color:#4CAF50!important;color:white!important;padding:5px 12px!important;border-radius:20px!important;display:inline-block!important;margin:3px!important;font-family:sans-serif!important;font-weight:bold!important;font-size:13px!important;box-shadow:0 2px 4px rgba(0,0,0,0.2)!important;border:none!important;" ' +
                       'onclick="window.location.href=\'' + searchUrl + '\'">' +
                       '🌱 ' + cleanCommon + '</span>';
            });

            // Csak akkor frissítjük a DOM-ot, ha történt tényleges változás
            if (html !== newHtml) {
                container.innerHTML = newHtml;
                container.dataset.plantsDone = "true";
            }
        });
    }

    // Másodpercenkénti ellenőrzés, hogy a dinamikusan betöltődő posztokat is elkapja
    setInterval(transformPlants, 1500); 
})();
