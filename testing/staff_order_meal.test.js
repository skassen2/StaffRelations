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

describe('Test staff_order_meals.js', () =>{
    localStorage.setItem('username', 'skassen2' ); 
    localStorage.setItem('role', 'Staff' );
    localStorage.setItem('name', 'Shaneel' );
    localStorage.setItem('surname', 'Kassen' );
    document.body.innerHTML = '<main>'+'<section id="mealList" class="container"></section>'+'</main>';
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

    fetch.mockResponseOnce(JSON.stringify({value: meals})).mockResponseOnce(JSON.stringify({value: orders}));
    const func = require('../src/staff_order_meal.js');

    test('Test that getAllMeals() returns the right data', async () =>{
        fetch.mockResponseOnce(JSON.stringify({value: meals}));
        const m = await func.getAllMeals();
        expect(m).toStrictEqual(meals)
    });
    test('Test that getOrderedMeals() returns the right data', async () => {
        fetch.mockResponseOnce(JSON.stringify({value: orders}));
        const o = await func.getOrderedMeals();
        expect(o).toStrictEqual(orders);
    });

    test('Test that filterOrderedMealsByUsername returns the right orders for a Staff Member', () => {
        const list = func.filterOrderedMealsByUsername(orders, 'skassen2');
        expect(list).toStrictEqual([{order_id: 23, meal_id: 28, username: 'skassen2', order_date: '2024-05-06T12:11:22.020'}]);
    });

    test('Test placeOrder() sends the right data to be inserted in the meal_orders table', async () => {
        // Mock a response expected from server
        const mockResponse = { status: 201, body: { message: 'Data posted successfully' } };
        fetch.mockResponseOnce(JSON.stringify(mockResponse), { status: 201 });
        const data={
            meal_id: 20,
            username: 'skassen2'
        }
        const endpoint = '/data-api/rest/Meal_orders'; 
        const mealOrd = func.placeOrder(20, 'skassen2');
    
        expect(fetch).toHaveBeenCalledWith(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        expect(mealOrd).toBeDefined();
    });

    test('Test RenderMeals() does generates cards with information, this test is for meal that is ordered', async () => {
        //change test conditions
        localStorage.setItem('username', 'prashant' ); 
        localStorage.setItem('role', 'Staff' );
        localStorage.setItem('name', 'Prashant' );
        localStorage.setItem('surname', 'Kessa' );
        const createElementSpy = jest.spyOn(document, 'createElement');
        fetch.mockResponseOnce(JSON.stringify({value: orders}));
        //only pass 1 meal so that loops only run once to test functionality
        return func.renderMeals(meals)
        .then(response => {
            expect(document.getElementsByTagName("h2")[0].textContent).toBe("Meal Options");
            expect(document.getElementsByTagName("h3")[0].textContent).toBe("Grilled Salmon");
            expect(document.getElementsByTagName("p")[0].textContent).toBe("Delicious grilled salmon served with vegetables and rice.");
            expect(document.getElementsByTagName("p")[1].textContent).toBe("Created by: taruna");
            expect(document.getElementsByTagName("img")[0].src).toBe('https://www.theseasonedmom.com/wp-content/uploads/2021/09/grilled-salmon-9.jpg');
            expect(document.getElementsByTagName("p")[2].textContent).toBe("Meal Already Ordered");
            expect(document.getElementsByTagName("button")[0].textContent).toBe("Order"); 
            createElementSpy.mockRestore();
        });
       
    });
    
    test('Test DOMContentLoaded eventListener code runs and database fetch occurs', async () => {
        //setup
        fetch.resetMocks();
        fetch.mockResponseOnce(JSON.stringify({value: meals})).mockResponseOnce(JSON.stringify({value: orders}));
        //test
        document.dispatchEvent(new Event('DOMContentLoaded'));
        await Promise.resolve();
        expect(fetch).toHaveBeenCalledWith('/data-api/rest/Meal_menu');
    });

    test('Test DOMContentLoaded eventListener throws error when needed', async () => {
        //setup
        fetch.resetMocks();
        fetch.mockResponseOnce(new Error({message: 'Failed to fetch data'}));
        fetch.mockRejectOnce()
        document.dispatchEvent(new Event('DOMContentLoaded'));
       
        expect(fetch).toHaveBeenCalled();
        //if lines are covered then catch was reached
        
    });

    /*test('Test DOMContentLoaded "click" eventListener', async () => {
        //setup
        const orderButton = document.createElement("button");
        orderButton.textContent = "Order";
        orderButton.classList.add("order-button"); 
        orderButton.dataset.meal_id = 1;  
        document.getElementById("mealList").appendChild(orderButton);  
        const mockEvent =new Event('click');
        const mockTarget = {
            classList: {
                contains: jest.fn()
            },
            dataset: {
                meal_id: 'meal1'
            }
        };
        Object.defineProperty(mockEvent, 'target', {
            writable: true,
            value: mockTarget
        });
       
        fetch.mockClear();
        fetch.mockResponseOnce(JSON.stringify({value: meals})).mockResponseOnce(JSON.stringify({value: meals}));
        //test
        document.dispatchEvent(mockEvent);
        orderButton.click();
        await Promise.resolve();
        expect(fetch).toHaveBeenCalledWith('/data-api/rest/Meal_menu');
        expect(global.alert).toHaveBeenCalledWith("Order placed successfully!");
        global.alert.mockClear();
    });*/

});


