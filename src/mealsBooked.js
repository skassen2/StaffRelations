const mealsList = document.getElementById('mealsList');
const heading = document.getElementById('heading');

// Function to fetch all meals from the database in meal_menu table
async function getAllMeals() {
    try {
        const response = await fetch('/data-api/rest/Meal_menu');
        if (!response.ok) {
            throw new Error('Error fetching meals: ' + response.statusText);
        }
        const data = await response.json();
        if (!data.value || !Array.isArray(data.value)) {
            throw new Error('Meals data is not in the expected format.');
        }
        return data.value;
    } catch (error) {
        console.error('Error fetching meals:', error);
        throw new Error('An error occurred while fetching meals. Please try again later.');
    }
}

// Function to fetch all meals orders from the database in the meal_order table
async function getAllMealOrders() {
    try {
        const response = await fetch('/data-api/rest/Meal_orders');
        if (!response.ok) {
            throw new Error('Error fetching meal orders: ' + response.statusText);
        }
        const data = await response.json();
        if (!data.value || !Array.isArray(data.value)) {
            throw new Error('Meal orders data is not in the expected format.');
        }
        return data.value;
    } catch (error) {
        console.error('Error fetching meal orders:', error);
        throw new Error('An error occurred while fetching meal orders. Please try again later.');
    }
}

//takes in meal obects array and meal orders array from DB and filters out required fields from meal objects using the meal orders
function filterMealOrders(meals, mealOrders) {
    let filteredMeals = [];

    mealOrders.forEach(order => {
        let meal = meals.find(item => item.meal_id === order.meal_id);
        if (meal) {
            filteredMeals.push({
                meal_name: meal.meal_name,
                username: order.username,
                order_date: order.order_date,
                meal_image_url: meal.meal_image_url
            });
        }
    });
    return filteredMeals;
}

function renderMealList(filteredResults){
    // Create a container for meal booking items
    const mealContainer = document.createElement("section");
    mealContainer.classList.add("meal-container");

    // Create a heading for each meal booking
    const pageTitle = document.createElement("h1");
    pageTitle.classList.add("page-title");
    pageTitle.textContent = "Meal Bookings Page";
    heading.appendChild(pageTitle);

    filteredResults.forEach((meal, index) => {
        const mealBooking = document.createElement('block');
        mealBooking.classList.add("meal-booking");

        mealBooking.classList.add('meal-card');
        mealBooking.innerHTML = `
            <h3><u>${meal.meal_name}</u></h3>
            <p><Strong>Booked By: </Strong>${meal.username}</p>
            <p><Strong>Ordered On: </Strong>${meal.order_date}</p>
            <img src=${meal.meal_image_url} alt = ${meal.meal_name} width = 200>
        `;
        
        // Append meal booking to group of meal bookings
        mealContainer.appendChild(mealBooking);
    });
    mealsList.appendChild(mealContainer); //Appens group of meal bookings to page section
};

// Call the getAllMeals function when the DOM is loaded
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const meals = await getAllMeals();
        const orders = await getAllMealOrders();
        console.log('Meals data:', meals);
        console.log('Order Data:', orders);
        let filteredResults = filterMealOrders(meals, orders);
        console.log('Result:', filteredResults);
        renderMealList(filteredResults);
    } catch (error) {
        console.error('Error:', error.message);
        alert(error.message);
    }
});
