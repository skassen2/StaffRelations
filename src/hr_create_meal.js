const form = document.getElementById("mealForm");

// Function to handle form submission for creating a new meal
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const mealName = document.getElementById("mealName").value.trim();
    const mealDescription = document.getElementById("mealDescription").value.trim();
    const mealImageUrl = document.getElementById("mealImageUrl").value.trim();

    if (mealName === '' || mealDescription === '' || mealImageUrl === '') {
        alert("Please fill in all fields.");
        return;
    }

    try {
        const mealData = {
            meal_name: mealName,
            description: mealDescription,
            created_by: localStorage.getItem('username'), // Get the logged-in HR user
            meal_image_url: mealImageUrl
        };

        const response = await fetch('/data-api/rest/Meal_menu', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(mealData)
        });
        
        if (response.ok) {
            alert("Meal created successfully!");
            // Clear the form fields after successful submission
            form.reset();
            // Refresh meal list
            const meals = await getAllMeals();
            renderMeals(meals);
        } else {
            throw new Error('Failed to create meal.');
        }
    } catch (error) {
        //console.error('Error creating meal:', error);
        alert("An error occurred while creating the meal. Please try again later.");
    }
});

// Function to fetch all meals from the database
async function getAllMeals() {
        const response = await fetch('/data-api/rest/Meal_menu');
        const data = await response.json();
        return data.value;
}

// Function to render meals on the HTML page
function renderMeals(meals) {
    const mealList = document.getElementById("mealList");
    mealList.innerHTML = ""; // Clear previous content

    // Create a heading for meal options
    const heading = document.createElement("h2");
    heading.textContent = "Meal Options";
    mealList.appendChild(heading);

    // Create a container for meal items
    const mealContainer = document.createElement("section"); 
    mealContainer.classList.add("meal-container");

    meals.forEach(meal => {
        // Create a box for each meal
        const mealBox = document.createElement("section"); 
        mealBox.classList.add("meal-box");

        // Create elements for meal details
        const mealName = document.createElement("h3");
        mealName.textContent = meal.meal_name;

        const description = document.createElement("p");
        description.textContent = meal.description;

        const createdBy = document.createElement("p");
        createdBy.textContent = "Created by: " + meal.created_by;

        const mealImage = document.createElement("img");
        mealImage.src = meal.meal_image_url;
        mealImage.alt = meal.meal_name;
        mealImage.width = 200;

        // Append meal details to meal box
        mealBox.appendChild(mealName);
        mealBox.appendChild(description);
        mealBox.appendChild(createdBy);
        mealBox.appendChild(mealImage);

        // Append meal box to meal container
        mealContainer.appendChild(mealBox);
    });

    // Append meal container to meal list
    mealList.appendChild(mealContainer);
}

// Call the getAllMeals function when the DOM is loaded
//code changed to make testing easier
async function handleDOMContentLoaded() {
    try {
        const meals = await getAllMeals();
        renderMeals(meals);
    } catch (error) {
        alert(error.message);
    }
}
document.addEventListener("DOMContentLoaded", handleDOMContentLoaded);

//this function handles the delete
const resetbutton=document.getElementById('resetMeals');
resetbutton.addEventListener("click", async event=>{
    const orders=await fetchMealOrders();
    const menu=await getAllMeals();
    //delete orders
    const orderIds=[];
    for(const obj of orders){
        orderIds.push(obj.order_id);
    }
    for(const id of orderIds){
        const endpoint = '/data-api/rest/Meal_orders/order_id';
        const response = await fetch(`${endpoint}/${id}`, {
        method: "DELETE"
        });
    }
    //delete menu
    const menuIds=[];
    for(const obj of menu){
        menuIds.push(obj.meal_id);
    }
    for(const id of menuIds){
        const endpoint = '/data-api/rest/Meal_menu/meal_id';
        const response = await fetch(`${endpoint}/${id}`, {
        method: "DELETE"
        });
    }

    window.location.reload();

});
async function fetchMealOrders() {
    const endpoint = `/data-api/rest/Meal_orders`;
    const response = await fetch(endpoint);
    const tasks = await response.json();
    return tasks.value;
}



//export for testing
module.exports = {renderMeals, getAllMeals, handleDOMContentLoaded, fetchMealOrders}