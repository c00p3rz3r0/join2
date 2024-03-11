// register.js

let users = [];
let name; 
let uemail;

async function loadUsers(){
    try {
        users = JSON.parse(await getItem('users'));
    } catch(e){
        console.error('Loading error:', e);
    }
}


function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

async function register() {
    registerBtn.disabled = true;
    if (userPassword.value == userPasswordConfirm.value) {
        let userColor = getRandomColor();
        initialien = document.getElementById('userEmail').value
        initialien2 = initialien.charAt(0).toUpperCase()+initialien.charAt(1).toUpperCase();
        users.push({
            name: userName.value,
            email: userEmail.value,
            password: userPassword.value,
            ucolor: userColor,
            initial: initialien2,
        });
        await setItem('users', JSON.stringify(users));
        resetForm();
    }else{
        alert('Passwörte stimmen nicht überein');
        resetForm();
    }

}

function resetForm() {
    userName.value = '';
    userEmail.value = '';
    userPassword.value = '';
    userPasswordConfirm.value = '';
    registerBtn.disabled = false;
}

function loginUser(){
    let useremail = document.getElementById('userEmail');
    let userpassword = document.getElementById('userpassword');
    let user = users.find(u => u.email == useremail.value && u.password == userpassword.value && u.name)
    if(user){
        localStorage.setItem('user', user.name);
        localStorage.setItem('userEmail', user.email);
        window.location.href='summary.html'
    }else{
        alert('Bitte registrieren');
    }
}

function guestLogIn(){
    window.location.href='summary.html';
    localStorage.setItem('user', 'Guest');
}

function actUser(){
    name = localStorage.getItem('user');
    uemail = localStorage.getItem('userEmail');
    document.getElementById('actUser').innerHTML = uemail.charAt(0).toUpperCase()+uemail.charAt(1).toUpperCase();
}
function restoreActUser() {
    localStorage.setItem('user', '');
}