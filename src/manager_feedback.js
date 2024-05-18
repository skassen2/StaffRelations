// Fetch data
async function fetchFeedback() {
    const endpoint = `/data-api/rest/Feedback`;
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

async function renderFeedback2(){
    const data=await fetchFeedback();
    const username = localStorage.getItem('username');
    const staffFeedback=getUserFeedback(username,data);

    const feedbackList=document.getElementById("allfeedback");
    feedbackList.innerHTML = '';
    staffFeedback.forEach((row, index) => {
        const task = document.createElement('block');
        task.classList.add('staff-card');
        task.innerHTML = `
            <p><b>Task:</b> ${row.task}</p>
            <p><b>Sender:</b> ${row.sender}</p>
            <p><b>Comment:</b> ${row.comment}</p>
        `;
        feedbackList.appendChild(task);
    });
}
renderFeedback2();

// Get user feedback function
function getUserFeedback(staff,json){
    data=[];
    for(const obj of json){
        if(obj.receiver==staff){
            data.push(obj);
        }
    }
    return data;
}

// Load all staff dropdown function
async function loadAllStaffDropDown(){
    const data=await fetchUsers();
    const dropdown=document.getElementById("staffDrop");
    
    // Add HR options
    const hrData = data.filter(obj => obj.role === "HR");
    hrData.forEach(hr => {
        const optionHR = document.createElement("option");
        optionHR.value = hr.username;
        optionHR.text = hr.username + " (HR)";
        dropdown.add(optionHR);
    });

    // Add staff options
    const staffData = data.filter(obj => obj.role === "Staff");
    staffData.forEach(staff => {
        const optionStaff = document.createElement("option");
        optionStaff.value = staff.username;
        optionStaff.text = staff.username;
        dropdown.add(optionStaff);
    });
}
loadAllStaffDropDown(); 
//adds staff to the dropdown for the excel form
async function loadJustStaffDropDown(){
    const data=await fetchUsers();
    const dropdown=document.getElementById("staffSelection");

    // Add staff options
    const staffData = data.filter(obj => obj.role === "Staff");
    staffData.forEach(staff => {
        const optionStaff = document.createElement("option");
        optionStaff.value = staff.username;
        optionStaff.text = staff.username;
        dropdown.add(optionStaff);
    });
}
loadJustStaffDropDown();

// Send staff their feedback, calls addCommentToDatabase
addComment2.addEventListener('submit', async event=>{
    event.preventDefault();
    const receiver=document.getElementById("staffDrop").value;
    const topicOrtask=document.getElementById("topic").value;
    const comment=document.getElementById("comment").value;
    const rating=document.getElementById("rating").value;
    const sender = localStorage.getItem('username');
    const sender_role = "Manager";
    const receiver_role=await getStaffRole(receiver);
    addCommentToDatabase(topicOrtask,sender,receiver,comment,sender_role,receiver_role,parseInt(rating));
})

// Send staff their feedback, calls addCommentToDatabase
// addComment.addEventListener('submit',event=>{
//     event.preventDefault();

//     const receiver=document.getElementById("staffDrop").value;
//     const topicOrtask=document.getElementById("topic").value;
//     const comment=document.getElementById("comment").value;
//     const sender = localStorage.getItem('username');
//     addCommentToDatabase(topicOrtask,sender,receiver,comment);
// })

// Add comment to database function
async function addCommentToDatabase(task,sender,receiver,comment,sender_role,receiver_role,rating){
    const data={
        task:task,
        sender:sender,
        receiver:receiver,
        comment:comment,
        sender_role:sender_role,
        receiver_role:receiver_role,
        rating:rating
    }
    const endpoint = `/data-api/rest/Feedback`;
    const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
    });

    window.location.reload();
}
async function getStaffRole(staff){
    let data=await fetchUsers();
    for(const obj of data){
        if(obj.username==staff){
            return obj.role;
        }
    }
}

// Creates a map of objects which will be used to create excel file
async function getExcelFeedback() {
    const staffmember=document.getElementById("staffSelection").value;
    const feedbackData = await fetchFeedback();
    const filteredData = feedbackData.filter(entry => entry.rating !=null && entry.rating !== -1 && entry.receiver_role=="Staff" && entry.sender_role=="Staff" && entry.receiver==staffmember);
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

module.exports = {addCommentToDatabase, getUserFeedback, loadAllStaffDropDown, renderFeedback2, fetchFeedback, fetchUsers};
