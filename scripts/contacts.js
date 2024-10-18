const contactListRef = document.getElementById("contact-container");
const singleContactRef = document.getElementById("single-contact");

// Dialog
const dialog = document.querySelector("dialog");
const errorMessage = document.getElementById("error-message");

// Dialog Contactform
const dialogTitle = document.getElementById("dialog-title");
const dialogSubline = document.getElementById("dialogSubline");
const dialogColor = document.getElementById("dialogColor");
const dialogInitials = document.getElementById("dialogInitials");
const contactForm = document.getElementById("contactForm");

// Dialog Contactform Buttons
const cancelBtnTitle = document.getElementById("cancelBtnTitle");
const cancelBtn = document.getElementById("cancelBtn");
const submitBtnTitle = document.getElementById("submitBtnTitle");
const checkIcon = document.getElementById("checkIcon");

//Dialog Contactform Input Fields
const inputNameRef = document.getElementById("c-name");
const inputEmailRef = document.getElementById("c-email");
const inputPhoneRef = document.getElementById("c-phone");

let contactList = [];
let currentContact = [];

let emailExists;

let firstName;
let lastName;
let initials;

/**
 * This function loads the contactdata from firebase and renders the contact list
 */
async function initContacts() {
  contactList = await loadData(CONTACTS_DIR);
  renderContacts();
}

/**
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
  findAndMarkActiveUser()
}

/**
 * This function finds loged-in-User in contact-List and adds "(ich)" im Namen
 */
function findAndMarkActiveUser() {
  const singleContactRef = document.querySelectorAll(".contact-name");
  let activeUserIndex = contactList.findIndex((contact) => contact.email === "clara.peters@web.de");

  singleContactRef[activeUserIndex].innerHTML += "(ich)";
  console.log(activeUserIndex);
}
 

/**
 * This function renders the new contact-list
 */
async function renderNewContact() {
  contactList = await loadData(CONTACTS_DIR);
  renderContacts();
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
  currentContact = contactList[index];
  singleContactRef.innerHTML = "";
  singleContactRef.innerHTML = getContactInfoTemplate(index);
  toggleActiveBtnColor(index);
}

/**
 * This function closes an opend contact info
 */
function closeContactInfo() {
  singleContactRef.innerHTML = "";
}

/**
 * 
 * @param {Number} btnIndex 
 */
function toggleActiveBtnColor(btnIndex) {
  const contactBtns = document.querySelectorAll(".single-contact-btn");
  for (let index = 0; index < contactBtns.length; index++) {
    const element = contactBtns[index];
    if (element == contactBtns[btnIndex]) {
      element.classList.add("single-contact-btn-active");
    } else {
      element.classList.remove("single-contact-btn-active");
    }
  }
}

/**
 * This function opens the dialog
 */
function openContactDialog() {
  dialog.showModal();
}

/**
 * This function closes the dialog
 */
function closeContactDialog() {
  dialog.close();
  contactForm.reset();
  dialogColor.classList.remove(currentContact.color);
  errorMessage.classList.add("d_none");
}

/**
 * This function validates the form
 */
function checkForm() {

  emailExists = checkContactEmail();
  if (contactForm.checkValidity() && !emailExists) {
    submitBtn.classList.remove("inactiv-btn");
    checkIcon.classList.remove("inactive-color");
    errorMessage.classList.add("d_none");
  } else {
    submitBtn.classList.add("inactiv-btn");
    checkIcon.classList.add("inactive-color");
  
  }
}

inputNameRef.addEventListener("input", checkForm);
inputEmailRef.addEventListener("input", checkForm);


function checkContactEmail() {
  emailExists = contactList.some((contact) => contact.email === inputEmailRef.value);
  if(emailExists){ //if email exists check if this email is in currentContact, if it is return false
    if (currentContact != [] && currentContact.email === inputEmailRef.value) {
      errorMessage.classList.add("d_none");
      return !emailExists
    } else{
      errorMessage.classList.remove("d_none");
      return emailExists;
      
    }
  }
} 


/**
 * This function renders the dialog to add a contact
 *
 */
