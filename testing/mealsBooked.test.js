require('jest-fetch-mock').enableFetchMocks();

beforeEach(() =>{
    global.alert = jest.fn();
});

describe('Test staff_order_meals', () =>{
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

    

});


