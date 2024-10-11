const BASE_URL =
  "https://join-378-default-rtdb.europe-west1.firebasedatabase.app/";

async function loadContactData() {
  const response = await fetch(BASE_URL + "/contacts" + ".json");
  const data = await response.json();
  return data;
}

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

function addInitialsToContacts(contacts) {
  contacts.forEach((contact) => {
    let initials = contact.firstName.charAt(0) + contact.lastName.charAt(0);
    contact.initials = initials.toUpperCase();
  });
}

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
