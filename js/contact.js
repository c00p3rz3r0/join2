let allContacts = [];
let globalIndexVariable;  // Variable, um global auf den aktuellen Index zugreigen zu können. Sie wird in der Funktion "loadDetail()" aktualisiert
let colors = ['#FF7A00', '#FF5EB3', '#6E52FF', '#9327FF', '#00BEE8', '#1FD7C1', '#FF745E', '#FFA35E', '#FC71FF', '#FFC701', '#0038FF', '#C3FF2B', '#FFE62B', '#FF4646', '#FFBB2B'];
let currentLetter = null;
let currentContact;
let editContactDetails = false;


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
    addStopMail();
}

function addStopMail(){
    document.querySelectorAll('a.contact-mail').forEach(function(link) {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Verhindert das Standardverhalten des Links
        });
    });
}

function createLetter(contactsDiv, firstLetter) {
    let gourpDiv = document.createElement('div');
    gourpDiv.classList.add('sign');
    gourpDiv.innerHTML = '<span class="s20">'+firstLetter+'</span>';
    contactsDiv.appendChild(gourpDiv);
    currentLetter = firstLetter;
}

function crateCard(contactsDiv, i, color, inital, name, mail){
        contactsDiv.innerHTML +=`
        <div class="contact-block" id="contact${i}" onclick="loadDetail(${i})">
        <div class="icon-board" style="background-color: ${color};">${inital}</div>
        <div class="">
        <span class="s20">${name}</span><br>
        <a class="s16 contact-mail" href="mailto:${mail}">${mail}</a>
        </div>
        </div>`
        ;
}

function loadDetail(index){
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

function resetHighlight(){
    for (let i = 0; i < allContacts.length; i++) {
        const element = allContacts[i];
        let divs = document.getElementById('contact'+i);
        divs.style.backgroundColor = 'transparent';
        divs.style.color = '#000000';
    }
}

function getInitials(name) {
    let parts = name.split(" ");
    let initials = "";
    parts.forEach((part) => {
        initials += part.charAt(0).toUpperCase();
    });
    return initials;
}

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

function getRandomColor(){
    let randomIndex = Math.floor(Math.random()*colors.length);
    return colors[randomIndex];
}

function addContactForm(){
    document.getElementById('add-contact-form').classList.remove('display-none');
    document.getElementById('txtImg').src='/assets/img/add-contact-site.svg';
    document.getElementById('newContactImg').classList.remove('display-none');
    if (window.innerWidth < 650) {
        document.getElementById('txtImg').src = 'assets/img/add-contact-site-resp.svg';
    }
    
}
    
function editContactForm(){
    document.getElementById('add-contact-form').classList.remove('display-none');
    document.getElementById('submitContact').style.backgroundImage = "url('assets/img/contact-save.svg')";
    document.getElementById('submitContact').style.width = "120px";
    document.getElementById('txtImg').src='/assets/img/edit-contact-text.svg';
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

function openForm(index){
    if (index === "add") {
        addContactForm();
    }else if (index === "edit") {
        editContactDetails = true;
        editContactForm();
    }
}

async function deleteContact(){
    allContacts.splice(currentContact,1);
    await setItem('contact', JSON.stringify(allContacts));
    document.getElementById('formContact').reset();
    initContact();
}

function closeForm(){
    document.getElementById('formContact').reset();
    document.getElementById('newContactImg').classList.add('display-none');
    document.getElementById('add-contact-form').classList.add('display-none');
}

