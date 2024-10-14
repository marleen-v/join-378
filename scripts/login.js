let emailInputRef = document.getElementById("emailInput");
let passwordInputRef = document.getElementById("passwordInput");


function init(){
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
      alert("Hallo " + dataFromFirebase[i].firstName + " " + dataFromFirebase[i].lastName);
      window.location.href = '../index.html?msg=Du hast dich erfolgreich angemeldet!';
    }
  }
  if(unknownUser){
    showErrorMessage();
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