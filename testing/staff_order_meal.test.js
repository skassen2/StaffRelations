require('jest-fetch-mock').enableFetchMocks();

beforeEach(() =>{
    global.alert = jest.fn();
});

describe('Test staff_order_meals', () =>{
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

    test('Test placeOrder()', async () => {
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

});


