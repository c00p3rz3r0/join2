// register.js

let users = [];
let loggedInUserName; // Changed variable name from 'name' to 'loggedInUserName'
let uemail;

/**
 * Load users from backend to users[]
 */
async function loadUsers(){
    try {
        users = JSON.parse(await getItem('users'));
    } catch(e){
        console.error('Loading error:', e);
    }
}
/**
 * Get a random Color for a new user
 * 
 * @returns 
 */
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
/**
 * registration of a new user an validation of, password, register 
 */
async function register() {
    registerBtn.disabled = true;
    let useremail = document.getElementById('userEmail');
    let user = users.find(u => u.email == useremail.value);
    if (!user) {
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
            document.getElementById("passwordIncorrect").style.display = "block";
            document.getElementById("passwordIncorrect").innerHTML = "You have been successfully registered!";
        }else{
            document.getElementById("passwordIncorrect").style.display = "block";
            resetForm();
        }
    }else{
        document.getElementById("notRegister").style.display = "block";
        resetForm();
    }

}
/**
 * Reset sign up form after registration
 */
function resetForm() {
    userName.value = '';
    userEmail.value = '';
    userPassword.value = '';
    userPasswordConfirm.value = '';
    registerBtn.disabled = false;
}
/**
 * User login and validation of registration
 */
function loginUser(){
    let useremail = document.getElementById('userEmail');
    let userpassword = document.getElementById('userpassword');
    
    let user = users.find(u => u.email == useremail.value)
    if (!user) {
        document.getElementById("notRegister").style.display = "block";
    }else if((user['email']== useremail.value) && (user['password']== userpassword.value)){
        localStorage.setItem('user', user.name);
        localStorage.setItem('userEmail', user.email);
        window.location.href='summary.html'
    }else if((user['email']== useremail.value) && !(user['password']== userpassword.value)){
        document.getElementById("passwordIncorrect").style.display = "block";
    }
}
/**
 * Login for guest and save Guest in local storage
 */
function guestLogIn(){
    window.location.href='summary.html';
    localStorage.setItem('user', 'Guest');
}
/**
 * lod information of the actual user
 */
function actUser(){
    loggedInUserName = localStorage.getItem('user');
    uemail = localStorage.getItem('userEmail');
    if (loggedInUserName === 'Guest') {
        document.getElementById('actUser').innerHTML = loggedInUserName;
    }else{
        document.getElementById('actUser').innerHTML = uemail.charAt(0).toUpperCase() + uemail.charAt(1).toUpperCase();
    }
}
/**
 * reset actual user and clar local storage after logout
 */
function restoreActUser() {
    localStorage.setItem('user', '');
}
