require('jest-fetch-mock').enableFetchMocks();

describe('Test Functions from hr_create_meal.js', () => {
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
        '<section id="mealList" class="container"></section>'+
        '</main>';

    const meals = [
        {meal_id: 1, meal_name: 'Grilled Salmon', description: 'Delicious grilled salmon served with vegetables and rice.', created_by: 'taruna', meal_image_url: 'https://www.theseasonedmom.com/wp-content/uploads/2021/09/grilled-salmon-9.jpg'},
        {meal_id: 2, meal_name: 'MealTest', description: 'Tester Meal', created_by: 'taruna', meal_image_url: 'https://promova.com/content/fast_food_names_d368a9810d.png'},
        {meal_id: 27, meal_name: 'Chicken Wrap', description: 'Grilled chicken, lettuce and spicy mayo in a toasted wrap', created_by: 'taruna', meal_image_url: 'https://www.eatingwell.com/thmb/k05OqmTGG6mpCHDOGA…do-wrap-3171-0a492188ea344e8aa5de503829c7399b.jpg'}
    ];
    fetch.mockResponseOnce(JSON.stringify({value: meals}));
    const func = require('../src/hr_create_meal.js');

    test('Test that getMeals() returns the right data', async () =>{
        fetch.mockResponseOnce(JSON.stringify({value: meals}));
        const m = await func.getAllMeals();
        expect(m).toStrictEqual(meals)
    });


});


