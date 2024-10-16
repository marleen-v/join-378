import { loadHTML, processHTML } from "../scripts/parseHTMLtoString.js";

const FIREBASE_URL = 'https://join-378-default-rtdb.europe-west1.firebasedatabase.app/';
const USERS_DIR = '/users';
const CONTACTS_DIR = '/contacts';
const TASKS_DIR = '/tasks';
let currentDraggedElement;
let tasks = [];
let contacts = [];


async function loadData(path = "") {
    let res = await fetch(FIREBASE_URL + path + ".json");
    let resToJson = await res.json();
    return resToJson;
}


async function loadBoards() {
    //const htmlContent = await loadHTML('../html/boards-main.html');
    tasks = await loadData(TASKS_DIR);
    contacts = await loadData(CONTACTS_DIR);

    if (tasks) {
        //processHTML(htmlContent); // Den HTML-String an eine andere Funktion weiterleiten
        showData();
    }
}

function setBgColor(currentCard, element) {
    if (element.Category === "User Story") {
        currentCard.querySelector('.add-task-card-category').classList.add('bg-color-blue');
        currentCard.querySelector('.add-task-card-category').classList.remove('bg-color-turkey');
    }
    else {
        currentCard.querySelector('.add-task-card-category').classList.remove('bg-color-blue');
        currentCard.querySelector('.add-task-card-category').classList.add('bg-color-turkey');
    }

}

function getUserColor(firstName, lastName) {
    let color = "";
    contacts.forEach(element => {
        if (element.firstName == firstName && element.lastName == lastName) {
            color = element.color;
        }
    });
    return color;
}

function getUrgentSVG() {
    return /*html*/`
        <svg width="21" height="16" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_235867_297)">
                <path d="M19.6528 15.2547C19.4182 15.2551 19.1896 15.1803 19.0007 15.0412L10.7487 8.958L2.49663 15.0412C2.38078 15.1267 2.24919 15.1887 2.10939 15.2234C1.96959 15.2582 1.82431 15.2651 1.68184 15.2437C1.53937 15.2223 1.40251 15.1732 1.27906 15.099C1.15562 15.0247 1.04801 14.927 0.96238 14.8112C0.876751 14.6954 0.814779 14.5639 0.780002 14.4243C0.745226 14.2846 0.738325 14.1394 0.759696 13.997C0.802855 13.7095 0.958545 13.4509 1.19252 13.2781L10.0966 6.70761C10.2853 6.56802 10.5139 6.49268 10.7487 6.49268C10.9835 6.49268 11.212 6.56802 11.4007 6.70761L20.3048 13.2781C20.4908 13.415 20.6286 13.6071 20.6988 13.827C20.7689 14.0469 20.7678 14.2833 20.6955 14.5025C20.6232 14.7216 20.4834 14.9124 20.2962 15.0475C20.1089 15.1826 19.8837 15.2551 19.6528 15.2547Z" fill="#FF3D00"/>
                <path d="M19.6528 9.50568C19.4182 9.50609 19.1896 9.43124 19.0007 9.29214L10.7487 3.20898L2.49663 9.29214C2.26266 9.46495 1.96957 9.5378 1.68184 9.49468C1.39412 9.45155 1.13532 9.29597 0.962385 9.06218C0.789449 8.82838 0.716541 8.53551 0.7597 8.24799C0.802859 7.96048 0.95855 7.70187 1.19252 7.52906L10.0966 0.958588C10.2853 0.818997 10.5139 0.743652 10.7487 0.743652C10.9835 0.743652 11.212 0.818997 11.4007 0.958588L20.3048 7.52906C20.4908 7.66598 20.6286 7.85809 20.6988 8.07797C20.769 8.29785 20.7678 8.53426 20.6955 8.75344C20.6232 8.97262 20.4834 9.16338 20.2962 9.29847C20.1089 9.43356 19.8837 9.50608 19.6528 9.50568Z" fill="#FF3D00"/>
            </g>
            <defs>
                <clipPath id="clip0_235867_297">
                    <rect width="20" height="14.5098" fill="white" transform="translate(0.748535 0.745117)"/>
                </clipPath>
            </defs>
        </svg>
    `;
}

