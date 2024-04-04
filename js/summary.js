
let dueDateNext = [];
/**
 * Init of the form of summary.html
 */
async function initSummaryForm(){
    await loadAllTask();
    updateSummary();
}
/**
 * Update and sort the ammount of the categorys
 */
function updateSummary(){
    let todo = loadSum('To Do'); //ToDo
    let done = loadSum('Done');//Done
    let progress = loadSum('In progress');//Progress
    let feedback = loadSum('Await feedback');// Feedback
    let urgent = loadUrgent('urgentBtn');
    let urgentDate = urgentDates();
    let total = allTasks.length;
    document.getElementById('totalToDo').innerHTML = todo;
    document.getElementById('totalDone').innerHTML = done;
    document.getElementById('totalTask').innerHTML = total;
    document.getElementById('taskInProgress').innerHTML = progress;
    document.getElementById('taskFeedback').innerHTML = feedback;
    document.getElementById('totalUrgent').innerHTML = urgent;
    document.getElementById('urgentDate').innerHTML = urgentDate;
}

/**
 * Load the total ammount of an secific arry
 * 
 * @param {string} index - this is the name of the category
 * @returns 
 */
function loadSum(index){
    let sum = 0;
    for (let i = 0; i < allTasks.length; i++) {
        const element = allTasks[i];
        if(element['category'] == index){
            sum++;
        }
    }
    return sum;
}
/**
 * Search for the next urgent date in the urgent array
 * 
 * @returns 
 */
function urgentDates(){
    dueDateNext.sort((a, b) => new Date(a) - new Date(b));
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dueDateNext[0]).toLocaleDateString('en-US', options);
}
/**
 * load the sum of the urgent tasks
 * 
 * @param {string} index - name of the urgent typ
 * @returns 
 */
function loadUrgent(index){
    let sum = 0;
    for (let i = 0; i < allTasks.length; i++) {
        const element = allTasks[i];
        if(element['prio'] == index){
            sum++;
            dueDateNext.push(element['dueDate']);
        }
    }
    return sum;
}
/**
 * change the image of the pen by cursor hover
 * 
 * @param {number} i - 1 or 2 
 */
function changeImage(i) {
    var element = document.getElementById('image'+i);
    if (i==1) {
        element.src = 'assets/img/pen_white.svg';
    }else{
        element.src = 'assets/img/checkbutton_white.svg';
    }
  }
 /**
 * change the image of the pen by cursor hover
 * 
 * @param {number} i - 1 or 2 
 */
  function restoreImage(i) {
    var element =  document.getElementById('image'+i);
    if (i==1) {
        element.src = 'assets/img/pencil.svg';
    }else{
        element.src = 'assets/img/check.svg';
    }
  }