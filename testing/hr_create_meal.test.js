//file receives 100% code coverage
//note however renderMeals() is not explicitly tested as it functions purely for front end set-up 
//all functions called within it have been tested
require('jest-fetch-mock').enableFetchMocks();
global.TextEncoder = require('util').TextEncoder;
global.TextDecoder = require('util').TextDecoder;
const {JSDOM} = require('jsdom');

// Create a JSDOM instance
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
// Set up global variables like document and window
global.document = dom.window.document;
global.window = dom.window;
beforeEach(() =>{
    global.alert = jest.fn();
});

describe('Test Functions from hr_create_meal.js', () => {
    localStorage.setItem('username', 'taruna' ); 
    localStorage.setItem('role', 'HR' );
    localStorage.setItem('name', 'Taruna' );
    localStorage.setItem('surname', 'Naidoo');
    document.body.innerHTML = 
        '<main>'+
        '<form id="mealForm">'+
        '<label for="mealName">Meal Name:</label>'+
        '<input type="text" id="mealName" name="mealName" required><br>'+
        '<label for="mealDescription">Description:</label>'+
        '<textarea id="mealDescription" name="mealDescription" rows="4" cols="50" required></textarea><br>'+
        '<label for="mealImageUrl">Image URL:</label>'+
        '<input type="url" id="mealImageUrl" name="mealImageUrl" required><br>'+
        '<button type="submit">Create Meal</button>'+
        '</form>'+
        '<section id="mealList" class="container"></section><button id="resetMeals">Reset All Meals</button>'+
        '</main>';

    const meals = [
        {meal_id: 1, meal_name: 'Grilled Salmon', description: 'Delicious grilled salmon served with vegetables and rice.', created_by: 'taruna', meal_image_url: 'https://www.theseasonedmom.com/wp-content/uploads/2021/09/grilled-salmon-9.jpg'},
        {meal_id: 2, meal_name: 'MealTest', description: 'Tester Meal', created_by: 'taruna', meal_image_url: 'https://promova.com/content/fast_food_names_d368a9810d.png'},
        {meal_id: 27, meal_name: 'Chicken Wrap', description: 'Grilled chicken, lettuce and spicy mayo in a toasted wrap', created_by: 'taruna', meal_image_url: 'https://www.eatingwell.com/thmb/k05OqmTGG6mpCHDOGA…do-wrap-3171-0a492188ea344e8aa5de503829c7399b.jpg'}
    ];
    const orders = [
        {order_id: 23, meal_id: 28, username: 'skassen2', order_date: '2024-05-06T12:11:22.020'},
        {order_id: 24, meal_id: 1, username: 'prashant', order_date: '2024-05-06T12:19:56.687'},
        {order_id: 25, meal_id: 28, username: 'prashant', order_date: '2024-05-06T12:19:58.473'}
    ];

    fetch.mockResponseOnce(JSON.stringify({value: meals}));
    const func = require('../src/hr_create_meal.js');

    test('Test that getMeals() returns the right data', async () =>{
        fetch.resetMocks();
        fetch.mockResponseOnce(JSON.stringify({value: meals}));
        const m = await func.getAllMeals();
        expect(m).toStrictEqual(meals)
    });

    test('Test that fetchMealOrders() returns the right data', async () =>{
        fetch.resetMocks();
        fetch.mockResponseOnce(JSON.stringify({value: orders}));
        const o = await func.fetchMealOrders();
        expect(o).toStrictEqual(orders)
    });

    test('Event listener returns alert when a field is empty ', async () => {
        document.getElementById("mealName").value = null ;
        document.getElementById("mealDescription").value = null;
        document.getElementById("mealImageUrl").value = null;
        const butn = document.getElementById("mealForm");
        const event = new Event('submit', { bubbles: true });
        butn.dispatchEvent(event);
        expect(global.alert).toHaveBeenCalledWith("Please fill in all fields.");
        global.alert.mockClear();

    });

    test('Event listener returns alert when a field is empty ', async () => {
        fetch.resetMocks();
        const mockResponse = { status: 201, body: { message: 'Data posted successfully' } };
        fetch.mockResponseOnce(JSON.stringify(mockResponse), { status: 201 }).mockResponseOnce(JSON.stringify({value: meals}));
        //setting values to post
        document.getElementById("mealName").value = 'Chicken Test' ;
        document.getElementById("mealDescription").value = 'Description';
        document.getElementById("mealImageUrl").value = 'https://meal.img';
        const butn = document.getElementById("mealForm");
        const event = new Event('submit', { bubbles: true });
        butn.dispatchEvent(event);
        const data = {
            meal_name: 'Chicken Test',
            description: 'Description',
            created_by: localStorage.getItem('username'), // Get the logged-in HR user
            meal_image_url: 'https://meal.img'
        };
        const endpoint = '/data-api/rest/Meal_menu';
        await Promise.resolve();
        expect(fetch).toHaveBeenCalledWith(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        expect(global.alert).toHaveBeenCalledWith("Meal created successfully!");
    });

    test('test that eventListener throws error when needed', async () =>{
        document.getElementById("mealName").value = 'Chicken Test' ;
        document.getElementById("mealDescription").value = 'Description';
        document.getElementById("mealImageUrl").value = 'https://meal.img';
        //fetch.mockRejectOnce();
        fetch.mockResponseOnce(JSON.stringify({}), { status: 500 });
        const butn = document.getElementById("mealForm");
        const event = new Event('submit', { bubbles: true });
        butn.dispatchEvent(event);
        await Promise.resolve()
        expect(global.alert).toHaveBeenCalledWith("An error occurred while creating the meal. Please try again later.");
        global.alert.mockClear();
    });

    test('test handleDOMContentLoaded for document', async () =>{
        fetch.resetMocks();
        fetch.mockResponseOnce(JSON.stringify({value: meals}));
        func.handleDOMContentLoaded();
        await Promise.resolve();
        expect(fetch).toHaveBeenCalledWith('/data-api/rest/Meal_menu');
        
    });

    //if lines are covered then it is cathing errors
    test('test eventListener for document throws error when needed', async () =>{
        fetch.resetMocks();
        fetch.mockResponseOnce(JSON.stringify({error: {message: "error"}}), { status: 500});
        func.handleDOMContentLoaded();
        await Promise.resolve();
        expect(fetch).toHaveBeenCalled();

    });

    test('Test that resetMeals event listener deletes all meals', async () => {
        fetch.resetMocks();
        fetch.mockResponseOnce(JSON.stringify({value: orders})).mockResponseOnce(JSON.stringify({value: meals}));
        Object.defineProperty(window, 'location', {
            value: {
              reload: jest.fn(),
            },
        });
        const btn = document.getElementById("resetMeals");
        const event = new Event('click', { bubbles: true });
        btn.dispatchEvent(event);
        await new Promise(process.nextTick); 
        expect(fetch).toHaveBeenCalledTimes(2+meals.length+orders.length);
        expect(window.location.reload).toHaveBeenCalled();
    });

});


