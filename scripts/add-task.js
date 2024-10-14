import { loadHTML, processHTML } from "../scripts/parseHTMLtoString.js";

async function loadAddTask() {
    const htmlContent = await loadHTML('../html/add-task-main.html');

    if (htmlContent) {
        processHTML(htmlContent); // Den HTML-String an eine andere Funktion weiterleiten
    }    
}


window.loadAddTask = loadAddTask;
