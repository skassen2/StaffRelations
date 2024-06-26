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
    // Prep data for Excel
    const data = Object.keys(getExcelFeedbackdata).map(key => ({
        task: getExcelFeedbackdata[key].task,
        sender: getExcelFeedbackdata[key].sender,
        receiver: getExcelFeedbackdata[key].receiver,
        comment: getExcelFeedbackdata[key].comment,
        rating: getExcelFeedbackdata[key].rating
    }));
    
    // Create a new workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Staff Ratings');
    
    // Add column headers
    worksheet.columns = [
        { header: 'Task', key: 'task' },
        { header: 'Sender', key: 'sender' },
        { header: 'Receiver', key: 'receiver' },
        { header: 'Comment', key: 'comment' },
        { header: 'Rating', key: 'rating' }
    ];
    
    // Add data to worksheet
    data.forEach(item => {
        worksheet.addRow(item);
    });
    
    // Prepare data for the chart
    const ratings = data.map(d => d.rating);
    const ratingCount = ratings.reduce((acc, rating) => {
        acc[rating] = (acc[rating] || 0) + 1;
        return acc;
    }, {});
    
    // Add chart data to worksheet
    worksheet.addRow([]);
    worksheet.addRow(['Rating', 'Count']);
    
    Object.entries(ratingCount).forEach(([rating, count]) => {
        worksheet.addRow([rating, count]);
    });
    
    // Calculate average rating per task
    worksheet.addRow([]);
    worksheet.addRow(['Task', 'Average Rating']);
    
    // Calculate average rating per task
    const taskGroups = data.reduce((acc, item) => {
        if (!acc[item.task]) {
            acc[item.task] = [];
        }
        acc[item.task].push(item.rating);
        return acc;
    }, {});
    
    Object.entries(taskGroups).forEach(([task, ratings]) => {
        const averageRating = ratings.reduce((acc, rating) => acc + rating, 0) / ratings.length;
        worksheet.addRow([task, averageRating]);
    });
    
    // Calculate average rating per sender per task
    worksheet.addRow([]);
    worksheet.addRow(['Sender', 'Task', 'Average Rating']);
    
    const senderTaskGroups = data.reduce((acc, item) => {
        const senderTask = `${item.sender}-${item.task}`;
        if (!acc[senderTask]) {
            acc[senderTask] = [];
        }
        acc[senderTask].push(item.rating);
        return acc;
    }, {});
    
    Object.entries(senderTaskGroups).forEach(([senderTask, ratings]) => {
        const [sender, task] = senderTask.split('-');
        const averageRating = ratings.reduce((acc, rating) => acc + rating, 0) / ratings.length;
        worksheet.addRow([sender, task, averageRating]);
    });
    
    // Create a buffer to generate the Excel file
    const buffer = await workbook.xlsx.writeBuffer();
    
    // Create a blob and URL for downloading
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
    const url = window.URL.createObjectURL(blob);
    
    // Download setup
    const a = document.createElement('a');
    a.href = url;
    a.download = `staff_ratings_${new Date().toISOString().split('T')[0]}.xlsx`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up since a unique URL is generated for each click
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    

});

module.exports = {addCommentToDatabase, getUserFeedback, loadAllStaffDropDown, renderFeedback2, fetchFeedback, fetchUsers, getStaffRole, getExcelFeedback};
