// Asynchrone Funktion zum Laden der HTML-Datei
export async function loadHTML(url) {
    try {
        // Die HTML-Datei laden
        const response = await fetch(url);

        // Prüfen, ob die Antwort erfolgreich war
        if (!response.ok) {
            throw new Error('Error loading the HTML file.');
        }

        // Den Text der HTML-Datei extrahieren und zurückgeben
        return await response.text();
    } catch (error) {
        console.error('An error has occurred:', error);
    }
}


// Funktion, die den geladenen HTML-String weiterverarbeitet
export function processHTML(htmlString) {
    // Hier kannst du den String weiter verarbeiten
    //console.log('HTML-String:', htmlString);

    // Zum Beispiel: Den HTML-Inhalt in das DOM einfügen
    //document.getElementById('content').innerHTML = htmlString;
    document.querySelector('main').innerHTML = htmlString;
}
