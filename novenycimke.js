(function() {
    'use strict';
    
    function transformPlantLabels() {
        // Hozzáadtuk a #modal-body-content-et, hogy a modalban is keressen
        var containers = document.querySelectorAll('.post-body, .entry-content, #modal-body-content');
        
        containers.forEach(function(container) {
            if (container.dataset.plantsDone) return;
            var html = container.innerHTML;
            html = html.replace(/\[<span[^>]*>|<\/span>\]/gi, '');
            var plantRegex = /([^\[\n\r<>]+)\s*\[([^\[\]<>]+)\]/gi;

            var newHtml = html.replace(plantRegex, function(match, common, latin) {
                var prefix = "";
                var cleanCommon = common;
                if (cleanCommon.indexOf('>') !== -1) {
                    var lastTagIndex = cleanCommon.lastIndexOf('>');
                    prefix = cleanCommon.substring(0, lastTagIndex + 1);
                    cleanCommon = cleanCommon.substring(lastTagIndex + 1);
                }
                var labelMatch = cleanCommon.match(/^(.*?)(Növények|Növény|Ültetve|Lista):\s*/i);
                if (labelMatch) {
                    prefix += labelMatch[0];
                    cleanCommon = cleanCommon.substring(labelMatch[0].length);
                }
                cleanCommon = cleanCommon.trim();
                var cleanLatin = latin.trim();
                if (cleanCommon.length < 2) return match;

                var searchPath = '/search?q=' + encodeURIComponent(cleanLatin);
                var fullUrl = window.location.origin + searchPath;

                // 3D PAPÍR STÍLUS BEÉPÍTVE
                var out = prefix + '<a href="' + searchPath + '" title="' + fullUrl + '" ' +
                        'style="display:inline-flex!important; align-items:center!important; vertical-align:middle!important; ' +
                        'margin:4px 6px 4px 0!important; padding:4px 12px!important; ' +
                        'background:#fcfcfc!important; color:#444444!important; ' + // Világos papír alap
                        'border-radius:6px!important; border:1px solid #d1d1d1!important; ' +
                        'box-shadow: 0 2px 4px rgba(0,0,0,0.08), inset 0 1px 0 #ffffff !important; ' + // 3D hatás (árnyék + belső fény)
                        'font-family:\'Plus Jakarta Sans\', sans-serif!important; ' +
                        'font-size:14px!important; font-weight:500!important; ' +
                        'text-decoration:none!important; transition: all 0.2s ease!important; cursor:pointer!important;">' +
                        cleanCommon + '</a>';
                return out;
            });

            if (html !== newHtml) {
                container.innerHTML = newHtml;
                container.dataset.plantsDone = "true";
            }
        });
    }

    // Indítás
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', transformPlantLabels);
    } else {
        transformPlantLabels();
    }
    window.addEventListener('load', transformPlantLabels);
    
    // Rövidebb intervallum, hogy a modal nyitásakor hamarabb frissüljön
    setInterval(transformPlantLabels, 1000);
})();
