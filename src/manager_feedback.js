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

// Send staff their feedback, calls addCommentToDatabase
addComment2.addEventListener('submit',event=>{
    event.preventDefault();
    const receiver=document.getElementById("staffDrop").value;
    const topicOrtask=document.getElementById("topic").value;
    const comment=document.getElementById("comment").value;
    const sender = localStorage.getItem('username');
    addCommentToDatabase(topicOrtask,sender,receiver,comment);
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
async function addCommentToDatabase(task,sender,receiver,comment){
    const data={
        task:task,
        sender:sender,
        receiver:receiver,
        comment:comment
    }
    const endpoint = `/data-api/rest/Feedback`;
    //const endpoint = `/data-api/rest/Users`;
    const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
    });

    window.location.reload();
}

// Calculate average rating per staff-role
async function calculateAverageRating() {
    const feedbackData = await fetchFeedback();
    const filteredData = feedbackData.filter(entry => entry.rating !== "" && entry.rating !== -1);

    const ratingsData = {};

    filteredData.forEach(entry => {
        // filter only if receiver_role is "Staff" and leave it blank if it's empty
        if (entry.receiver_role === "Staff") {
            // initialise ratings array for each receiver
            if (!ratingsData[entry.receiver]) {
                ratingsData[entry.receiver] = [];
            }
            // add rating data into ratings array by pushing
            ratingsData[entry.receiver].push({
                rating: parseFloat(entry.rating),
                receiver_role: entry.receiver_role || '' 
            });
        }
    });
    // calc average ratings for each receiver
    const averageRatings = {};
    for (const receiver in ratingsData) {
        const ratings = ratingsData[receiver];
        const sum = ratings.reduce((acc, { rating }) => acc + rating, 0);
        const average = sum / ratings.length;
        if (!isNaN(average)) {// Check if average is NaN
            // Store average rating and receiver role for each receiver
            averageRatings[receiver] = {
                average_rating: average,
                receiver_role: ratings[0].receiver_role 
            };
        }
    }

    return averageRatings;
}
// create new Excel file
const excelFileBtn = document.getElementById("genExcelFile");
excelFileBtn.addEventListener('click', async (e) => {
    const averageRatings = await calculateAverageRating();
    // prep data for Excel
    const data = Object.keys(averageRatings).map(key => ({
        'Sent to': key,
        //'Role': averageRatings[key].receiver_role,
        'Overall Performance': averageRatings[key].average_rating
    }));
    //create worksheet
    const worksheet = XLSX.utils.json_to_sheet(data, {
        header: ['Sent to', /*'Role',*/ 'Overall Performance']
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
