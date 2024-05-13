//fetch data
async function fetchFeedback() {
    const endpoint = `/data-api/rest/Feedback`;
    const response = await fetch(endpoint);
    const tasks = await response.json();
    return tasks.value;
}
async function fetchAssignment() {
    const endpoint = `/data-api/rest/Assignment`;
    const response = await fetch(endpoint);
    const tasks = await response.json();
    return tasks.value;
}
async function fetchUsers() {
    const endpoint = `/data-api/rest/Users`;
    const response = await fetch(endpoint);
    const tasks = await response.json();
    return tasks.value;
}
async function fetchTasks() {
    const endpoint = `/data-api/rest/Tasks`;
    
    const response = await fetch(endpoint);
    const tasks = await response.json();
    return tasks.value;
}

async function renderFeedback(){
    const data=await fetchFeedback();
    const username = localStorage.getItem('username');
    const staffFeedback=getUserFeedback(username,data);
    const data1=await fetchTasks();

    //adds tiles
    const feedbackList=document.getElementById("allfeedback");
    feedbackList.innerHTML = '';
    staffFeedback.forEach((row, index) => {
        let manager=getManagerWhoAssignedTask(row.task,data1);
        if(manager==undefined){
            manager="N/A";
        }
        const task = document.createElement('block');
        task.classList.add('staff-card');
        task.innerHTML = `
            <p><b>Task:</b> ${row.task}</p>
            <p><b>Manager:</b> ${manager}</p>
            <p><b>Sender:</b> ${row.sender}</p>
            <p><b>Comment:</b> ${row.comment}</p>
        `;
        feedbackList.appendChild(task);
    });

}
renderFeedback();
//fetch which manager assigned task, returns just 1 word
function getManagerWhoAssignedTask(task,json){
    const toreturn=[];
    for(const obj of json){
        if(obj.task==task){
            toreturn.push(obj.manager);
        }
    }
    return toreturn[0];
}
//returns array of feedback just allocated to the user, returns arr of obj
function getUserFeedback(staff,json){
    data=[];
    for(const obj of json){
        if(obj.receiver==staff){
            data.push(obj);
        }
    }
    return data;
}

//loads select staff dropdown with staff
async function loadAllStaffDropDown(){
    const data=await fetchUsers();
    const dropdown=document.getElementById("staffDrop");
    data.forEach(obj =>{
        if(obj.role=="Staff"){
            const option=document.createElement("option");
            option.value=obj.username;
            option.text=obj.username;
            dropdown.add(option);
        }
    })
}
loadAllStaffDropDown();//load staff names here


//Send staff their feedback, calls addCommentToDatabase
addComment.addEventListener('submit',event=>{
    event.preventDefault();

    const receiver=document.getElementById("staffDrop").value;
    const topicOrtask=document.getElementById("topic").value;
    const comment=document.getElementById("comment").value;
    const sender = localStorage.getItem('username');
    addCommentToDatabase(topicOrtask,sender,receiver,comment);
    
})
//adds data to database
async function addCommentToDatabase(task,sender,receiver,comment){
    const data={
        task:task,
        sender:sender,
        receiver:receiver,
        comment:comment
    }
    const endpoint = `/data-api/rest/Feedback`;
    const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
    });

    window.location.reload();
}

// Calculate average rating per staff and manager
async function calculateAverageRating() {
    const feedbackData = await fetchFeedback();
    const filteredData = feedbackData.filter(entry => entry.rating !== "" && entry.rating !== -1);

    const staffRatingsData = {};
    const managerRatingsData = {};
    //filter staff and managers out of data
    filteredData.forEach(entry => {
        if (entry.receiver_role === "Staff") {
            if (!staffRatingsData[entry.receiver]) {
                staffRatingsData[entry.receiver] = [];
            }
            // add rating data into ratings array  - staff
            staffRatingsData[entry.receiver].push({
                rating: parseFloat(entry.rating),
                receiver_role: entry.receiver_role || ''
            });
        } else if (entry.receiver_role === "Manager") {
            if (!managerRatingsData[entry.receiver]) {
                managerRatingsData[entry.receiver] = [];
            }
            // add rating data into ratings array - manager
            managerRatingsData[entry.receiver].push({
                rating: parseFloat(entry.rating),
                receiver_role: entry.receiver_role || ''
            });
        }
    });
    
    // calc average ratings for each receiver - staff
    const staffAverageRatings = {};
    for (const receiver in staffRatingsData) {
        const ratings = staffRatingsData[receiver];
        const sum = ratings.reduce((acc, { rating }) => acc + rating, 0);
        const average = sum / ratings.length;
        if (!isNaN(average)) {// Check if average is NaN
            // Store average rating and receiver role for each receiver
            staffAverageRatings[receiver] = {
                average_rating: average,
                receiver_role: ratings[0].receiver_role
            };
        }
    }
    // calc average ratings for each receiver - manager
    const managerAverageRatings = {};
    for (const receiver in managerRatingsData) {
        const ratings = managerRatingsData[receiver];
        const sum = ratings.reduce((acc, { rating }) => acc + rating, 0);
        const average = sum / ratings.length;
        if (!isNaN(average)) {// Check if average is NaN
            // Store average rating and receiver role for each receiver
            managerAverageRatings[receiver] = {
                average_rating: average,
                receiver_role: ratings[0].receiver_role
            };
        }
    }

    return { staffAverageRatings, managerAverageRatings };
}

// create new Excel file
const excelFileBtn = document.getElementById("genExcelFile");
excelFileBtn.addEventListener('click', async (e) => {
    const { staffAverageRatings, managerAverageRatings } = await calculateAverageRating();

    // prep data for staff worksheet
    const staffData = Object.keys(staffAverageRatings).map(key => ({
        'Sent to': key,
        'Overall Performance': staffAverageRatings[key].average_rating
    }));
    const staffWorksheet = XLSX.utils.json_to_sheet(staffData, {
        header: ['Sent to', 'Overall Performance']
    });

    // prep data for manager worksheet
    const managerData = Object.keys(managerAverageRatings).map(key => ({
        'Sent to': key,
        'Overall Performance': managerAverageRatings[key].average_rating
    }));
    const managerWorksheet = XLSX.utils.json_to_sheet(managerData, {
        header: ['Sent to', 'Overall Performance']
    });

    //create worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, staffWorksheet, 'Staff Ratings');
    XLSX.utils.book_append_sheet(workbook, managerWorksheet, 'Manager Ratings');

    //convert workbook to buffer - buffer is needed to create actual Excel file in browser
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

    // create blob and URL for downloading
    const blob = new Blob([excelBuffer], { type: EXCEL_TYPE });
    const url = window.URL.createObjectURL(blob);

    //download setup
    const a = document.createElement('a');
    a.href = url;
    a.download = 'staff_and_manager_ratings_' + new Date().toDateString() + '.xlsx';
    document.body.appendChild(a);
    a.click();

    //clean up since a unique url is generated for each click
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
});

module.exports = {addCommentToDatabase, getUserFeedback, renderFeedback, fetchAssignment, fetchFeedback, fetchUsers, loadAllStaffDropDown, getManagerWhoAssignedTask, fetchTasks};