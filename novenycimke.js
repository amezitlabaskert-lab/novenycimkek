/**
 * Blogger Plant Engine v2.0 - "Compose-Friendly"
 * Sima szövegből (Növény neve [Latin név]) csinál kattintható chipeket.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Keressük meg a bejegyzés törzsét (Blogger sablontól függően .post-body vagy .entry-content)
    const postBody = document.querySelector('.post-body, .entry-content');
    
    if (!postBody) return;

    // Ez a regex keresi a formátumot: Név [Latin név]
    // Példa: Paradicsom [Solanum lycopersicum]
    const plantRegex = /([A-Z-Zöüóőúéáűí\s]+)\s?\[([A-Z\s]+)\]/gi;

    // Végigfutunk a poszt szöveges tartalmán
    let content = postBody.innerHTML;
    
    // Lecseréljük a talált szövegeket HTML chipekre
    const updatedContent = content.replace(plantRegex, (match, commonName, latinName) => {
        return `<span class="p-chip" 
                      data-latin="${latinName.trim()}" 
                      title="${commonName.trim()} (${latinName.trim()})">
                  ${commonName.trim()}
                </span>`;
    });

    postBody.innerHTML = updatedContent;

    // Miután legeneráltuk a chipeket, ráakasztjuk a kattintás eseményt
    document.querySelectorAll('.p-chip').forEach(chip => {
        chip.addEventListener('click', (e) => {
            e.preventDefault();
            const latin = chip.getAttribute('data-latin');
            window.location.href = `/search?q=data-latin%3D"${encodeURIComponent(latin)}"`;
        });
    });
});