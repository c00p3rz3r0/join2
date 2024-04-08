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
    if (window.innerWidth < 1250) {

        document.body.style.overflow = ('hidden');
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
        changeCheckboxStatus(element, i);
    };
    await setItem('tasks', JSON.stringify(allTasks));
    let detailDiv = document.getElementById('taskDetail');
    detailDiv.innerHTML = '';
    document.getElementById('popUp').classList.add('display-none');
    if (window.innerWidth < 12500) {
        document.body.style.overflow = ('scroll');
    }
    initBoardForm();
}

function changeCheckboxStatus(element, i){
    let checkbox = document.getElementById(i);
    let actSubtask = element['subTasks'][i];
    if (checkbox.checked) {
        actSubtask['taskStatus'] = 'true';
    }else{
        actSubtask['taskStatus'] = ' ';
    };
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
