/**
 * Initializes the page by loading and displaying all tasks
 */
async function initSummary(){
  tasksFromFirebase = await loadData(TASKS_DIR);
  displayHTML();
  getLogo();
  // loadTasksData(TASKS_DIR);
}


/**
 * Loads the tasks from Firebase
 * @param {*} path - Path to the directory containing the tasks in Firebase
async function loadTasksData(path=""){
  let res = await fetch(FIREBASE_URL + path + ".json");
  let resToJson = await res.json();
  tasksFromFirebase = resToJson;
  displayHTML();
}
*/


/**
 * Loads the template for main and sets the User Logo
 */
function displayHTML(){
  showMainTemplate();
  loadActiveUser(ACTIVE_DIR);
  //setUserLogo();
  //activeUser = await loadData(ACTIVE_DIR);
  //document.getElementById("userlogo").innerHTML = activeUser[0].initials;
}


/**
 * Loads Active User from Firebase
 * @param {*} path contains path to the active user in Firebase
 * @returns JSON from Firebase
async function loadDataActive(path=""){
  let res = await fetch(FIREBASE_URL + path + ".json");
  let resToJson = await res.json();
  return resToJson;
}
*/


/**
 * Sets the User Logo in the Header
async function setUserLogo(){
  activeUser = await loadDataActive(ACTIVE_DIR);
  document.getElementById("userlogo").innerHTML = activeUser[0].initials;
}
*/


/**
 * Loads the Template for Main
 */
function showMainTemplate(){
  document.getElementById("main_summary").innerHTML = getTemplateMainSummary();
}


/**
 * Gets the number of urgent tasks
 * @returns the number of urgent tasks
 */
function getNumberUrgentTasks(){
  let counter = 0;  
  for(let i = 0; i < tasksFromFirebase.length; i++){
    if(tasksFromFirebase[i].Priority === 'Urgent'){
      counter++;
    }
  }  
  return counter;  
}


/**
 * Gets the number of to-do tasks
 * @returns the number of to-do tasks
 */
function getNumberToDoTasks(){
  let counter = 0;  
  for(let i = 0; i < tasksFromFirebase.length; i++){
    if(tasksFromFirebase[i].Column === 'To Do'){
      counter++;
    }
  }  
  return counter;  
}


/**
 * Gets the number of done tasks
 * @returns the number of done tasks
 */
function getNumberDoneTasks(){
  let counter = 0;  
  for(let i = 0; i < tasksFromFirebase.length; i++){
    if(tasksFromFirebase[i].Column === 'Done'){
      counter++;
    }
  }
  return counter;  
}


/**
 * Gets the number of in-progress tasks
 * @returns the number of in-progress tasks
 */
function getNumberTasksInProgress(){
  let counter = 0;  
  for(let i = 0; i < tasksFromFirebase.length; i++){
    if(tasksFromFirebase[i].Column === 'In Progress'){
      counter++;
    }
  }
  return counter;  
}


/**
 * Gets the number of awaiting tasks
 * @returns the number of awaiting tasks
 */
function getNumberTasksAwaitingFeedback(){
  let counter = 0;  
  for(let i = 0; i < tasksFromFirebase.length; i++){
    if(tasksFromFirebase[i].Column === 'Await Feedback'){
      counter++;
    }
  }
  return counter;  
}


/**
 * Gets the number of tasks
 * @returns the number tasks
 */
function getTasksInBoard(){
  return tasksFromFirebase.length;
}


/**
 * Determines the nearest date for the deadline
 * @returns the nearest date by sorting the array
 */
function getNearestDate(){
  let dateArr = [];
  for (let i = 0; i < tasksFromFirebase.length; i++) {
    dateArr.push(tasksFromFirebase[i].Date);
  }
  dateArr.sort();
  return dateArr[0];
}


/**
 * Determines latest year and returns it
 * @returns latest latest year
 */
function getDeadlineYear(){
  return getNearestDate().split('-')[0];
}


/**
 * Determines latest month and returns it
 * @returns latest latest month
 */
function getDeadlineMonth(){
  const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return month[getNearestDate().split('-')[1] - 1];
}



/**
 * Determines latest day and returns it
 * @returns latest latest day
 */
function getDeadlineDay(){
  return getNearestDate().split('-')[2];
}


/**
 * Determines the active user and shows the greeting
 * @param {*} path to "directory" in firebase
 */
async function loadActiveUser(path=""){
  let res = await fetch(FIREBASE_URL + path + ".json");
  activeUser = await res.json();
  currentUserFirstName = activeUser[0].firstName;
  currentUserLastName = activeUser[0].lastName;
  showGreetingDependingOnDaytime();
}


/**
* Shows greeting depending on daytime
*/
function showGreetingDependingOnDaytime(){  
  const HOURS = new Date().getHours();
  let formula = "Hallöchen";
  if(HOURS >= 6 && HOURS < 12){formula = "Good morning";} else
  if(HOURS >= 12 && HOURS < 18){formula = "Good day";} else
  if(HOURS >= 18 && HOURS < 22){formula = "Good evening";} else
  {formula = "Good night";}
  document.getElementById("greeting_ctn").innerHTML = getGreetingTemplate(formula);
}

