const FIREBASE_URL = 'https://join-378-default-rtdb.europe-west1.firebasedatabase.app/';
const USERS_DIR = '/users';
const TASKS_DIR = '/tasks';
const CONTACTS_DIR = '/contacts';
let tasksFromFirebase =  [
  {
  "Title": "Projektinitialisierung",
  "Description": "Initialisierung des JavaScript-Projekts mit npm und Git-Repository.",
  "Date": "2024-10-10",
  "Priority": "Medium",
  "Category": "To Do",
  "persons": ["Julia Weber"]
},
{
  "Title": "Erstellung der Grundstruktur",
  "Description": "HTML, CSS und JavaScript-Dateien anlegen und grundlegende Struktur erstellen.",
  "Date": "2024-10-11",
  "Priority": "Urgent",
  "Category": "In Progress",
  "persons": ["Max Schneider"]
},
{
  "Title": "API-Integration",
  "Description": "Eine externe API in das Projekt integrieren, um Daten abzurufen.",
  "Date": "2024-10-13",
  "Priority": "Urgent",
  "Category": "To Do",
  "persons": ["Max Schneider", "Mia Koch"]
},
{
  "Title": "Datenbankanbindung",
  "Description": "Verbindung zur Datenbank herstellen und CRUD-Operationen implementieren.",
  "Date": "2024-10-15",
  "Priority": "Medium",
  "Category": "Await Feedback",
  "persons": ["Paul Kaiser", "Sophia Schmidt", "Mia Koch"]
},
{
  "Title": "UI-Design verbessern",
  "Description": "Das User Interface für bessere Usability und ansprechendes Design optimieren.",
  "Date": "2024-10-17",
  "Priority": "Low",
  "Category": "In Progress",
  "persons": ["Sophia Schmidt", "Mia Koch"]
},
{
  "Title": "Unit Tests schreiben",
  "Description": "Unit Tests für kritische Funktionen im JavaScript-Code erstellen.",
  "Date": "2024-10-19",
  "Priority": "Medium",
  "Category": "To Do",
  "persons": ["Emma Hofmann", "Sophia Schmidt", "Mia Koch"]
},
{
  "Title": "Bugfixing",
  "Description": "Bekannte Fehler im Projekt beheben, die durch Testing aufgedeckt wurden.",
  "Date": "2024-10-21",
  "Priority": "Urgent",
  "Category": "Await Feedback",
  "persons": ["Julia Weber"]
},
{
  "Title": "Dokumentation erstellen",
  "Description": "Erstellung der technischen Dokumentation und Benutzeranleitung.",
  "Date": "2024-10-23",
  "Priority": "Low",
  "Category": "To Do",
  "persons": ["Tim Bauer", "Anna Müller"]
},
{
  "Title": "Code Review",
  "Description": "Durchführen eines Code Reviews zur Verbesserung der Codequalität.",
  "Date": "2024-10-25",
  "Priority": "Medium",
  "Category": "In Progress",
  "persons": ["Lukas Fischer", "Max Schneider"]
},
{
  "Title": "Projektabschluss",
  "Description": "Projektabnahme und Übergabe an den Kunden.",
  "Date": "2024-10-30",
  "Priority": "Urgent",
  "Category": "Done",
  "persons": ["Lukas Fischer", "Sophia Schmidt"]
}
];


let currentUserFirstName = "Sofia";
let currentUserLastName = "Müller";


function initSummary(){
  // loadData(TASKS_DIR);
  document.getElementById("main_summary").innerHTML = getTemplateMainSummary();
  showGreetingDependingOnDaytime();
}

async function loadData(path=""){
  let res = await fetch(FIREBASE_URL + path + ".json");
  let resToJson = await res.json();
  tasksFromFirebase = resToJson;
}


function getNumberUrgentTasks(){
  let counter = 0;  
  for(let i = 0; i < tasksFromFirebase.length; i++){
    if(tasksFromFirebase[i].Priority === 'Urgent'){
      counter++;
    }
  }  
  return counter;  
}

function getNumberToDoTasks(){
  let counter = 0;  
  for(let i = 0; i < tasksFromFirebase.length; i++){
    if(tasksFromFirebase[i].Category === 'To Do'){
      counter++;
    }
  }  
  return counter;  
}


function getNumberDoneTasks(){
  let counter = 0;  
  for(let i = 0; i < tasksFromFirebase.length; i++){
    if(tasksFromFirebase[i].Category === 'Done'){
      counter++;
    }
  }
  return counter;  
}


function getNumberTasksInProgress(){
  let counter = 0;  
  for(let i = 0; i < tasksFromFirebase.length; i++){
    if(tasksFromFirebase[i].Category === 'In Progress'){
      counter++;
    }
  }
  return counter;  
}


function getNumberTasksAwaitingFeedback(){
  let counter = 0;  
  for(let i = 0; i < tasksFromFirebase.length; i++){
    if(tasksFromFirebase[i].Category === 'Await Feedback'){
      counter++;
    }
  }
  return counter;  
}


function getTasksInBoard(){
  return tasksFromFirebase.length;
}


function getNearestDate(){
  let dateArr = [];
  for (let i = 0; i < tasksFromFirebase.length; i++) {
    dateArr.push(tasksFromFirebase[i].Date);
  }
  dateArr.sort();
  return dateArr[0];
}


function getDeadlineYear(){
  return getNearestDate().split('-')[0];
}


function getDeadlineMonth(){
  const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return month[getNearestDate().split('-')[1] - 1];
}


function getDeadlineDay(){
  return getNearestDate().split('-')[2];
}


function getGreetingTemplate(greetFormula){
  return `
    <p class="greeting-formula">${greetFormula},</p>
    <p class="greeting-person">${currentUserFirstName}&nbsp;${currentUserLastName}</p>
  `;
}


function showGreetingDependingOnDaytime(){
  const HOURS = new Date().getHours();
  let formula = "Hallöchen";
  if(HOURS >= 6 && HOURS < 12){formula = "Good morning";} else
  if(HOURS >= 12 && HOURS < 18){formula = "Good day";} else
  if(HOURS >= 18 && HOURS < 22){formula = "Good evening";} else
  {formula = "Good night";}
  document.getElementById("greeting_ctn").innerHTML = getGreetingTemplate(formula);
}

