const contactListRef = document.getElementById("contact-container");
const contactBtns = document.querySelectorAll(".single-contact-btn");
const inputNameRef = document.getElementById("c-name");
const inputEmailRef = document.getElementById("c-email");
const inputPhoneRef = document.getElementById("c-phone");


let contactList = [];
let currentContact = [];

let contactColors = ["orange", "violet", "purple", "pink", "yellow", "green", "dark_purple", "red"];

let firstName;
let lastName;



async function initContacts () {
  contactList = await loadContactData();
 
  renderContacts();

}

/**
 * This function loads the contacts from the database
 *
 * @returns {Array} - returns all contact-information
 */
async function loadContactData() {
  try {
    const response = await fetch(FIREBASE_URL  + CONTACTS_DIR + ".json");
    const data = await response.json();
    return data
  } catch (error) {
    console.error("Error loading Pokémon data:", error);
  }
}

async function renderNewContact() {
  contactList = await loadContactData();
  renderContacts();
}

/**
 *
 * This function renders the contacts on the page
 */
  function renderContacts() {
  
  contactListRef.innerHTML = "";
  sortContactsByFirstName();
  
  for (let index = 0; index < contactList.length; index++) {
    const contact = contactList[index];
    addNewContactSection(index);
    contactListRef.innerHTML += getContactHTML(contact, index);
  }
}


/**
 * This function adds a new Letter-Section to the contactlist on the page
 * 
 * @param {*} index 
 */
function addNewContactSection(index) {
  if (index == 0) {
    let firstLetter = contactList[index].firstName.charAt(0).toUpperCase();
    contactListRef.innerHTML += getNewSectionHTML(firstLetter);
  } else {
    if (
      contactList[index].firstName.charAt(0).toUpperCase() !==
      contactList[index - 1].firstName.charAt(0).toUpperCase()
    ) {
      let firstLetter = contactList[index].firstName.charAt(0).toUpperCase();
      contactListRef.innerHTML += getNewSectionHTML(firstLetter);
    }
  }
}


/**
 * This function renders the information of a clicked contact
 * 
 * @param {*} index 
 */
function showContactInfo(index) {
  
  const singleContactRef = document.getElementById("single-contact");
  currentContact = contactList[index];
  singleContactRef.innerHTML = "";
  singleContactRef.innerHTML = getContactInfoTemplate(index);
  toggleActiveBtnColor (index);
}

function closeContactInfo() {
  const singleContactRef = document.getElementById("single-contact");
  singleContactRef.innerHTML = "";
}

function toggleActiveBtnColor (btnIndex){
  

  for (let index = 0; index <  contactBtns.length; index++) {
    const element =  contactBtns[index];
    if (element == contactBtns[btnIndex]) {
      element.classList.add("single-contact-btn-active");
    }else{
      element.classList.remove("single-contact-btn-active");
    }
  }
}

function openDialog() {
  const dialog = document.querySelector("dialog");
  dialog.showModal();

}

async function addNewContact() {
  let initials;
  
  firstName = inputNameRef.value.split(' ')[0];
  firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
  lastName = inputNameRef.value.split(' ')[1];
  initials = findInitials(initials); 

  contactList.push({
    "email": inputEmailRef.value,
    "firstName": firstName,
    "initials": initials,
    "lastName": lastName,
    "phone": inputPhoneRef.value
  });

  sortContactsByFirstName();
  addContactColor();

  await putData(CONTACTS_DIR, contactList);
  renderNewContact();
  // neuen Kontakt finden und anzeigen
 
/*  const emailRef = (element) => element.children[1].childNodes[3].innerHTML == inputEmailRef.value;
  const btnIndex = contactBtns.findIndex((emailRef));
  console.log(btnIndex);
  toggleActiveBtnColor(btnIndex);  */
 
  emptyInputFields();
 }

 /**
 * This function sorts the contacts alphabetically
 *
 * @param {Array} contacts - this is the json array with all contacts
 */
function sortContactsByFirstName() {
  contactList.sort((a, b) => {
    if (a.firstName < b.firstName) {
      return -1;
    }
    if (a.firstName > b.firstName) {
      return 1;
    }
    return 0;
  });
}


 function findInitials(initials){
  if(lastName !== undefined ){
    initials = firstName.charAt(0) + lastName.charAt(0);
  }else{
    initials = firstName.charAt(0);
    lastName = ""; // empty string, because if not, page shows undefined
  }
  return initials
}

/**
 * This function adds a color to each contact
 * 
 * @param {Number} index 
 */
function addContactColor(){
  for (let index = 0; index < contactList.length; index++) {
    let contactIndex = index % contactColors.length; // because there can be more contacts than colors
    contactList[index].color = contactColors[contactIndex];
}
}

function emptyInputFields(){
inputNameRef.value =""; 
inputEmailRef.value ="";  
inputPhoneRef.value =""; 
}


async function deleteContact(index) {
  contactList.splice(index, 1);
  renderContacts();
  closeContactInfo(); 
  await putData(CONTACTS_DIR, contactList); 
}

