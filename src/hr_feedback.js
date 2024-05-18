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
//loads staff and managers for the dropdown relating to creating the excel document
async function loadAllStaffManagerDropDown(){
    const data=await fetchUsers();
    const dropdown=document.getElementById("staffSelection");
    data.forEach(obj =>{
        if(obj.role=="Staff"){
            const option=document.createElement("option");
            option.value=obj.username;
            option.text=obj.username;
            dropdown.add(option);
        }
    })
}
loadAllStaffManagerDropDown();//load staff names here



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

// Creates a map of objects which will be used to create excel file
async function getExcelFeedback() {
    const staffmember=document.getElementById("staffSelection").value;
    const feedbackData = await fetchFeedback();
    const filteredData = feedbackData.filter(entry => entry.rating !=null && entry.rating !== -1 && entry.receiver_role=="Staff" && entry.receiver==staffmember);
    console.log(filteredData);

    const data = {};
    let i=0;
    for(const obj of filteredData){
        data[i]={
            task:obj.task,
            sender:obj.sender,
            receiver:obj.receiver,
            comment:obj.comment,
            rating:obj.rating
        }
        i=i+1;
    }
    return data;
}
// create new Excel file
downloadExcel.addEventListener('submit', async e => {
    e.preventDefault();
    const getExcelFeedbackdata = await getExcelFeedback();
    // prep data for Excel
    const data = Object.keys(getExcelFeedbackdata).map(key => ({
        'task':getExcelFeedbackdata[key].task,
        'sender':getExcelFeedbackdata[key].sender,
        'receiver':getExcelFeedbackdata[key].receiver,
        'comment':getExcelFeedbackdata[key].comment,
        'rating':getExcelFeedbackdata[key].rating
    }));
    //create worksheet
    const worksheet = XLSX.utils.json_to_sheet(data, {
        header: ['task', 'sender','receiver','comment','rating']
    });
    //create workbook & add worksheet to it
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Staff Ratings');

    //convert workbook to buffer - buffer is needed to create actual Excel file in browser
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

    // create blob and URL for downloading
    const blob = new Blob([excelBuffer], { type: EXCEL_TYPE });
    const url = window.URL.createObjectURL(blob);

    //download setup
    const a = document.createElement('a');
    a.href = url;
    a.download = 'staff_ratings_'+new Date().toDateString()+'.xlsx';
    document.body.appendChild(a);
    a.click();

    //clean up since a unique url is generated for each click
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
});

module.exports = {addCommentToDatabase, getUserFeedback, renderFeedback, fetchAssignment, fetchFeedback, fetchUsers, loadAllStaffDropDown, getManagerWhoAssignedTask, fetchTasks};