function getMediumSVG() {
    return /*html*/`
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_235867_4016)">
                <path d="M23.5685 19.1666L8.43151 19.1666C8.18446 19.1666 7.94752 19.0677 7.77283 18.8918C7.59814 18.7158 7.5 18.4772 7.5 18.2283C7.5 17.9795 7.59814 17.7408 7.77283 17.5649C7.94752 17.3889 8.18446 17.29 8.43151 17.29L23.5685 17.29C23.8155 17.29 24.0525 17.3889 24.2272 17.5649C24.4019 17.7408 24.5 17.9795 24.5 18.2283C24.5 18.4772 24.4019 18.7158 24.2272 18.8918C24.0525 19.0677 23.8155 19.1666 23.5685 19.1666Z" fill="#FFA800"/>
                <path d="M23.5685 14.7098L8.43151 14.7098C8.18446 14.7098 7.94752 14.6109 7.77283 14.435C7.59814 14.259 7.5 14.0204 7.5 13.7715C7.5 13.5227 7.59814 13.284 7.77283 13.1081C7.94752 12.9321 8.18446 12.8333 8.43151 12.8333L23.5685 12.8333C23.8155 12.8333 24.0525 12.9321 24.2272 13.1081C24.4019 13.284 24.5 13.5227 24.5 13.7715C24.5 14.0204 24.4019 14.259 24.2272 14.435C24.0525 14.6109 23.8155 14.7098 23.5685 14.7098Z" fill="#FFA800"/>
            </g>
            <defs>
                <clipPath id="clip0_235867_4016">
                <rect width="17" height="6.33333" fill="white" transform="translate(7.5 12.8333)"/>
                </clipPath>
            </defs>
        </svg>
    `;
}


function getLowSVG() {
    return /*html*/`
        <svg width="21" height="16" viewBox="0 0 21 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.2485 9.50589C10.0139 9.5063 9.7854 9.43145 9.59655 9.29238L0.693448 2.72264C0.57761 2.63708 0.47977 2.52957 0.405515 2.40623C0.33126 2.28289 0.282043 2.14614 0.260675 2.00379C0.217521 1.71631 0.290421 1.42347 0.463337 1.1897C0.636253 0.955928 0.895022 0.800371 1.18272 0.757248C1.47041 0.714126 1.76347 0.786972 1.99741 0.95976L10.2485 7.04224L18.4997 0.95976C18.6155 0.874204 18.7471 0.812285 18.8869 0.777538C19.0266 0.742791 19.1719 0.735896 19.3144 0.757248C19.4568 0.7786 19.5937 0.82778 19.7171 0.901981C19.8405 0.976181 19.9481 1.07395 20.0337 1.1897C20.1194 1.30545 20.1813 1.43692 20.2161 1.57661C20.2509 1.71629 20.2578 1.86145 20.2364 2.00379C20.215 2.14614 20.1658 2.28289 20.0916 2.40623C20.0173 2.52957 19.9195 2.63708 19.8036 2.72264L10.9005 9.29238C10.7117 9.43145 10.4831 9.5063 10.2485 9.50589Z" fill="#7AE229"/>
            <path d="M10.2485 15.2544C10.0139 15.2548 9.7854 15.18 9.59655 15.0409L0.693448 8.47117C0.459502 8.29839 0.30383 8.03981 0.260675 7.75233C0.217521 7.46485 0.290421 7.17201 0.463337 6.93824C0.636253 6.70446 0.895021 6.54891 1.18272 6.50578C1.47041 6.46266 1.76347 6.53551 1.99741 6.7083L10.2485 12.7908L18.4997 6.7083C18.7336 6.53551 19.0267 6.46266 19.3144 6.50578C19.602 6.54891 19.8608 6.70446 20.0337 6.93824C20.2066 7.17201 20.2795 7.46485 20.2364 7.75233C20.1932 8.03981 20.0376 8.29839 19.8036 8.47117L10.9005 15.0409C10.7117 15.18 10.4831 15.2548 10.2485 15.2544Z" fill="#7AE229"/>
        </svg>
    `;
}


