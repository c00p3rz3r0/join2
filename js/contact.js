
let sortedNames = [];

function sortNames(){
    sortedNames = allContacts.sort();
}


function loadContactPage(){
    let contactsDiv = document.getElementById('contactBlock');
    contactsDiv.innerHTML = ``;
    for (let i = 0; i < sortedNames.length; i++) {
        const element = sortedNames[i];
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


allContacts = [
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

];