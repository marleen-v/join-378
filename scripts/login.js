let emailInputRef = document.getElementById("emailInput");
let passwordInputRef = document.getElementById("passwordInput");


async function initLogin(){
  dataFromFirebase = await loadData(USERS_DIR);
  activeUser = await loadActiveUser(ACTIVE_DIR);
  if (document.referrer.includes("summary.html")){
    logoutPopup();
  }
}


async function loadActiveUser(path=""){
  let res = await fetch(FIREBASE_URL + path + ".json");
  let resToJson = await res.json();
  activeUser = resToJson;
}


function showData(){
  loadData(USERS_DIR);
}


function showErrorMessage(){
  let errorRef = document.getElementById('error_message');
  errorRef.innerHTML = 'Passwords do not match!';
  setTimeout(function(){
    errorRef.innerHTML = '';
  }, 3000);
}


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
      window.location.href = './summary.html';
    }
  }
  if(unknownUser){
    showErrorMessage();
  }
  emailInputRef.value = '';
  passwordInputRef.value = '';
}


function guestLogin(){
  activeUser = [
  {
    "firstName": "Guest",
    "lastName": "",
    "initials": "GG"
  }];
  putData(ACTIVE_DIR, activeUser);
  window.location.href = "./summary.html";
}


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


function resetActiveUser(){
  activeUser = [
    {
      "firstName": "",
      "lastName": "",
      "initials": ""
    }];
  putData(ACTIVE_DIR, activeUser);
}