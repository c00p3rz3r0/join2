function hi() {
    console.log('hihihihihihihihihihihih');
}

function displayNone(param1, param2) {
    document.getElementById(param1).classList[param2]('display-none');
}

function displayFlex(param1, param2) {
    document.getElementById(param1).classList[param2]('display-flex');
}

function testWindowWidth() {
    if (window.innerWidth < 700) {
        displayNone('add-contact-img-mobile-div', 'remove');  // anzeigen des mobilen addContact icons
    }
}

function highlight(index) {
    console.log('highlight');
    // remove highlight from prevoiusly highlighted divs/names
    for (let index = 0; index < allContacts.length; index++) {
        const element = allContacts[index];
        document.getElementById(`contact-name${index}`).classList.remove('highlight');
    }
    // highlight current div/name
    document.getElementById(`contact-name${index}`).classList.add('highlight');
}

    // close addContact-Overlay
function closeAddContactOverlay() {
    displayNone('overlay-add-contact', 'add');
}

function adjustAddContactOverlayForEditContacts() {
    displayNone('cancel-create-contact ', 'add');
    displayNone('edit-contact', 'remove');
    displayNone('contact-sidebar-txt-add', 'add');
    displayNone('contact-sidebar-txt-edit', 'remove')
}

function showCreateContactBtns() {
    displayNone('cancel-create-contact', 'remove')
    displayNone('edit-contact', 'add');
    displayNone('contact-sidebar-txt-add', 'remove');
    displayNone('contact-sidebar-txt-edit', 'add');
}

function emptyInputfields() {
    document.getElementById('nameInputField').value = ``;
    document.getElementById('mailInputField').value = ``;
    document.getElementById('phoneInputField').value = ``;
}

function displayNoneEditContactImg() {
    if (window.innerWidth < 700) {
        displayNone('edit-contact-img-mobile-div', 'remove');  // anzeigen des mobilen editContact icons
    }
} 

/*function showContactCreatedOverlay() {
    if (window.innerWidth < 700) {
        displayNone('contact-successfully-created-overlay', 'remove')
    }
}*/