let allContacts = [];
let globalIndexVariable;  // Variable, um global auf den aktuellen Index zugreigen zu können. Sie wird in der Funktion "loadDetail()" aktualisiert
let colors = ['#FF7A00', '#FF5EB3', '#6E52FF', '#9327FF', '#00BEE8', '#1FD7C1', '#FF745E', '#FFA35E', '#FC71FF', '#FFC701', '#0038FF', '#C3FF2B', '#FFE62B', '#FF4646', '#FFBB2B'];
let currentLetter = null;
let currentContact;
let editContactDetails = false;

/**
 * load the contacts
 * 
 */
function loadContactPage(){
    let contactsDiv = document.getElementById('contactBlock');
    contactsDiv.innerHTML = ``;
        for (let i = 0; i < allContacts.length; i++) {
        const element = allContacts[i];
        const name = element['name'];
        const mail = element['email'];
        const inital = getInitials(name); 
        const firstLetter = name.charAt(0).toUpperCase();
        const color = element['bgcolor'];
        if (firstLetter !== currentLetter) {
        createLetter(contactsDiv, firstLetter)
        };
        crateCard(contactsDiv, i, color, inital, name, mail);
    }
    if (window.innerWidth < 690) {
        addStopMail();
    }

}


/**
 * add Stop Mail in the mobile view
 */
function addStopMail(){
    document.querySelectorAll('a.contact-mail').forEach(function(link) {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Verhindert das Standardverhalten des Links
        });
    });
}


/**
 * Create the first letter for the letter group
 * 
 * @param {divs} contactsDiv - div for all contacts
 * @param {string} firstLetter - first letter of the name 
 */
function createLetter(contactsDiv, firstLetter) {
    let gourpDiv = document.createElement('div');
    gourpDiv.classList.add('sign');
    gourpDiv.innerHTML = '<span class="s20">'+firstLetter+'</span>';
    contactsDiv.appendChild(gourpDiv);
    currentLetter = firstLetter;
}


/**
 * Creat an user card
 * 
 * @param {divs} contactsDiv - div for all contacts
 * @param {number} i - index
 * @param {string} color - color for the contacts
 * @param {string} inital - first letter from first an last name
 * @param {string} name - name of the user
 * @param {string} mail - mail adress of the user
 */


function crateCard(contactsDiv, i, color, inital, name, mail){
        let truncatedEmail
        if (mail.length > 20) {
            truncatedEmail = mail.substring(0,20)+'...';
        }else{
            truncatedEmail = mail;
        }
        createCardHTML(contactsDiv,i, color, inital, name, mail, truncatedEmail);

}


/**
 * show detail informations of the active contzacte
 * 
 * @param {number} index - index number of the contact
 */
function loadDetail(index){
    if (window.innerWidth < 1070) {
        document.getElementById('contactsRight').style.display = "flex";
        document.body.style.overflow = ('hidden');
    }
    resetHighlight();
    let element = allContacts[index];
    let icon = document.getElementById('icon');
    let name = document.getElementById('name');
    let email = document.getElementById('email');
    let phone = document.getElementById('phone');
    let contactHighlight = document.getElementById('contact'+index);
    icon.innerHTML = getInitials(element['name']);
    icon.style.backgroundColor = element['bgcolor'];
    name.innerHTML = element['name'];
    email.innerHTML = element['email'];
    email.href = element['email'];
    phone.innerHTML = element['phone'];
    phone.href = element['phone'];
    contactHighlight.style.backgroundColor = '#2A3647';
    contactHighlight.style.color = '#FFFFFF';
    currentContact = index;
}


/**
 * reset highlight of the last contact
 */
function resetHighlight(){
    for (let i = 0; i < allContacts.length; i++) {
        const element = allContacts[i];
        let divs = document.getElementById('contact'+i);
        divs.style.backgroundColor = 'transparent';
        divs.style.color = '#000000';
    }
}


