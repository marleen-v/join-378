const contactListRef = document.getElementById("contact-container");
const singleContactRef = document.getElementById("single-contact");


let contactList = [];
let currentContact = [];

let firstName;
let lastName;
let initials;

/**
 * This function loads the contactdata from firebase and renders the contact list
 */
async function initContacts() {
  contactList = await loadData(CONTACTS_DIR);
  renderContactList();
}

/**
 * This function renders the contacts on the page
 */
function renderContactList() {
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
 * This function finds loged-in-User in contact-List and adds "(ich)" im Namen
 */
function findAndMarkActiveUser() {
  const singleContactRef = document.querySelectorAll(".contact-name");
  let activeUserIndex = contactList.findIndex((contact) => contact.email === "clara.peters@web.de");
  singleContactRef[activeUserIndex].innerHTML += "(ich)";
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
 * 
 * @param {Number} btnIndex 
 */
function toggleActiveBtnColor(btnIndex) {
  const contactBtns = document.querySelectorAll(".single-contact-btn");
  for (let index = 0; index < contactBtns.length; index++) {
    const element = contactBtns[index];
    if (element == contactBtns[btnIndex]) {
      element.classList.add("single-contact-btn-active");
      element.scrollIntoViewIfNeeded();
    } else {
      element.classList.remove("single-contact-btn-active");
    }
  }
}

/**
 * This function closes an opend contact info
 */
function closeContactInfo() {
  singleContactRef.innerHTML = "";
}

function assignContactData() {
  firstName = inputNameRef.value.split(" ")[0];
  firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
  lastName = inputNameRef.value.split(" ")[1];
  initials = findInitials();
}

/**
 * This function adds a new contact to firebase
 *
 */
async function addNewContact() {
 assignContactData();
  contactList.push({
    color: getRandomColor(),
    email: inputEmailRef.value,
    firstName: firstName,
    initials: initials,
    lastName: lastName,
    phone: inputPhoneRef.value,
  });
  sortContactsByFirstName();
  /* addContactColor(); */
  renderContactList();
  btnIndex = contactList.findIndex((contact) => contact.email === inputEmailRef.value);
  showContactInfo(btnIndex);
  closeContactDialog();
  await putData(CONTACTS_DIR, contactList);
}

/**
 * This function returns the initials of the name of a contact
 *
 * @param {*} initials
 * @returns
 */
function findInitials() {
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
  renderContactList();
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
  assignContactData();

  contactList[index] = {
    email: inputEmailRef.value,
    firstName: firstName,
    initials: initials,
    lastName: lastName,
    phone: inputPhoneRef.value,
  };

  sortContactsByFirstName();
 /*  addContactColor(); */
  await putData(CONTACTS_DIR, contactList);
  renderContactList();

  setTimeout(() => {
    btnIndex = contactList.findIndex(
      (contact) => contact.email === inputEmailRef.value
    );
    showContactInfo(btnIndex);

    closeContactDialog();
  }, 200);
}

//to do:
// active User markieren ... (ich) --> findet active User nicht
// email schon einmal vorhanden? Dann kann nicht submitted werden -> erledigt
// Animation
// Input-Felder trimmen




