/**
 * Blogger Plant Engine v3.0 - High Performance
 * Fix: Nem lassítja a blogot, és bárhol felismeri a [Latin] nevet.
 */

(function() {
    'use strict';

    function transformPlants() {
        // Csak a posztok törzsében keresünk, hogy gyors legyen
        const postBody = document.querySelector('.post-body, .entry-content');
        if (!postBody || postBody.dataset.plantsProcessed) return;

        // Okosabb kereső: megtalálja a szöveget a [Zárójel] előtt
        const plantRegex = /([A-Z-Zöüóőúéáűí\s\-\.\']+)\s?\[([A-Z\s0-9\-\'\.]+)\]/gi;

        let content = postBody.innerHTML;
        const updatedContent = content.replace(plantRegex, (match, before, latin) => {
            return `<span class="p-chip" data-latin="${latin.trim()}" title="${before.trim()} (${latin.trim()})">${before.trim()}</span>`;
        });

        if (content !== updatedContent) {
            postBody.innerHTML = updatedContent;
            
            // Eseménykezelők hozzáadása
            postBody.querySelectorAll('.p-chip').forEach(chip => {
                chip.onclick = function() {
                    const search = `data-latin="${this.dataset.latin}"`;
                    window.location.href = `/search?q=${encodeURIComponent(search)}`;
                };
            });
        }
        
        // Megjelöljük, hogy kész, ne fusson le többször
        postBody.dataset.plantsProcessed = "true";
    }

    // Azonnali futtatás, amikor a DOM kész, nincs várakozás
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', transformPlants);
    } else {
        transformPlants();
    }
})();
