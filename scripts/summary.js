const FIREBASE_URL = 'https://join-378-default-rtdb.europe-west1.firebasedatabase.app/';
const USERS_DIR = '/users';
const TASKS_DIR = '/tasks';
const CONTACTS_DIR = '/contacts';
let tasksFromFirebase = [];


let currentUserFirstName = "Sofia";
let currentUserLastName = "Müller";


function initSummary(){
  loadData(TASKS_DIR);
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
  console.log(counter);
  return counter;  
}


function getNumberDoneTasks(){
  let counter = 0;  
  for(let i = 0; i < tasksFromFirebase.length; i++){
    console.log(tasksFromFirebase[i].Category);
    if(tasksFromFirebase[i].Category === 'Done'){counter++;//console.log(counter);
      }
  }
  return counter;  
}

// document.getElementById("done_tasks").innerHTML = getNumberDoneTasks();


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




function getTemplateMainSummary(){
  return `
    <section class="summary-section">
        <div class="header-main">
          <h1>Join 360</h1>
          <span>Key Metrics at a Glance</span>
        </div>

        <div class="data-ctn">
          <div class="object-data">

            <div class="todo-done-ctn">
              <div class="todo bgwhite-colblack-br30 w264h168">
                <div class="circle69"><img src="../assets/icons/edit.png" alt=""></div>
                <div><p class="font64colblackw600">1</p><p class="color2A">To-Do</p></div>
              </div>
              <div class="done bgwhite-colblack-br30 w264h168">
                <div class="circle69"><img src="../assets/icons/Vector@2x.png" alt=""></div>
                <div><p class="font64colblackw600" id="done_tasks">${getNumberDoneTasks()}</p><p class="color2A">Done</p></div>
              </div>
            </div>

            <div class="urgent-ctn bgwhite-colblack-br30 w560h168">
              <div class="urgent-left-side">
                <div class="circle-urgent"><img src="../assets/icons/Prio alta.png" alt=""></div>
              
                <div class="urgent-data">
                  <p class="font64colblackw600" id="urgent_tasks">${getNumberUrgentTasks()}</p>
                  <p class="color2A">Urgent</p>
                </div>
              
              </div>
              <div class="date-ctn">
                <p class="font21w700">October 16, 2022</p>
                <p class="font16w400">Upcoming Deadline</p>
              </div>
            </div>

            <div class="tasks-ctn">
              <div class="board bgwhite-colblack-br30 w168h168"><p class="font64colblackw600">5</p><p class="color2A">Tasks in Board</p></div>
              <div class="progress bgwhite-colblack-br30 w168h168"><p class="font64colblackw600">2</p><p class="color2A">Tasks in Progress</p></div>
              <div class="feedback bgwhite-colblack-br30 w168h168"><p class="font64colblackw600">2</p><p class="color2A">Awaiting Feedback</p></div>
            </div>
            
          </div>

          <div id="greeting_ctn" class="greeting-ctn"></div>

        </div>


      </section>
  `;
}


document.getElementById("main_summary").innerHTML = getTemplateMainSummary();