let emailInputRef = document.getElementById("emailInput");
let passwordInputRef = document.getElementById("passwordInput");
let chkboxRef = document.getElementById("login_checkbox");


/**
 * Initializes the variables and shows popup after logout
 */
async function initLogin(){
  dataFromFirebase = await loadData(USERS_DIR);
  activeUser = await loadActiveUser(ACTIVE_DIR);
  if (document.referrer.includes("summary.html")){
    logoutPopup();
  }
  loadCheckboxStatus();
}



/**
 * Loads active user
 * @param {string} path to activeUser directory
 */
export async function loadActiveUser(path=""){
  let res = await fetch(FIREBASE_URL + path + ".json");
  let resToJson = await res.json();
  activeUser = resToJson;
}


/**
 * Loads user data
 */
function showData(){
  loadData(USERS_DIR);
}


/**
 * Shows error message after invalid input
 */
function showErrorMessage(){
  let errorRef = document.getElementById('error_message');
  errorRef.innerHTML = 'Passwords do not match!';
  setTimeout(function(){
    errorRef.innerHTML = '';
  }, 3000);
}


/**
 * Checks if the password is valid and stores active user
 */
function checkUserPassword(){
  let unknownUser = true;
  for (let i = 0; i < dataFromFirebase.length; i++) {
    if((emailInputRef.value === dataFromFirebase[i].email) && (passwordInputRef.value === dataFromFirebase[i].password)){
      unknownUser = false;
      activeUser = [
        {
          "firstName": dataFromFirebase[i].firstName,
          "lastName": dataFromFirebase[i].lastName,
          "initials": dataFromFirebase[i].initials
        }];
      putData(ACTIVE_DIR, activeUser);
      saveActiveUserToSessionStorage(emailInputRef.value);
      rememberMeCheck();
      window.location.href = './summary.html';
    }
  }
  if(unknownUser){
    showErrorMessage();
  }
  emailInputRef.value = '';
  passwordInputRef.value = '';
}


/**
 * Forwards to summary as a guest user and sets active user
 */
function guestLogin(){
  activeUser = [
  {
    "firstName": "Guest",
    "lastName": "",
    "initials": "GG"
  }];
  saveActiveUserToSessionStorage('Guest');
  putData(ACTIVE_DIR, activeUser);
  window.location.href = "./summary.html";
}


/**
 * Toggles the password icon in order to show password in cleartext
 */
function togglePasswordIcon(){
  document.getElementById("hidepwd").classList.toggle("dnone");
  document.getElementById("showpwd").classList.toggle("dnone");
  let pwdInputRef = document.getElementById("passwordInput");
  if(document.getElementById("showpwd").classList.contains("dnone")){
    pwdInputRef.type = "password";
  } else {
    pwdInputRef.type = "text";
  }
}


/**
 * Animates the logo
 */
document.addEventListener("DOMContentLoaded", () => {
  let logoContainerRef = document.querySelector(".logo");
  let logoRef = document.querySelector(".img-logo");
  setTimeout(() => {
    logoRef.classList.add("logo-small");
    logoContainerRef.classList.add("ctn-transparent");
  }, 1000);
  setTimeout(() => {
    logoContainerRef.style.pointerEvents = "none";
    logoRef.style.zIndex = "101";
  }, 1500);
});


/**
 * Show popup after logging out
 */
function logoutPopup(){
  let popupRef = document.getElementById("logout_popup");
  setTimeout(() => {
    popupRef.style.visibility = "visible";
  }, 1500);
  setTimeout(function(){
    popupRef.style.visibility = "hidden";
  }, 3500);
  resetActiveUser();
}


/**
 * Resets the active user to empty string
 */
function resetActiveUser(){
  activeUser = [
    {
      "firstName": "",
      "lastName": "",
      "initials": ""
    }];
  putData(ACTIVE_DIR, activeUser);
}


/**
 * 
 */
function loadCheckboxStatus(){
  if (localStorage.checkbox && localStorage.checkbox !== "") {
    chkboxRef.setAttribute("checked", "checked");
    emailInputRef.value = localStorage.username;
  } else {
    chkboxRef.removeAttribute("checked");
    emailInputRef.value = "";
  }
}


function rememberMeCheck(){
  if (chkboxRef.checked && emailInputRef.value !== "") {
    localStorage.username = emailInputRef.value;
    localStorage.checkbox = chkboxRef.value;
  } else {
    localStorage.username = "";
    localStorage.checkbox = "";
  }
}


function saveActiveUserToSessionStorage(value){
  sessionStorage.username = value;
}


window.initLogin = initLogin;
window.guestLogin = guestLogin;
window.togglePasswordIcon = togglePasswordIcon;
window.showData = showData;
window.checkUserPassword = checkUserPassword;
window.saveActiveUserToSessionStorage = saveActiveUserToSessionStorage;