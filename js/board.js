let todoArray = [];
let inProgressArray = [];
let awaitFeedbackArray = [];
let doneArray = [];
let currentDraggedElement;

/**
 * init of the board form
 */
async function initBoardForm() {
    await loadAllTask();
    updateHTML();
    await loadUsers();
    await loadAllContacts();
    await sortContact();
}
/**
 * Update the HTML board
 */
function updateHTML() {
    let todo = allTasks.filter(t => t['category'] == 'To Do');
    loadCards(todo, 'boardToDo');
    let inProgress = allTasks.filter(t => t['category'] == 'In progress');
    loadCards(inProgress, 'boardProgress');
    let awaitFeedback = allTasks.filter(t => t['category'] == 'Await feedback');
    loadCards(awaitFeedback, 'boardFeedback');
    let done = allTasks.filter(t => t['category'] == 'Done');
    loadCards(done, 'boardDone');
}
/**
 * search for a task
 */
function searchTask() {
    let searchValue = document.getElementById('searchInput').value.toLowerCase();
    for (let i = 0; i < allTasks.length; i++) {
        const title = allTasks[i]['title'].toLowerCase();
        const description = allTasks[i]['description'].toLowerCase();
        const searchElement = allTasks[i]['createdAt'];
        const taskElement = document.getElementById(searchElement);
        if (taskElement) {
            if (title.includes(searchValue) || description.includes(searchValue)) {
                taskElement.style.display = 'block';
            } else {
                taskElement.style.display = 'none';
            }
        } else {
            console.error(`Task element with ID '${searchElement}' not found.`);     
        }
    }
}
/**
 * generate board cards for the specific category
 * 
 * @param {JSON} array - all task in the category todo or in progress etc
 * @param {string} boardCat - get the html id for the specific board category
 */
function loadCards(array, boardCat) {
    document.getElementById(boardCat).innerHTML = ``;
    if (array.length === 0) {
        generateNoTask(boardCat);
    } else {
        for (let i = 0; i < array.length; i++) {
            const element = array[i];
            generateCard(boardCat, element, i);
            generateAssignUsers(boardCat, i, element);
        }
    }
}
/**
 * generate Card html
 * 
 * @param {string} boardCat - get the html id for the specific board category
 * @param {JSON} element - all task in the category todo or in progress etc
 * @param {number} i - index of the next card
 */
function generateCard(boardCat, element, i) {
    let subtaskAmount = element['subTasks'].length;
    let openSubtask = element['subTasks'].filter(obj=> obj['taskStatus'] === 'true').length;
    let progressvalue = (openSubtask/subtaskAmount)*100;
    let priority = getPriority(element);
    document.getElementById(boardCat).innerHTML += `
    <div class="board-card" id="${element['createdAt']}" draggable="true" onclick="openDetail('${element['createdAt']}')" ondragstart="startDragging('${element['createdAt']}')">
    <div><span class="lable-board-card">User Story</span></div>
    <div>
    <h3>${element['title']}</h3>
    </div>
    <div><span>${element['description']}</span></div>
    <div id="progressSubtask${i}" class="progress">
    <progress id="progress" value="${progressvalue}" max="100"></progress>
    <span>${openSubtask}/${subtaskAmount} Subtask</span>
    </div>
    <div class="card-bottom-div"><div class="card-bottom" id="bottom${boardCat}${i}"></div>
    <img src="${priority}" alt=""></div>
    `
    if (subtaskAmount == 0) {
        document.getElementById('progressSubtask'+i).classList.add('display-none');
    }
}
/**
 * show the cortrect priority image
 * 
 * @param {JSON} element - actual task element
 * @returns 
 */
function getPriority(element) {
    let probtn;
    if (element['prio'] == 'mediumBtn') {
        probtn = 'assets/img/prio-media.svg';
    } else if (element['prio'] == 'urgentBtn') {
        probtn = 'assets/img/prio-alta.svg';
    } else {
        probtn = 'assets/img/prio-baja.svg';
    }
    return probtn;
}
/**
 * show the cortrect priority name
 * 
 * @param {JSON} element - actual task element
 * @returns 
 */
function getPriorityName(element) {
    let probtn;
    if (element['prio'] == 'mediumBtn') {
        probtn = 'Medium';
    } else if (element['prio'] == 'urgentBtn') {
        probtn = 'Urgent';
    } else {
        probtn = 'Low';
    }
    return probtn;
}
/**
 * generate an "empty" div with a short text for no task in this category
 * 
 * @param {string} boardCat - get the html id for the specific board category
 */
