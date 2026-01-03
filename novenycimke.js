//<![CDATA[
(function() {
    'use strict';
    function transformPlants() {
        // Keressünk mindenhol, ahol poszt szövege lehet
        var containers = document.querySelectorAll('.post-body, [itemprop="articleBody"], .entry-content, article');
        
        containers.forEach(function(container) {
            if (container.dataset.plantsDone) return;
            
            var html = container.innerHTML;
            
            // 1. TISZTÍTÁS: Csak a szögletes zárójel belsejéből pucoljuk ki a szemetet
            html = html.replace(/\[<span[^>]*>|<\/span>\]/gi, '');
            
            // 2. KERESÉS: Nagyon szigorú regex, ami NEM engedi be a HTML kódokat a gombba
            // Csak olyan szöveget keresünk, ami közvetlenül a [ előtt van, de nincs benne kacsacsőr
            var plantRegex = /([^\[\n\r<>]+)\s*\[([^\[\]<>]+)\]/gi;

            var newHtml = html.replace(plantRegex, function(match, common, latin) {
                // Biztonsági szűrő: ha mégis maradt benne HTML kód (pl. > jel), azt levágjuk
                var cleanCommon = common;
                if (cleanCommon.indexOf('>') !== -1) {
                    cleanCommon = cleanCommon.substring(cleanCommon.lastIndexOf('>') + 1);
                }
                
                cleanCommon = cleanCommon.trim();
                var cleanLatin = latin.trim();

                // Ha a "Növények:" szó is benne maradt, azt is levághatjuk opcionálisan, 
                // de egyelőre hagyjuk meg, ha így szereted.
                if (cleanCommon.length < 2) return match;

                return '<span class="p-chip" title="Keresés: ' + cleanLatin + '" ' +
                       'style="cursor:pointer!important;background-color:#4CAF50!important;color:white!important;padding:5px 12px!important;border-radius:20px!important;display:inline-block!important;margin:3px!important;font-family:sans-serif!important;font-weight:bold!important;font-size:13px!important;box-shadow:0 2px 4px rgba(0,0,0,0.2)!important;border:none!important;" ' +
                       'onclick="window.location.href=\'/search?q=' + encodeURIComponent(cleanLatin) + '\'">' +
                       '🌱 ' + cleanCommon + '</span>';
            });

            if (html !== newHtml) {
                container.innerHTML = newHtml;
                container.dataset.plantsDone = "true";
            }
        });
    }

    // Elindítjuk többször is, hogy biztosan elkapja a betöltést
    setInterval(transformPlants, 1500); 
})();
//]]>
