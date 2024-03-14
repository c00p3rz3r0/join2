let todoArray = [];
let inProgressArray = [];
let awaitFeedbackArray = [];
let doneArray = [];

async function initBoardForm(){
    await loadAllTask();
    sortAllTask();
    loadCards(todoArray,'boardToDo');
    loadCards(inProgressArray,'boardProgress');
}

function sortAllTask(){
    for (let i = 0; i < allTasks.length; i++) {
        const element = allTasks[i];
        if (element['category']=='To Do') {
            todoArray.push(element);
        }        
        if (element['category']=='In progress') {
            inProgressArray.push(element);
        }        
        if (element['category']=='Await feedback') {
            awaitFeedbackArray.push(element);
        }
        if (element['category']=='Done') {
            doneArray.push(element);
        }
    }
}

function loadCards(array,boardCat){
    document.getElementById(boardCat). innerHTML = ``;
    for (let i = 0; i < array.length; i++) {
        const element = array[i];
        let subtaskAmount = element['subTasks'].length;
        document.getElementById(boardCat). innerHTML +=`
        <div class="board-card">
        <div><span class="lable-board-card">User Story</span></div>
        <div>
        <h3>${element['title']}</h3>
        </div>
        <div><span>${element['description']}</span></div>
        <div class="progress">
        <progress id="progress" value="50" max="100"></progress>
        <span>1/${subtaskAmount} Subtask</span>
        </div>
        <div class="card-bottom" id="bottom${i}"></div>
        `
        let assignCard = document.getElementById('bottom'+i);
        for (let index = 0; index < element['assigned'].length; index++) {
            const element2 = element['assigned'][index];
            const firstLetter = getLetters(element2['firstname'])
            assignCard.innerHTML +=`
            <div class="assigned-circle" style="background-color: ${element2['color']};">${firstLetter}</div>
            `
        };
    }
}

function generateCard(category){

}