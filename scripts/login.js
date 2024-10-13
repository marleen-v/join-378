currentUserFirstName = "";
currentUserLastName = "";

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
      currentUserFirstName = dataFromFirebase[i].firstName;
      currentUserLastName = dataFromFirebase[i].lastName;
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
  currentUserFirstName = "Guest";
  currentUserLastName = "";
  window.location.href = './summary.html';
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


/*
function changePwdMaskChar(){
  const passwordFieldRef = document.getElementById('passwordInput');
  const hiddenPassword = document.getElementById('hiddenPassword');

  passwordFieldRef.addEventListener('input', (e) => {
  const currentValue = passwordFieldRef.value;
            
  // Holen wir uns den vorherigen Wert (da der Wert hier maskiert ist)
  let storedPassword = hiddenPassword.value;

  // Wenn der Benutzer ein Zeichen löscht
  if (currentValue.length < storedPassword.length) {
    storedPassword = storedPassword.slice(0, currentValue.length);
  } else {
  
  // Füge das neue Zeichen dem gespeicherten Passwort hinzu
  storedPassword += currentValue[currentValue.length - 1];
            }
  // Aktualisiere das versteckte Passwort-Feld
  hiddenPassword.value = storedPassword;

  // Zeige die Sternchen im sichtbaren Textfeld
  passwordFieldRef.value = '*'.repeat(storedPassword.length);
  });
}
*/