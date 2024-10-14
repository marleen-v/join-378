let nameInputRef = document.getElementById("nameInput");
let emailInputRef = document.getElementById("emailInput");
let passwordInputRef = document.getElementById("passwordInput");
let passwordInputConfirmRef = document.getElementById("passwordInputConfirm");


async function loadData(path=""){
  let res = await fetch(FIREBASE_URL + path + ".json");
  let resToJson = await res.json();
  dataFromFirebase = resToJson;
}


function initSignup(){
  loadData(USERS_DIR);
}


function signUpUser(){
  addUser();
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


function checkCorrectPassword(){
  if(passwordInputRef.value === passwordInputConfirmRef.value){
    return true;
  } else {
    return false;
  }
}

function resetValues(){
  emailInputRef.value = '';
  nameInputRef.value = '';
  passwordInputRef.value = '';
  passwordInputConfirmRef.value = '';
  document.getElementById("btn").disabled = "true";
  document.getElementById("checkbox").checked = false;
}


function showErrorMessage(){
  let errorRef = document.getElementById('error_message');
  errorRef.innerHTML = 'Passwords do not match!';
  setTimeout(function(){
    errorRef.innerHTML = '';
  }, 3000);
}


function signupSuccess(){
  openPopup();
  resetValues();
  putData(USERS_DIR, dataFromFirebase);
  setTimeout(function(){window.location.href = "./summary.html"}, 3000);
}


function addUser(){
  let firstName = nameInputRef.value.split(' ')[0];
  let lastName = nameInputRef.value.split(' ')[1];
  if(checkCorrectPassword()){
    dataFromFirebase.push({
      "email": emailInputRef.value,
      "firstName": firstName,
      "lastName": lastName,
      "password": passwordInputRef.value
    });
    signupSuccess();
  } else {
    showErrorMessage();
    resetValues();
  }
}


function enableButtonAfterChecked(){
  let checkRef = document.getElementById("checkbox");
  let buttonRef = document.getElementById("btn");
  if(checkRef.checked){
    buttonRef.removeAttribute("disabled");
  } else {
    buttonRef.disabled = "true";
  }
}


function togglePasswordIcon(pwdIdx){
  document.getElementById("hidepwd" + pwdIdx).classList.toggle("dnone");
  document.getElementById("showpwd" + pwdIdx).classList.toggle("dnone");
  let pwdInputRef;
  if(pwdIdx == 1){
    pwdInputRef = document.getElementById("passwordInput");
  } else {
    pwdInputRef = document.getElementById("passwordInputConfirm");
  }
  if(document.getElementById("showpwd" + pwdIdx).classList.contains("dnone")){
    pwdInputRef.type = "password";
  } else {
    pwdInputRef.type = "text";
  }
}


function openPopup(){
  let popup = document.getElementById("popupsuccess");
  popup.classList.add("open-popup");
}
