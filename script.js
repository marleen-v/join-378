function init() {
    //nur zum testen
    initBoard();
}


async function loadBoard() {
    const htmlContent = await loadHTML('./html/board.html');

    if (htmlContent) {
        processHTML(htmlContent); // Den HTML-String an eine andere Funktion weiterleiten
    }    
}


async function loadAddTask() {
    const htmlContent = await loadHTML('./html/add-task.html');

    if (htmlContent) {
        processHTML(htmlContent); // Den HTML-String an eine andere Funktion weiterleiten
    }    
}