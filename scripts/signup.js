const FIREBASE_URL = 'https://join-378-default-rtdb.europe-west1.firebasedatabase.app/';
const USERS_DIR = '/users';
const TASKS_DIR = '/tasks';
const CONTACTS_DIR = '/contacts';
let dataFromFirebase = [];

let nameInputRef = document.getElementById("nameInput");
let emailInputRef = document.getElementById("emailInput");
let passwordInputRef = document.getElementById("passwordInput");
let passwordInputConfirmRef = document.getElementById("passwordInputConfirm");


async function loadData(path=""){
  let res = await fetch(FIREBASE_URL + path + ".json");
  let resToJson = await res.json();
  dataFromFirebase = resToJson;
}


function signUpUser(){
  loadData(USERS_DIR);
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