const carsList = document.getElementById('carsList');
const heading = document.getElementById('heading');

// Function to fetch all cars from the database in staff_cars table
async function getAllCars() {
    try {
        const response = await fetch('/data-api/rest/Staff_cars');
        const data = await response.json();
        return data.value;
    } catch (error) {
        //console.error('Error fetching meals:', error);
        throw new Error('An error occurred while fetching staff cars. Please try again later.');
    }
}

// Function to fetch all cars booked for car wash from the database in the car_wash table
async function getAllCarwashBookings() {
    try {
        const response = await fetch('/data-api/rest/Car_wash');
        const data = await response.json();
        return data.value;
    } catch (error) {
        //console.error('Error fetching meal orders:', error);
        throw new Error('An error occurred while fetching car wash bookings. Please try again later.');
    }
}

//Returns list of all cars booked for car wash in the car_wash table with details from the staff_cars table in the DB
function filterCarAndCarwash(cars, carwash) {
    // Create a map from the carwash array for quick lookup
    const carwashMap = new Map();
    carwash.forEach(item => carwashMap.set(item.car_id, item.slot));

    // Filter and merge the cars array based on the carwashMap
    return cars
        .filter(car => carwashMap.has(car.car_id))  // Filter cars present in carwashMap
        .map(car => ({  // Merge fields
            ...car,
            slot: carwashMap.get(car.car_id)
        }));
}

//Renders the page with the list of cars booked for car wash with its details onto the page
function renderCarsList(filteredResults){
    // Create a container for meal booking items
    const carContainer = document.createElement("section");
    carContainer.classList.add("meal-container");

    // Create a heading for each meal booking
    const pageTitle = document.createElement("h1");
    pageTitle.classList.add("page-title");
    pageTitle.textContent = "Cars Booked for Car Wash";
    //console.log(pageTitle.textContent);
    heading.appendChild(pageTitle);

    filteredResults.forEach((car, index) => {
        const carBooking = document.createElement('block');
        carBooking.classList.add("meal-booking");

        carBooking.classList.add('meal-card');
        carBooking.innerHTML = `
            <h3><u>${car.car_name}</u></h3>
            <p><Strong>Number Plate: </Strong>${car.number_plate}</p>
            <p><Strong>Booked By: </Strong>${car.username}</p>
            <p><Strong>Slot: </Strong>${car.slot}</p>
        `;
        
        // Append meal booking to group of meal bookings
        carContainer.appendChild(carBooking);
    });
    carsList.appendChild(carContainer); //Appens group of meal bookings to page section
};

// Call the renderCarList function when the DOM is loaded
document.addEventListener("DOMContentLoaded", async () => {
    try {
        const cars = await getAllCars();
        const carwash = await getAllCarwashBookings();
        let filteredResults = filterCarAndCarwash(cars, carwash)
        renderCarsList(filteredResults);
    } catch (error) {
        alert(error.message);
    }
});

module.exports = {getAllCars, getAllCarwashBookings, filterCarAndCarwash, renderCarsList}