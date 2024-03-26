let allTasks = [];
let selectedPrio ='';
let assignedPerson = [];
let allAssigned = [];
const htmlfields = ['assinedPersons', 'task-list'];
let taskIdCounter = 0;
let subTasks = [];
let defaultCategories =['To Do', 'In progress', 'Await feedback','Done'];

async function initTaskform(){
    await loadContacts();
    await loadAllTask();
    await loadAllContacts();
    await sortContact();
}


function clearTaskForm(){
    location.reload();
}

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
    location.reload();
}


function selectPriority(buttonId) {
    const buttons = document.querySelectorAll('.priority-btn');

    // Remove the 'active' class from all buttons
    buttons.forEach((button) => {
        button.classList.remove('active');
    });

    // Add the 'active' class to the selected button
    document.getElementById(buttonId).classList.add('active');

    // Update the selected priority
    selectedPrio = buttonId;
    document.getElementById('priority-input').value = selectedPrio;
}

function showContacts(){
    let contactdiv = document.getElementById('assignedContacts');
    let assDiv = document.getElementById('assinedPersons');
    if (contactdiv.classList.contains('display-none')) {
        contactdiv.innerHTML = ``;
        assDiv.innerHTML = ``;
        contactdiv.classList.remove('display-none');
        for (let i = 0; i < allContacts.length; i++) {
            const element = allContacts[i];
            const firstLetter = getLetters(element['name']) // element['name'].charAt(0).toUpperCase();
            const checkChecked = checked(i);
            contactdiv.innerHTML +=`
            <div class="assigneContact">
            <div class="assigned-circle" style="background-color: ${element['bgcolor']};">${firstLetter}</div>
            <p>${element['name']}</p> 
            <input onclick="addAssigne(${i})" ${checkChecked} id="check${i}" type="checkbox">
            </div>`
        }
    }else{
        contactdiv.classList.add('display-none');
        showAssignedPersons();
    }
}

function addAssigne(index){
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

function checked(index){
    for (let i = 0; i < assignedPerson.length; i++) {
        const element = assignedPerson[i]['firstname'];
        if (element == allContacts[index]['name']) {
            return "checked";
        }
    } return false;
}

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

function getLetters(name){
    let letter1 = name.charAt(0).toUpperCase();
    let letter2Pos = name.indexOf(" ");
    let letter2 = name.charAt(letter2Pos+1).toUpperCase();
    let letters = letter1+letter2;
    return letters;
}

function addSubtask(){
    let inputSubtask = document.getElementById('subtask');
    if (inputSubtask.value == "") {
        alert('Enter new Subtask')
    }else{
    subTasks.push({
        task: inputSubtask.value,
        taskStatus: 'open',
    });
    inputSubtask.value = ``;
    generateSubTask();
    }
}

function generateSubTask(){
    let addedSubtask = document.getElementById('addSubtask');
    addedSubtask.innerHTML = ``;
    for (let i = 0; i < subTasks.length; i++) {
        const element = subTasks[i];
        addedSubtask.innerHTML +=`
        <div class="input-subtask" ondblclick="editSubtask(${i})">
        <input id=subTask${i}  type="text" disabled   value="${element['task']}">
        <div class="subtaskIcons">
        <img src="assets/img/edit-subtask.svg" onclick="editSubtask(${i})" id=subTaskEdit${i} alt="" srcset="">
        <img src="assets/img/check-change.svg" class="display-none" onclick="confirmeditSubtask('${element['task']}',${i})" id=checksubTaskEdit${i} alt="" srcset="">
        <img src="assets/img/vector-subtask.svg" id=subTaskEdit${i} alt="" srcset="">
        <img src="assets/img/delet.svg" onclick="deletSubtask('${element['task']}')" id=deleteSubtask${element['task']} alt="" srcset="">
        </div>
        </div>
        `
        //document.getElementById('subTask'+i).addEventListener('focusin',editSubtask(i));
    }
}

function confirmeditSubtask(element,i){
    const index = searchIndexOf(subTasks, element);
    if (index !== 1){}
    subTasks[index] = document.getElementById('subTask'+i).value;
    generateSubTask();
}

function deletSubtask(element){
    const index = searchIndexOf(subTasks, element);
    if (index >-1){}
    subTasks.splice(index,1);
    generateSubTask();
}

function searchIndexOf(array, value){
    let indexOf = array.indexOf(value);
    return indexOf;
}


function editSubtask(index){
    document.getElementById('subTask'+index).disabled = false;
    document.getElementById('subTaskEdit'+index).classList.add('display-none');
    document.getElementById('checksubTaskEdit'+index).classList.remove('display-none');
    console.log('Test')
}
