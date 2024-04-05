let allTasks = [];
let selectedPrio ='';
let assignedPerson = [];
let allAssigned = [];
const htmlfields = ['assinedPersons', 'task-list'];
let taskIdCounter = 0;
let subTasks = [];
let defaultCategories =['To Do', 'In progress', 'Await feedback','Done'];
let edit = false;

/**
 * init task form
 */
async function initTaskform(){
    await loadUsers();
    await loadAllTask();
    await loadAllContacts();
    await sortContact();
}


/**
 * clar task form and reload page
 */
function clearTaskForm(){
    location.reload();
}


/**
 * save edit or add task
 */
function sendForm(){
    if (edit === false) {
        addTask();
    }else{
        saveTask();
    }
}


/**
 * add a new task and save to the backend
 */
async function addTask() {
    submitTask.disabled = true;
    let taskT = document.getElementById('taskTitle');
    let taskD = document.getElementById('taskDescription');
    let taskDueDate = document.getElementById('dueDate');
    let taskC = document.getElementById('taskCategory');
    let taskPrio = document.getElementById('priority-input');
    allTasks.push({
        title: taskT.value,
        description: taskD.value,
        assigned: assignedPerson,
        dueDate: taskDueDate.value,
        prio: taskPrio.value,
        category: taskC.value,
        subTasks: subTasks,
        createdAt: new Date().getTime(),
    });
    await setItem('tasks', JSON.stringify(allTasks));
    document.getElementById('formTask').reset();
    loadAllTask();
    navigateTo('board.html');
}


/**
 * 
 * @param {string} buttonId - selected priority button
 */
function selectPriority(buttonId) {
    const buttons = document.querySelectorAll('.priority-btn');
    buttons.forEach((button) => {
        button.classList.remove('active');
    });
    document.getElementById(buttonId).classList.add('active');
    selectedPrio = buttonId;
    document.getElementById('priority-input').value = selectedPrio;
}


function checkTheAssign(index) {
    let box = document.getElementById('check'+index);
    if (box.checked === true) {
        box.checked = '';
        addAssigne(index);
    }else{
    document.getElementById('check'+index).checked = true;
    addAssigne(index);
}
}


/**
 * add and show assigne users 
 */
function addAssigne(){
    assignedPerson = [];
    for (let i = 0; i < allContacts.length; i++) {
        const element = allContacts[i];
        if (document.getElementById('check'+i).checked == true) {
            let firstname = allContacts[i]['name'];
            let color = allContacts[i]['bgcolor']
            assignedPerson.push({
                firstname: firstname,
                color: color,
            });
        }
    }
}


/**
 * index of the  checked users
 * 
 * @param {number} index - index of the actual task
 * @returns 
 */
function checked(index){
    for (let i = 0; i < assignedPerson.length; i++) {
        const element = assignedPerson[i]['firstname'];
        if (element == allContacts[index]['name']) {
            return "checked";
        }
    } return false;
}



/**
 * get first letters of the first and last name
 * 
 * @param {string} name - name of the user
 * @returns 
 */
function getLetters(name){
    let letter1 = name.charAt(0).toUpperCase();
    let letter2Pos = name.indexOf(" ");
    let letter2 = name.charAt(letter2Pos+1).toUpperCase();
    let letters = letter1+letter2;
    return letters;
}


/**
 * add subtask to the new task
 */
function addSubtask(){
    let inputSubtask = document.getElementById('subtask');
    if (inputSubtask.value == "") {
        alert('Enter new Subtask')
    }else{
    subTasks.push({
        task: inputSubtask.value,
        taskStatus: '',
    });
    inputSubtask.value = ``;
    generateSubTask();
    }
}


/**
 * show the assinged users after closing the drop down
 */
function showAssignedPersons() {
    let assDiv = document.getElementById('assinedPersons');
    assDiv.innerHTML = ``;
    for (let i = 0; i < assignedPerson.length; i++) {
        const element = assignedPerson[i];
        const firstLetter = getLetters(element['firstname']) //element['firstname'].charAt(0).toUpperCase()+element['firstname'].ch;
        assDiv.innerHTML += `
        <div>
        <div class="assigned-circle" style="background-color: ${element['color']};">${firstLetter}</div>
        </div>
        `;
    }
}


/**
 * load new information of the editinal subtask
 * 
 * @param {JsonWebKey} element - actual array
 * @param {number} i - index of the element
 */
function confirmeditSubtask(i){
    let editSubtask = subTasks[i];
    editSubtask['task'] = document.getElementById('subTask'+i).value;
    generateSubTask();
}


/**
 * delete subtask fomr the task
 * 
 * @param {JSON} element - actual task
 */
function deletSubtask(element){
    const index = searchIndexOf(subTasks, element);
    if (index >-1){}
    subTasks.splice(index,1);
    generateSubTask();
}


/**
 * seahr index of an array by an specific value
 * 
 * @param {JSON} array - specific arry
 * @param {string} value - specific value
 * @returns 
 */
function searchIndexOf(array, value){
    let indexOf = array.indexOf(value);
    return indexOf;
}


/**
 * edit the sub task
 * 
 * @param {num#} index - index of the subtask to edit
 */
function editSubtask(index){
    document.getElementById('subTask'+index).disabled = false;
    document.getElementById('subTaskEdit'+index).classList.add('display-none');
    document.getElementById('checksubTaskEdit'+index).classList.remove('display-none');

}