function generateNoTask(boardCat) {
    document.getElementById(boardCat).innerHTML =
        `
    <div class="no-tasks" draggable="true" ondragstart="startDragging('0')">
    <div class=><span>No tasks To do</span></div>
    </div>
    `
}
/**
 * generate the aasign user of this task
 * 
 * @param {string} boardCat - get the html id for the specific board category
 * @param {number} i - index of the actual card
 * @param {JSON} element - actual task element
 */
function generateAssignUsers(boardCat, i, element) {
    let assignCard = document.getElementById('bottom' + boardCat + i);
    let moreAssigne = 0;
    for (let index = 0; index < element['assigned'].length; index++) {
        const element2 = element['assigned'][index];
        const firstLetter = getLetters(element2['firstname'])
        if (index < 3) {
            assignCard.innerHTML += `
            <div class="assigned-circle" style="background-color: ${element2['color']};">${firstLetter}</div>
            `
        }else{
            moreAssigne++;
        }

    };
    if (moreAssigne > 3) {
        assignCard.innerHTML += `
        <div class="more-Assigne">+${moreAssigne}</div>
        `
    }
}
/**
 * start the drag and drop process
 * 
 * @param {number} id - id of the draggeble card
 */
function startDragging(id) {
    for (let i = 0; i < allTasks.length; i++) {
        const array = allTasks[i];
        if (array['createdAt'] == id) {
            currentDraggedElement = i;
        }
    }
}
/**
 * drop the new element in the new category and save to backend
 * 
 * @param {string} category - new category of the draggeble element
 */
async function moveTo(category) {

    allTasks[currentDraggedElement]['category'] = category;
    await setItem('tasks', JSON.stringify(allTasks));
    initBoardForm();
}
function allowDrop(ev) {
    ev.preventDefault();
}
/**
 * open add or edit form
 * 
 * @param {number} index - number for add or edit task
 */
function openAddTask(index) {
    if (window.innerWidth < 690 && index !== 1) {
        window.location.href = "add_task.html";
    } else {
        document.getElementById('addTaskBoard').classList.remove('display-none');
        document.getElementById('popUp').classList.remove('display-none');

        document.getElementById('doneSelect').classList.remove('display-none');
        document.getElementById('bg-popup').classList.remove('display-none');
        document.getElementById('bg-popup').classList.add('d-flex');
        document.getElementById('task-header-temp').classList.add('display-none');
        document.getElementById('addTaskBoard2').classList.add('noPadding')
        if (index === 1) {
            openEditInformation();
            let detailDiv = document.getElementById('taskDetail');
            detailDiv.innerHTML = '';
        }
    }


}
/**
 * change the view from add task to edit task
 */
function openEditInformation() {
    edit = true;
    let element = allTasks[currentDraggedElement];
    document.getElementById('addTaskBoard').classList.remove('add-task-board');
    document.getElementById('addTaskBoard').classList.add('edit-task-board');
    document.getElementById('submitEditTask').classList.remove('display-none');
    document.getElementById('formElements').classList.remove('add-task');
    document.getElementById('submitTask').classList.add('display-none');
    document.getElementById('claer').classList.add('display-none');
    document.getElementById('taskTitle').value = element['title'];
    document.getElementById('taskDescription').value = element['description'];
    document.getElementById('taskTitle').value = element['title'];
    document.getElementById('taskTitle').value = element['title'];
    document.getElementById('dueDate').value = element['dueDate'];
    showActualAssignedPersons(element);
    subTasks = element['subTasks'];
    selectPriority(element['prio']);
    selectCategory(element);
    generateSubTask();
}
/**
 * show all assigne user in the task form
 * 
 * @param {JSON} element - acutal task
 */