/**
 * get the letters of the first and lastname of the new user
 * 
 * @param {string} name - first an last name
 * @returns 
 */
function getInitials(name) {
    let parts = name.split(" ");
    let initials = "";
    parts.forEach((part) => {
        initials += part.charAt(0).toUpperCase();
    });
    return initials;
}


/**
 * add and save a new contact
 */
async function addContact(){
    submitContact.disabled = true;
    let cName = document.getElementById('cName');
    let cEmail = document.getElementById('cEmail');
    let cPhone = document.getElementById('cPhone');
    let bgcolor = getRandomColor();
    if (editContactDetails === true) {
        allContacts[currentContact].name = cName.value;
        allContacts[currentContact].email = cEmail.value;
        allContacts[currentContact].phone = cPhone.value;
    } else {
    allContacts.push({
        name: cName.value,
        email: cEmail.value,
        phone: cPhone.value,
        bgcolor: bgcolor
    })}
    await setItem('contact', JSON.stringify(allContacts));
    editContactDetails = false;
    document.getElementById('formContact').reset();
    document.getElementById('add-contact-form').classList.add('display-none');
    initContact();
    location.reload();
}


/**
 * get an random color for the new contact
 * 
 * @returns 
 */
function getRandomColor(){
    let randomIndex = Math.floor(Math.random()*colors.length);
    return colors[randomIndex];
}


/**
 * show the add contact form
 */
function addContactForm(){
    document.getElementById('popUp').classList.remove('display-none');
    document.getElementById('add-contact-form').classList.remove('display-none');
    document.getElementById('txtImg').src='assets/img/add-contact-site.svg';
    document.getElementById('newContactImg').classList.remove('display-none');
    document.getElementById('iconEdit').classList.add('display-none');
    if (window.innerWidth < 1070) {
        document.getElementById('txtImg').src = 'assets/img/add-contact-site-resp.svg';
    }
    
}


/**
 * show the edit contact form
 */
function editContactForm(){
    document.getElementById('popUp').classList.remove('display-none');
    document.getElementById('add-contact-form').classList.remove('display-none');
    document.getElementById('submitContact').style.backgroundImage = "url('assets/img/contact-save.svg')";
    document.getElementById('submitContact').style.width = "120px";
    document.getElementById('txtImg').src='assets/img/edit-contact-text.svg';
    let cName = document.getElementById('cName');
    let cEmail = document.getElementById('cEmail');
    let cPhone = document.getElementById('cPhone');
    cName.value = document.getElementById('name').innerText;
    cEmail.value = document.getElementById('email').innerText;
    cPhone.value = document.getElementById('phone').innerText;
    let icon = document.getElementById('iconEdit');
    icon.classList.remove('display-none');
    icon.innerHTML = document.getElementById('icon').innerText;
    icon.style.backgroundColor = document.getElementById('icon').style.backgroundColor;
}


/**
 * show different form with the same function
 * 
 * @param {string} index - edit or add form
 */
function openForm(index){
    if (index === "add") {
        addContactForm();
    }else if (index === "edit") {
        editContactDetails = true;
        editContactForm();
    }
}


/**
 * delete contact and save the changes in the backend
 */
async function deleteContact(){
    allContacts.splice(currentContact,1);
    await setItem('contact', JSON.stringify(allContacts));
    document.getElementById('formContact').reset();
    initContact();
    location.reload();
}


/**
 * close form add or edit
 */
function closeForm(){
    document.getElementById('formContact').reset();
    document.getElementById('newContactImg').classList.add('display-none');
    document.getElementById('add-contact-form').classList.add('display-none');
    document.getElementById('popUp').classList.add('display-none');
}


/**
 * close form Detail in the mobile view
 */
function closeFormDetail(){
    document.getElementById('contactsRight').style.display = "none";
    document.getElementById('popUp').classList.add('display-none');
}
