(function() {
    'use strict';
    
    function transformPlants() {
        // Keressük a poszt szövegét
        var containers = document.querySelectorAll('.post-body, [itemprop="articleBody"], .entry-content, article');
        
        if (containers.length === 0) {
            return; // Még nem töltődött be a tartalom
        }
        
        containers.forEach(function(container) {
            if (container.dataset.plantsDone) return;
            
            var html = container.innerHTML;
            
            // 1. TISZTÍTÁS: Kiszórjuk a láthatatlan kódokat a szögletes zárójel környékéről
            html = html.replace(/\[<span[^>]*>|<\/span>\]/gi, '');
            
            // 2. KERESÉS: Magyar Név [Latin Név]
            var plantRegex = /([^\[\n\r<>]+)\s*\[([^\[\]<>]+)\]/gi;

            var newHtml = html.replace(plantRegex, function(match, common, latin) {
                var cleanCommon = common;
                
                // Ha maradt előtte HTML kód (pl. kép utáni div), levágjuk
                if (cleanCommon.indexOf('>') !== -1) {
                    cleanCommon = cleanCommon.substring(cleanCommon.lastIndexOf('>') + 1);
                }
                
                cleanCommon = cleanCommon.trim();
                var cleanLatin = latin.trim();

                if (cleanCommon.length < 2) return match;

                var searchUrl = '/search?q=' + encodeURIComponent(cleanLatin);

                return '<span class="p-chip" title="Összes találat: ' + cleanLatin + '" ' +
                       'style="cursor:pointer!important;background-color:#4CAF50!important;color:white!important;padding:5px 12px!important;border-radius:20px!important;display:inline-block!important;margin:3px!important;font-family:sans-serif!important;font-weight:bold!important;font-size:13px!important;box-shadow:0 2px 4px rgba(0,0,0,0.2)!important;border:none!important;" ' +
                       'onclick="window.location.href=\'' + searchUrl + '\'">' +
                       '🌱 ' + cleanCommon + '</span>';
            });

            if (html !== newHtml) {
                container.innerHTML = newHtml;
                container.dataset.plantsDone = "true";
                console.log('🌱 Növénycímke: ' + containers.length + ' konténer átalakítva.');
            }
        });
    }

    // INDÍTÁS: Több fázisban is megpróbáljuk
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', transformPlants);
    } else {
        transformPlants();
    }
    
    // Biztonsági ismétlések, ha lassú a blog betöltése
    setTimeout(transformPlants, 500);
    setTimeout(transformPlants, 2000);
    setInterval(transformPlants, 3000); 
})();
