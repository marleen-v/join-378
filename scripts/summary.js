


function initSummary(){
  loadData(TASKS_DIR);
}


async function loadData(path=""){
  let res = await fetch(FIREBASE_URL + path + ".json");
  let resToJson = await res.json();
  tasksFromFirebase = resToJson;
  displayHTML();
}


function displayHTML(){
  showMainTemplate();
  //showGreetingDependingOnDaytime();
  loadActiveUser(ACTIVE_DIR);
}


function showMainTemplate(){
  document.getElementById("main_summary").innerHTML = getTemplateMainSummary();
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
    if(tasksFromFirebase[i].Column === 'To Do'){
      counter++;
    }
  }  
  return counter;  
}


function getNumberDoneTasks(){
  let counter = 0;  
  for(let i = 0; i < tasksFromFirebase.length; i++){
    if(tasksFromFirebase[i].Column === 'Done'){
      counter++;
    }
  }
  return counter;  
}


function getNumberTasksInProgress(){
  let counter = 0;  
  for(let i = 0; i < tasksFromFirebase.length; i++){
    if(tasksFromFirebase[i].Column === 'In Progress'){
      counter++;
    }
  }
  return counter;  
}


function getNumberTasksAwaitingFeedback(){
  let counter = 0;  
  for(let i = 0; i < tasksFromFirebase.length; i++){
    if(tasksFromFirebase[i].Column === 'Await Feedback'){
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


async function loadActiveUser(path=""){
  let res = await fetch(FIREBASE_URL + path + ".json");
  activeUser = await res.json();
  currentUserFirstName = activeUser[0].firstName;
  currentUserLastName = activeUser[0].lastName;
  showGreetingDependingOnDaytime();
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

