const contactListRef = document.getElementById("contact-container");
const dialog = document.querySelector("dialog");

const inputNameRef = document.getElementById("c-name");
const inputEmailRef = document.getElementById("c-email");
const inputPhoneRef = document.getElementById("c-phone");

let contactList = [];
let currentContact = [];

let firstName;
let lastName;

let onsubmitFunction;
let dialogTitle;


async function initContacts () {
  contactList = await loadData(CONTACTS_DIR);
  renderContacts();
}

/**
 * 
 * This function renders the new contact-list
 */
async function renderNewContact() {
  contactList = await loadData(CONTACTS_DIR);
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
  toggleActiveBtnColor(index);
}

function closeContactInfo() {
  const singleContactRef = document.getElementById("single-contact");
  singleContactRef.innerHTML = "";
}

function toggleActiveBtnColor (btnIndex){
  const contactBtns = document.querySelectorAll(".single-contact-btn");
  for (let index = 0; index <  contactBtns.length; index++) {
    const element =  contactBtns[index];
    if (element == contactBtns[btnIndex]) {
      element.classList.add("single-contact-btn-active");
    }else{
      element.classList.remove("single-contact-btn-active");
    }
  }
}

function renderContactDialog(){
  dialog.innerHTML = "";
  dialog.innerHTML = contactDialogTemplateHtml();
  
}


function openContactDialog() {
  dialog.showModal();
}



function openAddContactDialog(){

  
  dialog.innerHTML = "";
  dialog.innerHTML = contactDialogTemplateHtml();
  
  openContactDialog();
}

async function addNewContact() {
  const singleContactBtnRef = document.querySelectorAll(".single-contact-btn");
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
 
  setTimeout(() => {
    btnIndex = contactList.findIndex(contact => contact.email === inputEmailRef.value);
    showContactInfo(btnIndex);
    console.log(singleContactBtnRef[btnIndex]);
    emptyInputFields();
  }, 200);

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
    let contactIndex = index % contactColors.length; // because there can be more contacts than colors in "contactColors"
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

/* function validateForm(){
  const submitBtnRef = document.getElementById("submit-btn");
  if (inputNameRef.value !="" && inputEmailRef.value !="" &&  inputPhoneRef.value !="" ) {
    submitBtnRef.classList.remove("inactive-btn");
    }
} */


function editContact(index) {
    renderContactDialog();
    const contactForm = document.getElementById("contact-form");
    const dialogTitelRef = document.getElementById("dialog-title");
    const nameInputField = document.getElementById("c-name");
    const emailInputField = document.getElementById("c-email");
    const phoneInputField = document.getElementById("c-phone");
   
    
    dialogTitelRef.innerHTML = `<h1>Edit contact</h1>
        <div class="horizontal-line"></div>`
   nameInputField.value = contactList[index].firstName + " " + contactList[index].lastName;
   emailInputField.value = contactList[index].email;
   phoneInputField.value = contactList[index].phone; 
    openContactDialog();
  }
 
 