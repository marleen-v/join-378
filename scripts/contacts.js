const BASE_URL =
  "https://join-378-default-rtdb.europe-west1.firebasedatabase.app/";

const contactListRef = document.getElementById("contact-container");

let contactList = [];
let currentContact = [];

let contactColors = ["orange", "violet", "purple", "pink", "yellow", "green", "dark_purple", "red"];

function initContacts () {
  loadContactData();
  renderContacts();
}

  

function addNewContact() {
  const dialog = document.querySelector("dialog");
  dialog.showModal();
 
}

/**
 * This function loads the contacts from the database
 *
 * @returns {Array} - returns all contact-information
 */
async function loadContactData() {
  try {
    const response = await fetch(BASE_URL + "/contacts" + ".json");
    const data = await response.json();
    return data
  } catch (error) {
    console.error("Error loading Pokémon data:", error);
  }
}

/**
 *
 * This function renders the contacts on the page
 */
  async function renderContacts() {
    contactList = await loadContactData();
  contactListRef.innerHTML = "";
  sortContactsByFirstName();

  for (let index = 0; index < contactList.length; index++) {
    addContactColor(index); 
   
    const contact = contactList[index];
    addNewContactSection(index);
    contactListRef.innerHTML += getContactHTML(contact, index);
  }
}

/**
 * This function adds a color to each contact
 * 
 * @param {Number} index 
 */
function addContactColor(index){
    let contactIndex = index % contactColors.length; // because there can be more contacts than colors
    contactList[index].color = contactColors[contactIndex];
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
 * This function returns the html-template of a new Letter-Section
 * 
 * @param {String} firstLetter 
 * @returns 
 */
function getNewSectionHTML(firstLetter) {
  return `
  <div class="letter">${firstLetter}</div>
  `;
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
  
  const singleContactRef = document.getElementById("single-contact");
  currentContact = contactList[index];
  singleContactRef.innerHTML = "";
  singleContactRef.innerHTML = getContactInfoTemplate();
  toggleActiveBtnColor (index);
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

/**
 * This function returns the html for the rendering of each contact
 *
 * @param {Array} contact - this is a single contact info
 * @returns
 */
function getContactHTML(contact, index) {
  return `
    <button class="single-contact-btn flex align-items-center" onclick="showContactInfo(${index})">
            <span class="circle ${contact.color} flex justify-content-center align-items-center">
              <span>${contact.initials}</span>
            </span>
            <span class="name-email flex flex-column">
              <span class="contact-name">${contact.firstName} ${contact.lastName}</span>
              <span class="contact-email">${contact.email}</span>
            </span>
          </button>
    `;
}

/**
 * This function returns the html-template for the contact-info of a clicked contact 
 * 
 * @returns 
 */
function getContactInfoTemplate() {
  return `
   <div class="contact-info">
              <div class="single-contact-large flex align-items-center">
                <div
                  class="circle ${currentContact.color} circle-large flex justify-content-center align-items-center"
                >
                  <span>${currentContact.initials}</span>
                </div>
                <div class="name-email flex flex-column">
                  <div class="contact-name-large">${currentContact.firstName} ${currentContact.lastName}</div>
                  <div class="icon-container flex">
                    <button class="contact-icon-btn flex align-items-center">
                      <img src="../assets/img/edit.svg" alt="" />
                      <span>Edit</span>
                    </button>
                    <button class="contact-icon-btn flex align-items-center">
                      <img src="../assets/img/delete.svg" alt="" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div class="contact-info-text flex align-items-center">
              Contact Information
            </div>
            <div
              class="email-phone-container flex flex-column"
              style="gap: 22px"
            >
              <div class="email flex flex-column" style="gap: 15px">
                <div style="font-weight: 700">Email</div>
                <div class="contact-email">${currentContact.email}</div>
              </div>
              <div class="phone flex flex-column" style="gap: 15px">
                <div style="font-weight: 700">Phone</div>
                <div>+23534767487</div>
              </div>
            </div>
            `;
}
