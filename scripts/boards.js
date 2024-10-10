// Funktion zum dynamischen Laden der HTML-Datei
function loadHTML(url, targetElementId) {
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Netzwerk-Fehler beim Laden der HTML-Datei.');
        }
        return response.text();
      })
      .then(data => {
        // Den HTML-Inhalt in das Ziel-Element einfügen
        //document.getElementById(targetElementId).innerHTML = data;
        document.querySelector(targetElementId).innerHTML = data;
      })
      .catch(error => {
        console.error('Fehler:', error);
      });
  }

function initBoard() {
    let body = document.querySelector('body');
    loadHTML('../html/board.html', 'body');
}