function getPriority(element) {
    let svg = "";    
    switch (element.Priority) {
        case 'Urgent': svg = getUrgentSVG(); break;
        case 'Medium': svg = getMediumSVG(); break;
        case 'Low': svg = getLowSVG(); break;
    }
    return svg;
}


function setUserInitial(currentCard, element) {
    let personsHTML = "";
    element.Persons.forEach(person => {
        let splittedName = person.split(' ');
        let firstName = splittedName[0].charAt(0);
        let lastName = splittedName[1].charAt(0);
        let initial = firstName + lastName;
        let color = getUserColor(splittedName[0], splittedName[1]);        
        personsHTML += /*html*/`<span class="circle ${color} flex justify-content-center align-items-center"><span>${initial}</span></span> `;
    });
    currentCard.querySelector('.add-task-card-assigned-to').innerHTML = personsHTML;
}

function setCard(element, index, id, column) {
    let taskId = 'taskId' + id;
    let taskTemplate = getTaskCard(taskId, element.Column);
    let className = document.querySelector(`.board-main-${column}`);
    className.innerHTML += taskTemplate;
    let card = document.querySelector('.add-task-card');
    card.classList.replace("add-task-card", `add-task-card${index}`);
    let currentCard = document.querySelector(`.add-task-card${index}`);
    currentCard.querySelector('.add-task-card-category').innerHTML = element.Category;
    setBgColor(currentCard, element);
    currentCard.querySelector('.add-task-card-headline').innerHTML = element.Title;
    currentCard.querySelector('.add-task-card-description').innerHTML = element.Description.slice(0, 34) + '...';
    currentCard.setAttribute("ondragstart", `startDragging('${taskId}')`);
    currentCard.querySelector('.add-task-card-subtasks').innerHTML = (element.Subtasks == null) ? "0 Subtasks" : element.Subtasks + " Subtasks";
    setUserInitial(currentCard, element);
    currentCard.querySelector('.add-task-card-priority').innerHTML = getPriority(element);
}


function showData() {
    let index = 0;
    tasks.forEach((element, id) => {
        if (element.Column === "To Do") setCard(element, index, id, "to-do");
        if (element.Column === "In Progress") setCard(element, index, id, "in-progress");
        if (element.Column === "Await Feedback") setCard(element, index, id, "await-feedback");
        if (element.Column === "Done") setCard(element, index, id, "done");
        index++;
    });
}

function startDragging(id) {
    currentDraggedElement = id;
    console.log(id);

}

function getTaskCard(taskId, element) {
    return /*html*/`
        <section id="${taskId}" class="task-card add-task-card" draggable="true" ondragstart="startDragging(${element['id']})">
            <div class="add-task-card-top"><div class="add-task-card-category"></div></div>
            <div class="add-task-card-headline"></div>
            <div class="add-task-card-description"></div>
            <div class="add-task-card-subtasks"></div>
            <div class="add-task-card-bottom">
                <div class="add-task-card-assigned-to"></div>
                <div class="add-task-card-priority"></div>
            </div>
        </section>  
    `;
}

function moveTo(column) {
    let currentCard = document.getElementById(currentDraggedElement);
    currentCard.querySelector('.add-task-card-headline');

    tasks.forEach((element, id) => {
        const task = 'taskId' + id;
        if (task === currentDraggedElement) {
            element.Column = column;
        }

    });
    putData(TASKS_DIR, tasks);
    refresh();
}

function refresh() {
    document.querySelector('.board-main-to-do').innerHTML = "";
    document.querySelector('.board-main-in-progress').innerHTML = "";
    document.querySelector('.board-main-await-feedback').innerHTML = "";
    document.querySelector('.board-main-done').innerHTML = "";
    showData();
}

function allowDrop(ev) {
    ev.preventDefault();
}


async function putData(path = "", data = {}) {
    let res = await fetch(FIREBASE_URL + path + ".json",
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });
    return await res.json();
}


window.startDragging = startDragging;
window.allowDrop = allowDrop;
window.moveTo = moveTo;
window.loadBoards = loadBoards;
window.refresh = refresh;


