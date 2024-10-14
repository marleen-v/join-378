import { loadHTML, processHTML } from "../scripts/parseHTMLtoString.js";

const FIREBASE_URL = 'https://join-378-default-rtdb.europe-west1.firebasedatabase.app/';
const USERS_DIR = '/users';
const TASKS_DIR = '/tasks';


async function loadData(path=""){
    let res = await fetch(FIREBASE_URL + path + ".json");
    let resToJson = await res.json();
    return resToJson;
}


async function loadBoards() {
    const htmlContent = await loadHTML('../html/boards-main.html');

    if (htmlContent) {
        processHTML(htmlContent); // Den HTML-String an eine andere Funktion weiterleiten
        showData();
    }    
}


async function showData() {
    let json = await loadData(TASKS_DIR);
    let taskTemplate = await loadHTML('../html/add-task-card.html');
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
            let currentCard = document.querySelector(`.add-task-card${index}`);
            currentCard.querySelector('.add-task-card-headline').innerHTML = element.Title;
            currentCard.querySelector('.add-task-card-description').innerHTML = element.Description;
            
            let personsHTML = "";
            element.persons.forEach(person => {
                personsHTML += /*html*/`
                    <div>${person}</div>  
                `;
            });
            currentCard.querySelector('.add-task-card-assigned-to').innerHTML = personsHTML;
            //cardTop.innerHTML += html; 

            index++;
        }
        
    });
}

window.loadBoards = loadBoards;