function showActualAssignedPersons(element) {
    let assDiv = document.getElementById('assinedPersons');
    assignedPerson = element['assigned'];
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
 * select the category of the edit task in the form
 * 
 * @param {JSON} element - actual task
 */
function selectCategory(element) {
    let selectElement = document.getElementById("taskCategory");
    let categoryValue = element['category'];
    for (let i = 0; i < selectElement.options.length; i++) {
        let option = selectElement.options[i];

        if (option.value === categoryValue) {
            option.selected = true;
            break;
        }
    }
}
/**
 * save the new/edit task in the backend
 */
async function saveTask() {
    allTasks.splice(currentDraggedElement, 1);
    await addTask();
}
/**
 * close add tsak form
 */
function closeAdd() {
    document.getElementById('addTaskBoard').classList.add('display-none');
    document.getElementById('task-header-temp').classList.remove('display-none');
    document.getElementById('bg-popup').classList.remove('d-flex');
    document.getElementById('bg-popup').classList.add('display-none');
    document.getElementById('popUp').classList.add('display-none');
}
/**
 * show details of the task
 * 
 * @param {number} id - id of the actual task
 */
function openDetail(id) {
    if (window.innerWidth < 690) {

        document.body.classList.add('overlay-scroll-lock')
    }
    let detailDiv = document.getElementById('taskDetail');
    document.getElementById('popUp').classList.remove('display-none');
    startDragging(id);
    detailDiv.innerHTML = ``;
    let element = allTasks[currentDraggedElement];
    let priority = getPriority(element);
    let prioName = getPriorityName(element);
    generateDetail(detailDiv, element, priority, prioName);
    generateSubtaskDetail(element);
    generateAssignUsersDetail(element);
}
/**
 * close detail of the task and save the new status of the subtask
 */
async function closeDetail() {
    let element = allTasks[currentDraggedElement];
    for (let i = 0; i < element['subTasks'].length; i++) {
        let checkbox = document.getElementById(i);
        let actSubtask = element['subTasks'][i];
        if (checkbox.checked) {
            actSubtask['taskStatus'] = 'true';
        }else{
            actSubtask['taskStatus'] = ' ';
        };
    };
    await setItem('tasks', JSON.stringify(allTasks));
    let detailDiv = document.getElementById('taskDetail');
    detailDiv.innerHTML = '';
    document.getElementById('popUp').classList.add('display-none');
    if (window.innerWidth < 690) {

        document.body.classList.remove('overlay-scroll-lock')
    }
    initBoardForm();
}
/**
 * delete actual task and reload page
 */
async function deleteTask() {
    allTasks.splice(currentDraggedElement, 1);
    await setItem('tasks', JSON.stringify(allTasks));
    initBorad();
    location.reload();
}
/**
 * generate a detail view of the task
 * 
 * @param {div} detailDiv - div for the details
 * @param {JSON} element - actual task
 * @param {string} priority - image for the priority
 * @param {string} prioName - name of the priority
 */
function generateDetail(detailDiv, element, priority, prioName) {
    detailDiv.innerHTML = `
    <div class="board-card-detail ">
    <div class="detail-top">
        <span class="lable-board-card">User Story</span>
        <img src="assets/img/close.svg" onclick="closeDetail()" alt="">
    </div>
    <div>
    <h3>${element['title']}</h3>
    </div>
    <div><span>${element['description']}</span></div>
    <div class="detail-style">
    <table>

    <tbody>
        <tr>
            <td>Due date:</td>
            <td>${element['dueDate']}</td>

        </tr>
        <tr>
            <td>Priority:</td>
            <td>${prioName}  <img src="${priority}" alt=""></td>
        </tr>            
    </tbody>
    </table>

    <span>Assigned To:</span>
    <div class="assign-detail" id="assignedTo">
    </div>
    <span>Subtasks:</span>
    <div class="assign-detail" id="subTasks">
    </div>
    <div class="card-bottom-div"><div class="card-bottom" id=""></div>
    </div>
    <div class="contact-edit">
    <div id="editContact" onclick="openAddTask(1)" class="edit-contact"></div>
    <img class="MobileYes" src="assets/img/v-vectos-edit.svg" alt="">
    <div class="delete-contact" onclick="deleteTask()"></div>
    </div>
    `;
}
/**
 * generate the subtask with the status of the checkbox
 * 
 * @param {JSON} element - actual task
 */
function generateSubtaskDetail(element) {
    let subtasks = document.getElementById('subTasks');
    subtasks.innerHTML = '';
    for (let i = 0; i < element['subTasks'].length; i++) {
        const subtask = element['subTasks'][i];
        let checkedbox = '';
        if (subtask['taskStatus']== 'true') {
            checkedbox = 'checked';
        }else{
            checkedbox = '';
        }
        subtasks.innerHTML += `
        <div class="subtask-detail s16">
        <div class="">
        <input type="checkbox" name="" id="${i}" ${checkedbox} >
        </div>
        <span>${subtask['task']}</span>
        </div>
        `;
    }
}
/**
 * show the assigne user of the task
 * 
 * @param {JSON} element - actual task
 */
function generateAssignUsersDetail(element) {
    let assignCard = document.getElementById('assignedTo');
    for (let index = 0; index < element['assigned'].length; index++) {
        const element2 = element['assigned'][index];
        const firstLetter = getLetters(element2['firstname'])
        assignCard.innerHTML += `
        <div class="assigned-detail-block s19">
        <div class="assigned-circle-small s12" style="background-color: ${element2['color']};">${firstLetter}</div>
        <span>${element2['firstname']}</span>
        </div>
        `
    };
}
/**
 * 
 * @param {number} id - id of the new div for the draggable element
 */
function highlight(id){
    document.getElementById(id).classList.add('highlight-drag');
}
/**
 * 
 * @param {number} id - id of the last div for the draggable element
 */
function removeHighLight(id){
    document.getElementById(id).classList.remove('highlight-drag');
}
