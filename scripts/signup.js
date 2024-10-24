let nameInputRef = document.getElementById("nameInput");
let emailInputRef = document.getElementById("emailInput");
let passwordInputRef = document.getElementById("passwordInput");
let passwordInputConfirmRef = document.getElementById("passwordInputConfirm");

let contactsUser = [];


/**
 * Fills the variables with data from firebase on init
 */
async function initSignup(){
  dataFromFirebase = await loadData(USERS_DIR);
  activeUser = await loadData(ACTIVE_DIR);
  contactsUser = await loadData(CONTACTS_DIR);
}


/**
 * Executes the signup process
 */
function signUpUser(){
  addUser();
}


/**
 * Puts data to firebase
 * @param {string} path directory in firebase
 * @param {object} data object-data
 */
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


/**
 * Checks if both passwords are identical
 * @returns boolean
 */
function checkCorrectPassword(){
  if(passwordInputRef.value === passwordInputConfirmRef.value){
    return true;
  } else {
    return false;
  }
}


/**
 * Returns number of spaces within a string
 * @param {string} str string that needs to be checked
 * @returns 
 */
function checkCountSpaces(str){
  let count = (str.split(" ").length - 1);
  return count;
}


/**
 * Resets all values to default
 */
function resetValues(){
  emailInputRef.value = '';
  nameInputRef.value = '';
  passwordInputRef.value = '';
  passwordInputConfirmRef.value = '';
  document.getElementById("btn").disabled = "true";
  document.getElementById("checkbox").checked = false;
}


/**
 * Display error message depending on input string
 * @param {string} str string that represents the error message
 */
function showErrorMessage(str){
  let errorRef = document.getElementById('error_message');
  let errorStr = 'Error';
  if(str === "wrongPassword"){errorStr = 'Passwords do not match!';} else
  if(str === "emailExists"){errorStr = 'Email already exists!';} else
  if(str === "nameFormatIncorrect"){errorStr = 'Please enter your first and last name separated by a blank!';}
  errorRef.innerHTML = errorStr;
  setTimeout(function(){
    errorRef.innerHTML = '';
  }, 3000);
}


/**
 * Shows successful signup and forwards to summary
 */
function signupSuccess(){
  openPopup();
  resetValues();
  putData(ACTIVE_DIR, activeUser);
  putData(USERS_DIR, dataFromFirebase);
  putData(CONTACTS_DIR, contactsUser);
  setTimeout(function(){window.location.href = "./summary.html"}, 2500);
}


/**
 * Checks if email already exists
 * @returns boolean
 */
function emailNotExists(){
  let emailCheck = true;
  for(let i = 0; i < contactsUser.length; i++){
    if(emailInputRef.value == contactsUser[i].email){
      console.log(contactsUser[i].email);
      emailCheck = false;
    }
  }
  return emailCheck;
}


/**
 * Adds user to firebase after checking everything
 */
function addUser(){
  let spaces = checkCountSpaces(nameInputRef.value);
  if((checkCorrectPassword()) && (emailNotExists()) && (spaces === 1)){
    let firstName = nameInputRef.value.split(' ')[0];
    let lastName = nameInputRef.value.split(' ')[1];
    saveActiveUserToSessionStorage(emailInputRef.value);
    pushEverythingNecessaryToFireBase(firstName, lastName);
    signupSuccess();
  } else {
    if(!checkCorrectPassword()){showErrorMessage('wrongPassword');} else
    if(!emailNotExists()){showErrorMessage('emailExists');} else
    if(spaces !== 1){showErrorMessage('nameFormatIncorrect');}
    resetValues();
  }
}


/**
 * Pushes all user data to firebase
 * @param {string} first first name of the user
 * @param {string} last last name of the user
 */
function pushEverythingNecessaryToFireBase(first, last){
  dataFromFirebase.push({
    "email": emailInputRef.value,
    "firstName": first,
    "lastName": last,
    "password": passwordInputRef.value
  });
  activeUser = [
    {
      "firstName": first,
      "lastName": last,
      "initials": first[0] + last[0],
      "email": emailInputRef.value
    }];
  contactsUser.push({
      "color": getRandomColor(),
      "email": emailInputRef.value,
      "firstName": first,
      "initials": first[0] + last[0],
      "lastName": last,
      "phone": ""
  });
}


/**
 * Enables or disables the signup button
 */
function enableButtonAfterChecked(){
  let checkRef = document.getElementById("checkbox");
  let buttonRef = document.getElementById("btn");
  if(checkRef.checked){
    buttonRef.removeAttribute("disabled");
  } else {
    buttonRef.disabled = "true";
  }
}


/**
 * Toggles the password icon
 * @param {number} pwdIdx password-index
 */
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


/**
 * Opens popup
 */
function openPopup(){
  let popup = document.getElementById("popupsuccess");
  popup.classList.add("open-popup");
}


/** Saves active user to session storage */
function saveActiveUserToSessionStorage(value){
  sessionStorage.username = value;
}