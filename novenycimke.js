(function() {
    'use strict';
    
    function transformPlantLabels() {
        var containers = document.querySelectorAll('.post-body, .entry-content');
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

                var out = prefix + '<a href="' + searchPath + '" title="' + fullUrl + '" ' +
                       'style="display:inline-flex!important; align-items:center!important; vertical-align:middle!important; ' +
                       'margin:4px 4px 4px 0!important; padding:3px 8px!important; ' +
                       'background:#F7F7F7!important; color:#0000008A!important; ' +
                       'border-radius:12px!important; border:none!important; ' +
                       'font-family:\'Plus Jakarta Sans\', sans-serif!important; ' +
                       'font-size:15px!important; font-weight:400!important; ' +
                       'text-decoration:none!important; transition: opacity 0.2s ease!important; cursor:pointer!important;">' +
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
    setInterval(transformPlantLabels, 2000);
})();
