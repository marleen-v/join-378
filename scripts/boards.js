// Asynchrone Funktion zum Laden der HTML-Datei
async function loadHTML(url) {
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


function getBoardBar() {
    return /*html*/`
        <div class="board-to-do">To Do</div>
        <div class="board-In-progress">In Progress</div>
        <div class="board-feedback">Await feedback</div>
        <div class="board-done">Done</div>
    `;
}


  // Funktion, die den geladenen HTML-String weiterverarbeitet
function processHTML(htmlString) {
    // Hier kannst du den String weiter verarbeiten
    console.log('HTML-String:', htmlString);
  
    // Zum Beispiel: Den HTML-Inhalt in das DOM einfügen
    //document.getElementById('content').innerHTML = htmlString;
    document.querySelector('body').innerHTML = htmlString;
    document.querySelector('.boards').innerHTML = boardHTML();
    document.querySelector('.board-bar').innerHTML = getBoardBar();
}


function boardHTML() {
    return /*html*/`
        <div class="board-head"></div>
        <div class="board-search">
            <div class="board-headline"><h1>Board</h1></div>
            <div class="search-task"><input class="board-search-input" type="text"></div>
            <div class="btn-task-container"><button class="btn-task">Add Task +</button></div>
        </div>
        <div class="board-bar"></div>
        <div class="board-main"></div>
    `;
}


async function initBoard() {
    const htmlContent = await loadHTML('../html/board.html');

    if (htmlContent) {
        processHTML(htmlContent); // Den HTML-String an eine andere Funktion weiterleiten
    }    
}



