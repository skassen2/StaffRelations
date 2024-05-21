const form = document.getElementById("mealForm");

// Function to fetch all meals from the database
async function getAllMeals() {
        const response = await fetch('/data-api/rest/Meal_menu');
        const data = await response.json();
        return data.value;

}

// Function to render meals on the HTML page
async function renderMeals(meals) {
    const mealList = document.getElementById("mealList");
    mealList.innerHTML = ""; // Clear previous content

    // Create a heading for meal options
    const heading = document.createElement("h2");
    heading.textContent = "Meal Options";
    mealList.appendChild(heading);

    // Create a container for meal items
    const mealContainer = document.createElement("section");
    mealContainer.classList.add("meal-container");

    // Fetch ordered meal IDs for the current user
    const userId = localStorage.getItem('username');
    const allOrderedMeals = await getOrderedMeals(userId);
    const orderedMeals = filterOrderedMealsByUsername(allOrderedMeals, userId);
    //console.log('Ordered meals:', orderedMeals);

    meals.forEach(meal => {
        const isOrdered = orderedMeals.some(orderedMeal => orderedMeal.meal_id === meal.meal_id);

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

        const blankLine = document.createElement("section");
        blankLine.style.height = "20px"; // Adjust the height as needed
        mealBox.appendChild(blankLine);

        // Create a button to order the meal
        if(isOrdered){
            mealBox.style.backgroundColor = "lightgrey";
            const ordered = document.createElement("p");
            ordered.textContent = "Meal Already Ordered";
            mealBox.appendChild(ordered);
        }
        else{
            const orderButton = document.createElement("button");
            orderButton.textContent = "Order";
            orderButton.classList.add("order-button");

            // Set the dataset attribute to store the meal ID
            orderButton.dataset.meal_id = meal.meal_id;

            mealBox.appendChild(orderButton);
        }

        // Append meal box to meal container
        mealContainer.appendChild(mealBox); 
    });

    // Append meal container to meal list
    mealList.appendChild(mealContainer);
}

// Call the getAllMeals function when the DOM is loaded
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const meals = await getAllMeals();
        renderMeals(meals);
    } catch (error) {
        //console.error('Error:', error.message);
        alert(error.message);
    }
});

// When the Order button is clicked, place the order
document.addEventListener("click", async (event) => {
    if (event.target && event.target.classList.contains("order-button")) {
        // Get the user ID from local storage and corresponding meal ID
        const user_id = localStorage.getItem('username');
        const meal_id = event.target.dataset.meal_id;
        console.log('Placing order for meal:', meal_id);

        // Place the order
        try {
            await placeOrder(meal_id, user_id);
            alert('Order placed successfully!');
        } catch (error) {
            alert(error.message);
        }

        const meals = await getAllMeals();
        renderMeals(meals);
    }
});

// Function to place an order for a meal
async function placeOrder(mealId, userId) {
        const response = await fetch('/data-api/rest/Meal_orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                meal_id: mealId,
                username: userId
            })
        });
        const data = await response.json();
        return data;

}

// Function to fetch ordered meals from the database
async function getOrderedMeals() {
        const response = await fetch(`/data-api/rest/Meal_orders`);
        const data = await response.json();
        return data.value;
}

// Function to filter ordered meals by username
function filterOrderedMealsByUsername(orderedMeals, username) {
    return orderedMeals.filter(meal => meal.username === username);
}


module.exports ={renderMeals, getAllMeals, placeOrder, getOrderedMeals, filterOrderedMealsByUsername};