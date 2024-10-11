const BASE_URL =
  "https://join-378-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * This function loads the contacts from the database
 * 
 * @returns {Array} - returns all contact-information
 */
  async function loadContactData() {
    try {
        const response = await fetch(BASE_URL + "/contacts" + ".json");
        const data = await response.json();
        return data;
    } catch (error) {
      console.error("Error loading Pokémon data:", error);
    }
  }

  /**
   *
   * renders the contacts on the page
   */
async function renderContacts() {
  const contentRef = document.getElementById("contact-container");
  contentRef.innerHTML = "";
  const contacts = await loadContactData();
  sortContactsByFirstName(contacts)

  for (let index = 0; index < contacts.length; index++) {
    const contact = contacts[index];
    addInitialsToContacts(contacts);
    contentRef.innerHTML += renderContactsHTML(contact);
  }
}

/**
 * This function is used to find the initials of all contacts and pushes them into the json array
 * 
 * @param {*} contacts - this is the json array with all Contacts
 */
function addInitialsToContacts(contacts) {
  contacts.forEach((contact) => {
    let initials = contact.firstName.charAt(0) + contact.lastName.charAt(0);
    contact.initials = initials.toUpperCase();
  });
}


/**
 * This function sorts the contacts alphabetically
 * 
 * @param {Array} contacts - this is the json array with all contacts
 */
function sortContactsByFirstName(contacts) {
  contacts.sort((a, b) => {
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
 * This function returns the html for the rendering of each contact
 * 
 * @param {Array} contact - this is a single contact info 
 * @returns 
 */
function renderContactsHTML(contact) {
  return `
    <div class="single-contact-container flex align-items-center">
            <div class="ellipse flex justify-content-center align-items-center"><span>${contact.initials}</span></div>
            <div class="name-email flex flex-column">
              <span class="contact-name">${contact.firstName} ${contact.lastName}</span>
              <span class="contact-email">${contact.email}</span>
            </div>
          </div>
    `;
}
