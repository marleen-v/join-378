const FIREBASE_URL = 'https://join-378-default-rtdb.europe-west1.firebasedatabase.app/';
const USERS_DIR = '/users';
const TASKS_DIR = '/tasks';


async function loadData(path=""){
    let res = await fetch(FIREBASE_URL + path + ".json");
    let resToJson = await res.json();
    tasksFromFirebase = resToJson;
    return tasksFromFirebase;
  }

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


  // Funktion, die den geladenen HTML-String weiterverarbeitet
function processHTML(htmlString) {
    // Hier kannst du den String weiter verarbeiten
    //console.log('HTML-String:', htmlString);
  
    // Zum Beispiel: Den HTML-Inhalt in das DOM einfügen
    //document.getElementById('content').innerHTML = htmlString;
    document.querySelector('main').innerHTML = htmlString;
}


async function initBoard() {
    const htmlContent = await loadHTML('../html/add-task.html');

    if (htmlContent) {
        processHTML(htmlContent); // Den HTML-String an eine andere Funktion weiterleiten
        
        
    }    
}


async function showData() {
    let json = await loadData(TASKS_DIR);
    let taskTemplate = await loadHTML('../templates/add-task-card.html');
    console.log(json);
    
    let index = 0;
    json.forEach(element => {
        if(element.Category === "To Do") {
            console.log(element.Title);
            let toDo = document.querySelector('.board-main-to-do');
            let html = /*html*/`
                <div>${element.Title}</div>  
            `;
            toDo.innerHTML += taskTemplate;
            console.log(index);
            
            let card = document.querySelector('.add-task-card');
            card.classList.replace("add-task-card", `add-task-card${index}`);
            letCurrentCard = document.querySelector(`.add-task-card${index}`);
            letCurrentCard.querySelector('.add-task-card-headline').innerHTML = element.Title;
            letCurrentCard.querySelector('.add-task-card-description').innerHTML = element.Description;
            
            let personsHTML = "";
            element.persons.forEach(person => {
                personsHTML += /*html*/`
                    <div>${person}</div>  
                `;
            });
            letCurrentCard.querySelector('.add-task-card-assigned-to').innerHTML = personsHTML;
            //cardTop.innerHTML += html; 

            index++;
        }
        
    });
}




