const carsList = document.getElementById('carsList');
const heading = document.getElementById('heading');
const username = localStorage.getItem('username');

let cars, carwash, car, isBooked, carBooking;//global variables stores values of the result of functions getting the right information from data stored locally
let slot1 = "Wednesday"; //used in function counting number of cars booked for this day
let slot2 = "Friday";
let wednesdayCount, fridayCount;

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

//Function to fetch car from database in staff_cars table for the particular username
function getCarsByUsername(cars, username) {
    return cars.filter(car => car.username === username);
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

// Function checks if car is booked for car wash
function isCarInCarwash(carwash, id) {
    return carwash.some(entry => entry.car_id === id);
}

//Function returns entry from car_wash table in DB for the users car
function getCarwashEntryById(carwash, id) {
    return carwash.find(entry => entry.car_id === id);
}

//Returns car entries from staff_cars table that are booked for car wash
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

//Function checks number of cars booked for a given slot
function countCarwashesBySlot(carwashData, slot) {
    // Filter the carwashData to include only objects with the specified slot
    const filteredCarwashes = carwashData.filter(carwash => carwash.slot === slot);
    // Return the number of objects with the specified slot
    return filteredCarwashes.length;
}

//Function renders the users car with its details and gives them options to book a slot if available or shows they already booked
function renderCarsList(filteredResults, isBooked, myCarBooking){
    // Create a container for meal booking items
    const carContainer = document.createElement("section");
    carContainer.classList.add("meal-container");

    // Create a heading for each meal booking
    const pageTitle = document.createElement("h1");
    pageTitle.classList.add("page-title");
    pageTitle.textContent = "Welcome to the Carwash Booking Page";
    //console.log(pageTitle.textContent);
    heading.appendChild(pageTitle);

    filteredResults.forEach((car, index) => {
        const CarBooking = document.createElement('block');
        CarBooking.classList.add("meal-booking");

        CarBooking.classList.add('meal-card');
        
        if(isBooked){        
            CarBooking.innerHTML = `
                <h3><u>${car.car_name}</u></h3>
                <p><Strong>Number Plate: </Strong>${car.number_plate}</p>
                <p><Strong>Your car is booked for: </Strong>${myCarBooking.slot}</p>
            `;
        }

        else if(wednesdayCount > 2 && fridayCount > 2){
            CarBooking.innerHTML = `
                <h3><u>${car.car_name}</u></h3>
                <p><Strong>Number Plate: </Strong>${car.number_plate}</p>
                <p><Strong>Available Slots:</Strong></p>
                <p>No Available Slots!</p>
            `;
        }
        
        else if(wednesdayCount > 2){
            CarBooking.innerHTML = `
                <h3><u>${car.car_name}</u></h3>
                <p><Strong>Number Plate: </Strong>${car.number_plate}</p>
                <p><Strong>Available Slots:</Strong></p>
                <button class="btn" id="Friday">Friday</button>
            `;
        }

        else if(fridayCount > 2){
            CarBooking.innerHTML = `
                <h3><u>${car.car_name}</u></h3>
                <p><Strong>Number Plate: </Strong>${car.number_plate}</p>
                <p><Strong>Available Slots:</Strong></p>
                <button class="btn" id="Wednesday">Wednesday</button>
            `;
        }

        else{
            CarBooking.innerHTML = `
                <h3><u>${car.car_name}</u></h3>
                <p><Strong>Number Plate: </Strong>${car.number_plate}</p>
                <p><Strong>Available Slots:</Strong></p>
                <button class="btn" id="Wednesday">Wednesday</button>
                <button class="btn" id="Friday">Friday</button>
            `;
        }
        
        // Appends car with details and booking options to page container
        carContainer.appendChild(CarBooking);
    });
    carsList.appendChild(carContainer); //Appends container to page
};

//Function allows users booking to be succesfully submitted and recorded in the car_wash table in the DB for a slot based on the button clicked
carsList.addEventListener('click', async event => {
    //console.log('made it into event listener');
    if(event.target.id == slot1){
        // Book for wednesday
        try {
            await addCarwashBooking(car[0].car_id, slot1);
            alert('Car wash booked successfully!');
        } catch (error) {
            alert(error.message);
        }
        location.reload();
    }
    if(event.target.id == slot2){
        // Book for friday
        try {
            await addCarwashBooking(car[0].car_id, slot2);
            alert('Car wash booked successfully!');
        } catch (error) {
            alert(error.message);
        }
        location.reload();
    }
});

// Function to place booking for carwash
async function addCarwashBooking(carId, Slot) {
    const response = await fetch('/data-api/rest/Car_wash', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            car_id: carId,
            slot: Slot
        })
    });
    const data = await response.json();
    
    return data;

}

// Call the renderCarList function when the DOM is loaded
document.addEventListener("DOMContentLoaded", async () => {
    try {
        cars = await getAllCars();
        carwash = await getAllCarwashBookings();
        car = await getCarsByUsername(cars, username);
        wednesdayCount = await countCarwashesBySlot(carwash, slot1);
        fridayCount = await countCarwashesBySlot(carwash, slot2);
        isBooked = isCarInCarwash(carwash, car[0].car_id);
        carBooking = getCarwashEntryById(carwash, car[0].car_id);
        renderCarsList(car, isBooked, carBooking);
    } catch (error) {
        alert("Your car is not on the system, contact HR to add if you would like to add it.");
    }
});

module.exports = {getAllCars, getAllCarwashBookings, filterCarAndCarwash, renderCarsList, getCarsByUsername, isCarInCarwash, getCarwashEntryById, addCarwashBooking,countCarwashesBySlot}