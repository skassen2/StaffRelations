
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

describe('Test staff_order_meals', () =>{
    document.body.innerHTML = '<header>'+
    '<section id="heading" class="container"></section>'+
    '<nav class="navbar"><ul><li><a href="index.html">Logout</a></li></ul></nav>'+
    '<img src="images/logo1.png" id="logo" alt="Logo Image" width="120" height="125"></header>'+
    '<main>'+'<section id="mealsList" class="container"></section>'+'</main>';
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

    const func = require('../src/mealsBooked.js');

    test('Test that getAllMeals() returns the right data', async () =>{
        fetch.mockResponseOnce(JSON.stringify({value: meals}));
        const m = await func.getAllMeals();
        expect(m).toStrictEqual(meals)
    });
    test('Test that getAllMealOrders() returns the right data', async () => {
        fetch.mockResponseOnce(JSON.stringify({value: orders}));
        const o = await func.getAllMealOrders();
        expect(o).toStrictEqual(orders);
    });

    test('test that getAllMeals() throws error when needed', async () =>{
        fetchMock.mockRejectOnce();
        expect(async () => {
            await func.getAllMeals();
          }).rejects.toThrow();
    });

    test('test that getAllMealOrders() throws error when needed', async () =>{
        fetchMock.mockRejectOnce();
        expect(async () => {
            await func.getAllMealOrders();
          }).rejects.toThrow();
    });

    test('Test that ffilterMealOrders() returns the right orders for a Staff Member', () => {
        const list = func.filterMealOrders(meals, orders);
        expect(list).toStrictEqual([{
            meal_name: 'Grilled Salmon',
            username: 'prashant',
            order_date: '2024-05-06T12:19:56.687',
            meal_image_url: 'https://www.theseasonedmom.com/wp-content/uploads/2021/09/grilled-salmon-9.jpg'
          }]);
    });

    test('Test DOMContentLoaded eventListener', async () => {
        //setup
        fetch.resetMocks();
        fetch.mockResponseOnce(JSON.stringify({value: meals})).mockResponseOnce(JSON.stringify({value: orders}));
        //const createElementSpy = jest.spyOn(document, 'createElement');
        //test
        document.dispatchEvent(new Event('DOMContentLoaded'));
        await Promise.resolve();
        expect(fetch).toHaveBeenCalled();
    });

    test('Test DOMContentLoaded eventListener throws error when needed', async () => {
        //setup
        fetch.resetMocks();
        fetch.mockResponseOnce(JSON.stringify({}), { status: 500 });
        document.dispatchEvent(new Event('DOMContentLoaded'));
        await Promise.resolve();
        //if lines are covered then catch was reached
        expect(fetch).toHaveBeenCalled();
    });

    test('Test RenderMeals', async () => {
        //setup
        const createElementSpy = jest.spyOn(document, 'createElement');
        //test
        func.renderMealList([{
            meal_name: 'Grilled Salmon',
            username: 'prashant',
            order_date: '2024-05-06T12:19:56.687',
            meal_image_url: 'https://www.theseasonedmom.com/wp-content/uploads/2021/09/grilled-salmon-9.jpg'
        }]);
        expect(createElementSpy).toHaveBeenCalledWith("section");
        expect(createElementSpy).toHaveBeenCalledWith("h1");
        expect(createElementSpy).toHaveBeenCalledWith("block");
        expect(document.getElementsByClassName("page-title").length).toBeGreaterThan(0);
        expect(document.getElementsByClassName("page-title")[0].textContent).toBe("Welcome to the Meal Bookings Page");
        expect(document.getElementsByClassName("meal-container").length).toBeGreaterThan(0);
        createElementSpy.mockRestore();
    });


});