function renderAddContactDialog() {
  dialogTitle.innerHTML = "Add Contact";
  dialogSubline.innerHTML = "Tasks are better with a team!";
  dialogInitials.innerHTML =
    '<img src="../assets/icons/person.svg" alt="" class="circle-icon" />';
  cancelBtnTitle.innerHTML = "Cancel";
  submitBtnTitle.innerHTML = "Create Contact";
  /* dialogColor.classList.add("neutralColor"); */
  cancelBtn.onclick = function () {
    closeContactDialog();
  };
  contactForm.onsubmit = function () {
    if(!emailExists){
      addNewContact();
      errorMessage.classList.add("d_none");
    } else { return false;}
  };

  submitBtn.classList.add("inactiv-btn");
  checkIcon.classList.add("inactive-color");

  openContactDialog();
}

/**
 * This function renders the dialog to edit a chosen contact
 *
 * @param {Number} index
 */
function renderEditContactDialog(index) {
  dialogTitle.innerHTML = "Edit Contact";
  dialogSubline.innerHTML = "";
  cancelBtnTitle.innerHTML = "Delete";
  submitBtnTitle.innerHTML = "Save";
  dialogColor.classList.add(currentContact.color);
  dialogInitials.innerHTML = currentContact.initials;
  cancelBtn.onclick = function () {deleteContact(index); dialogColor.classList.remove(currentContact.color); errorMessage.classList.add("d_none"); };
  contactForm.onsubmit = function () {
    if(!emailExists){
    updateContactInfo(index);
    dialogColor.classList.remove(currentContact.color);
    errorMessage.classList.add("d_none");
  } else { return false;}
  };

  fillInputFields(index);

  submitBtn.classList.remove("inactiv-btn");
  checkIcon.classList.remove("inactive-color");

  openContactDialog();
}

/**
 * This function fills in
 *
 * @param {Number} index
 */
function fillInputFields(index) {
  inputNameRef.value =
    contactList[index].firstName + " " + contactList[index].lastName;
  inputEmailRef.value = contactList[index].email;
  inputPhoneRef.value = contactList[index].phone;
}

/**
 * This function adds a new contact to firebase
 *
 */
async function addNewContact() {
  firstName = inputNameRef.value.split(" ")[0];
  firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
  lastName = inputNameRef.value.split(" ")[1];
  initials = findInitials(initials);

  contactList.push({
    email: inputEmailRef.value,
    firstName: firstName,
    initials: initials,
    lastName: lastName,
    phone: inputPhoneRef.value,
  });

  sortContactsByFirstName();
  addContactColor();

  await putData(CONTACTS_DIR, contactList);
  renderNewContact();

  setTimeout(() => {
    btnIndex = contactList.findIndex(
      (contact) => contact.email === inputEmailRef.value
    );
    showContactInfo(btnIndex);

    closeContactDialog();
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

/**
 * This function returns the initials of the name of a contact
 *
 * @param {*} initials
 * @returns
 */
function findInitials(initials) {
  if (lastName !== undefined) {
    initials = firstName.charAt(0) + lastName.charAt(0);
  } else {
    initials = firstName.charAt(0);
    lastName = ""; // empty string, because if not, page shows undefined
  }
  return initials;
}

/**
 * This function adds a color to each contact
 *
 * @param {Number} index
 */
function addContactColor() {
  for (let index = 0; index < contactList.length; index++) {
    let contactIndex = index % contactColors.length; // because there can be more contacts than colors in "contactColors"
    contactList[index].color = contactColors[contactIndex];
  }
}

/**
 * This function deletes a contact
 *
 * @param {Number} index
 */
async function deleteContact(index) {
  contactList.splice(index, 1);
  renderContacts();
  closeContactInfo();
  closeContactDialog();
  await putData(CONTACTS_DIR, contactList);
}

/**
 * This function updates a contact info, after it was edited
 *
 * @param {Number} index
 */
async function updateContactInfo(index) {
  firstName = inputNameRef.value.split(" ")[0];
  firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
  lastName = inputNameRef.value.split(" ")[1];
  initials = findInitials(initials);

  contactList[index] = {
    email: inputEmailRef.value,
    firstName: firstName,
    initials: initials,
    lastName: lastName,
    phone: inputPhoneRef.value,
  };

  sortContactsByFirstName();
  addContactColor();
  await putData(CONTACTS_DIR, contactList);
  renderNewContact();

  setTimeout(() => {
    btnIndex = contactList.findIndex(
      (contact) => contact.email === inputEmailRef.value
    );
    showContactInfo(btnIndex);

    closeContactDialog();
  }, 200);
}

//to do:
// active User markieren ... (ich) --> Funktion jedes mal aufrufen, wenn Kontaktliste neu gerendert wird
// email schon einmal vorhanden? Dann kann nicht submitted werden
// springen zum neu angelegten Kontakt
// Animation



