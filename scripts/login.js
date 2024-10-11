const FIREBASE_URL = 'https://join-378-default-rtdb.europe-west1.firebasedatabase.app/';
const USERS_DIR = '/users';
const TASKS_DIR = '/tasks';
const CONTACTS_DIR = '/contacts';
let dataFromFirebase = [];

let emailInputRef = document.getElementById("emailInput");
let passwordInputRef = document.getElementById("passwordInput");


function init(){
  loadData(USERS_DIR);
}


async function loadData(path=""){
  let res = await fetch(FIREBASE_URL + path + ".json");
  let resToJson = await res.json();
  dataFromFirebase = resToJson;
}


async function putData(path="", data={}){
  let res = await fetch(FIREBASE_URL + path + ".json",
  {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data)
  });
  let resToJson = await res.json();
}


function addUser(){
  dataFromFirebase.push({
    "email": emailInputRef.value,
    "firstName": "Michael",
    "lastName": "Bulbasaur",
    "password": passwordInputRef.value
  });
  console.log(dataFromFirebase);
  putData(USERS_DIR, dataFromFirebase);
}


function showData(){
  loadData(USERS_DIR);
}


function returnFalse(){
  return false;
}


function checkUserPassword(){
  let unknownUser = true;
  for (let i = 0; i < dataFromFirebase.length; i++) {
    if((emailInputRef.value === dataFromFirebase[i].email) && (passwordInputRef.value === dataFromFirebase[i].password)){
      // console.log("Willkommen " + dataFromFirebase[i].firstName);
      unknownUser = false;
      alert("Hallo " + dataFromFirebase[i].firstName + " " + dataFromFirebase[i].lastName);
      window.location.href = '../index.html?msg=Du hast dich erfolgreich angemeldet!';
    }
  }

  if(unknownUser){
    // console.log("Benutzer nicht bekannt.");
    alert("Benutzer nicht bekannt.")
  }

  emailInputRef.value = '';
  passwordInputRef.value = '';
}


function guestLogin(){
  window.location.href = '../index.html?msg=Du hast dich erfolgreich angemeldet!';
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