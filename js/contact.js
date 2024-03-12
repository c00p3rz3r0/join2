
let sortedNames = [];

function sortNames(){
    let sorteNames = allContacts.sort();
    sortedNames.push(sorteNames);
}



function loadContactPage(){
    let contactsDiv = document.getElementById('contactBlock');
    contactsDiv.innerHTML = ``;
    for (let i = 0; i < allContacts.length; i++) {
        const element = allContacts[i];
        const name = element['name'];
        const mail = element['email'];
        const inital = getInitials(element['name']); 
        const color = element['bgcolor'];
        contactsDiv.innerHTML +=`
        <div class="contact-block">
        <div class="icon-board" style="background-color: ${color};">${inital}</div>
        <div class="">
        <span class="s20">${name}</span><br>
        <a class="s16 contact-mail" href="mailto:${mail}">${mail}</a>
        </div>
        </div>`
        ;

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


/* allContacts = [
    {
        name: "Tatjana Wolf",
        email: "wolf@gmail.com",
        phone: "0123 45678910",
        bgcolor: "#FF5EB3",
    },
    {
        name: "Anton Meyer",
        email: "antom@gmail.com",
        phone: "0123 45678910",
        bgcolor: "#6E52FF",
    },
    {
        name: "Anja Schulz",
        email: "schulz@hotmail.com",
        phone: "0123 45678910",
        bgcolor: "#FF7A00",
    },
    {
        name: "Benedikt Ziegler",
        email: "benedikt@gmail.com",
        phone: "0123 45678910",
        bgcolor: "#9327FF",
    },
    {
        name: "David Eisenberg",
        email: "davidberg@gmail.com",
        phone: "0123 45678910",
        bgcolor: "#FC71FF",
    },
    {
        name: "Eva Fischer",
        email: "eva@gmail.com",
        phone: "0123 45678910",
        bgcolor: "#FFBB2B",
    },
    {
        name: "Emmanuel Mauer",
        email: "emmanuelma@gmail.com",
        phone: "0123 45678910",
        bgcolor: "#1FD7C1",
    },
    {
        name: "Marcel Bauer",
        email: "bauer@gmail.com",
        phone: "0123 45678910",
        bgcolor: "#462F8A",
    },

];  */ 














let allContacts = [];

let alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

let globalIndexVariable;  // Variable, um global auf den aktuellen Index zugreigen zu können. ie wird in der Funktion "loadDetail()" aktualisiert

let colors = ['#FF7A00', '#FF5EB3', '#6E52FF', '#9327FF', '#00BEE8', '#1FD7C1', '#FF745E', '#FFA35E', '#FC71FF', '#FFC701', '#0038FF', '#C3FF2B', '#FFE62B', '#FF4646', '#FFBB2B'];
let currentColor;

// ramdom Colors
function createRandomColors() {
    currentColor = colors[Math.floor(Math.random() * colors.length)];
    console.log(currentColor);
}





// Close addContactsOverlay and show contact-window
function closeAddContactOverlay() {
    let contactDiv = document.getElementById('overlay-add-contact');
    let headerTemplate = document.getElementById('header-figma');
    let sidebarTemplate = document.getElementById('sidebar');
    let generalContacts = document.getElementById('generalcontacts');
    /*let allContactDiv = document.getElementById('allContact');*/
    contactDiv.classList.add('display-none');
    headerTemplate.classList.remove('d-none');
    sidebarTemplate.classList.remove('d-none');
    generalContacts.classList.remove('d-none');
    /*allContactDiv.classList.add('d-none');*/
}

async function initContact() {
    //testWindowWidth();
    actUser();
    await loadAllContacts();
    loadgeneralContacts();
    if (window.innerWidth > 700) {  // prüft, ob die Funktion "LoadDetail" ausgeführt werden muss (sie muss nur ausgeführt werden, wenn die Dektop-Ansicht vorliegt)
        loadDetail(0);
    }
    addBackgroundcolorToSelectedContact(0);
    testWindowWidth();
   
}

/* function testWindowWidth() {
    if (window.innerWidth < 700) {
        displayNone('show-contact', 'add');
        console.log('ejksdghilsaerugdsrilthgtrhj');
        //displayNone('show-contact', 'remove');
        //document.getElementById('show-contact').classList.add('display-flex');
    } 
} */


function initAddContact() {
    let contactDiv = document.getElementById('overlay-add-contact');
    let headerTemplate = document.getElementById('header-figma');
    let sidebarTemplate = document.getElementById('sidebar');
    let generalContacts = document.getElementById('generalcontacts');
    /*let allContactDiv = document.getElementById('allContact');*/
    contactDiv.classList.remove('display-none');
    /*headerTemplate.classList.add('d-none');
    sidebarTemplate.classList.add('d-none');
    generalContacts.classList.add('d-none');*/
    /*allContactDiv.classList.add('d-none');*/
}

async function addContact() {
    let firstName = document.getElementById('nameInputField');
    console.log(firstName);
    /*let lastName = document.getElementById('lastnameInputField');*/
    let email = document.getElementById('mailInputField');
    let phone = document.getElementById('phoneInputField');
    allContacts.push({
        name: firstName.value,
        /*lastname: lastName.value,*/
        mail: email.value,
        phone: phone.value,
        color: currentColor,
    })
    await setItem('contact', JSON.stringify(allContacts));
    /*cancleNewContact();*/
    initContact();
    deleteInputFields(firstName, email, phone);
    console.log(allContacts);
}


function deleteInputFields(firstName, email, phone) {
    firstName.value = ``;
    email.value = ``;
    phone.value = ``;
}


// Load all Contacts
async function loadAllContacts() {
    try {
        allContacts = JSON.parse(await getItem('contact'));
    } catch (e) {
        console.error('Loading error: ', e);
    }

}

function cancleNewContact() {
    let contactDiv = document.getElementById('newContact');
    let allContactDiv = document.getElementById('allContact');
    document.getElementById('firstnameInputField').value = '';
    document.getElementById('lastnameInputField').value = '';
    document.getElementById('mailInputField').value = '';
    document.getElementById('phoneInputField').value = '';
    contactDiv.classList.add('d-none');
    allContactDiv.classList.remove('d-none');
}

function loadgeneralContacts() {
    getFirstLetters();
    createLetterDivs();
    loadNames();
}

function getFirstLetters() {
    for (let i = 0; i < allContacts.length; i++) {
    
        const firstLetter = allContacts[i].name.charAt(0).toUpperCase();
        
        alphabet.push(firstLetter);
    }
    // Remove duplicates from the 'alphabet' array
    alphabet = Array.from(new Set(alphabet));
    // Sort the 'alphabet' array
    alphabet.sort();
}

function createLetterDivs() {
    let contactsDiv = document.getElementById('contacts');
    contactsDiv.innerHTML = ``;
    for (let letterIndex = 0; letterIndex < alphabet.length; letterIndex++) {
        const letter = alphabet[letterIndex];

        document.getElementById('contacts').innerHTML += /*html*/`
            <div id="div${letterIndex}" class="d-none">
            <div class="contact-letter-frame-119"> ${letter} </div>
            <img src="assed/svg/contact-imgs/Vector 10.svg" alt="" class="vector-10">

                <div id="namedivs${letterIndex}"></div>


                
            </div>
        `;
    }
}

function loadNames() {
    allContacts.sort((a, b) => {
        const nameA = a.firstname.toUpperCase();
        const nameB = b.firstname.toUpperCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
    });

    for (let index = 0; index < allContacts.length; index++) {
        const element = allContacts[index];
        const name = element['firstname'];
        const mail = element['mail'];
        let nameIcon = getShortIcon(index);

        const firstLetter = name.charAt(0).toUpperCase(); // Get the first letter of the name

        // Find the index of the corresponding letter in the 'letters' array
        let letterIndex = alphabet.indexOf(firstLetter);
        console.log(letterIndex);

        // Append the name to the corresponding 'namedivs' element
        document.getElementById(`namedivs${letterIndex}`).innerHTML += /*html*/`
            <div onclick="loadDetail(${index}), addBackgroundcolorToSelectedContact(${index}), displayFlex('show-contact', 'add'), displayNoneEditContactImg(), highlight(${index})" id="contact-name${index}" class="contact-name">
                <div class="contact-name-circle" id="nameIcon${index}">
                <div id="contact-circle-div${index}" class="contact-circle-div"></div>
                    <!-- <img class="contact-circle" src="assed/svg/contact-imgs/Ellipse 5.svg" alt="" /> -->
                    <div class="contact-name-circle-txt" id="nameIcons${index}" >${nameIcon}</div>
                </div>
                <div class="name-mail-div-frame81">
                    <div class="contact-name-txt">${name}</div>
                    <div class="contact-email">${mail}</div>
                </div>
            </div>
        `;
        document.getElementById(`div${letterIndex}`).classList.remove('d-none');
        addBackgroundColorToIntials(index);
    }
}

// Background color to circles of contact-list
function addBackgroundColorToIntials(index) {
    console.log(allContacts[index]['color']);
    let currentColor = allContacts[index]['color'];

    let circleDiv = document.getElementById(`contact-circle-div${index}`);

    circleDiv.style.backgroundColor = currentColor;
    console.log(currentColor);
}

// Background-color to circle of selectes contact
function addBackgroundcolorToSelectedContact(index) {
    let currentColor = allContacts[index]['color'];
    let circleDiv = document.getElementById('show-name-circle-div');
    circleDiv.style.backgroundColor = currentColor;
}

function loadDetail(index) {
    if (window.innerWidth < 700) {
        displayNone('contacts', 'add');
        //displayNone('show-contact', 'remove');
        displayNone('edit-contact-img-mobile-div', 'remove');
        /*document.getElementById('show-contact').classList.add('display-flex');*/
    }
    displayNone('add-contact-img-mobile-div', 'add'); // remove the add contact btn
    //document.getElementById('show-contact').classList.add('display-flex');
    
    console.log(index);
    element = allContacts[index];
    document.getElementById('nameContact').innerHTML = `${element['firstname']}`;
    document.getElementById('emailContact').innerHTML = element['mail'];
    document.getElementById('phoneNumer').innerHTML = element['phone'];
    document.getElementById('iconDetail').innerHTML = getShortIcon(index);
    document.getElementById('contactNumber').innerHTML = index;
    globalIndexVariable = index;
    /*let deleteDiv = document.getElementById('edit-name-sub');
    let deleteVariable = index;
    deleteDiv.textContent = deleteVariable;*/
}

function getShortIcon(index) {
    element = allContacts[index];
    let firstName = element['firstname'];



    let seperatedStrings = firstName.split(" ");  // das Leerzeichen zwischen den Anführungszeichen sorgt dasfür, dass die Wörter an der Stelle, an der sich das Leerzeichen befindet, getrennt werden. Entfernt man das Leerzeichen zwischen den Anführungszeichen, wird jeder Buchstabe einzeln separiert!
    
    const firstNameFirstLetter = seperatedStrings[0].charAt(0).toUpperCase();

    let lastNameFirstLetter;

    if (seperatedStrings[1]) {  // das if-Statement prüft, ob an "seperatedStrings[1]" (also beim Nachnamen) überhaupt etwas vorhanden ist, da wenn dort nichts vorhanden ist, es zu einem Fehler käme
        lastNameFirstLetter = seperatedStrings[1].charAt(0).toUpperCase();
        let nameLetters = firstNameFirstLetter + lastNameFirstLetter;
        /*allContacts.push({
            initials: nameLetters,
        });*/
        let nameIcon = `${nameLetters}`;
    return nameIcon;
    } else {
        /*allContacts.push({
            initials: firstNameFirstLetter,
        });*/
        let nameIcon = `${firstNameFirstLetter}`;
        return nameIcon;
    }

    //let lastname = element['lastname'];
}

/*${lastname.at(0)}*/

async function removeContact() {
    let IDnumber = document.getElementById('contactNumber').innerHTML;
    console.log(IDnumber);
    allContacts.splice(IDnumber, 1);
    await setItem('contact', JSON.stringify(allContacts));
    initContact();
}