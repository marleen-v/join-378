function init() {
 
}


function openBoards() {
    window.location = "../html/boards.html";
}


function openAddTask() {
    window.location = "../html/add-task.html";
}


async function loadBoards() {
    const htmlContent = await loadHTML('../templates/boards.html');

    if (htmlContent) {
        processHTML(htmlContent); // Den HTML-String an eine andere Funktion weiterleiten
    }    
}


async function loadAddTask() {
    const htmlContent = await loadHTML('../templates/add-task.html');

    if (htmlContent) {
        processHTML(htmlContent); // Den HTML-String an eine andere Funktion weiterleiten
    }    
}