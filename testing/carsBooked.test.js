//file receives 100% coverage
//note renderCarList not explicitly tested as it sets up UI elements but function is called when testing event listeners

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

describe('Test functions from BookCarwash.js', () => {
    localStorage.setItem('username', 'prashant' ); 
    document.body.innerHTML = 
    '<header>'+
    '<section id="heading" class="container">'+
    '</section>'+
    '<nav class="navbar">'+
        '<ul>'+
           '<li><a href="index.html">Logout</a></li>'+
        '</ul>'+
    '</nav>'+
    '<img src="images/logo1.png" id="logo" alt="Logo Image" width="120" height="125">'+
    '</header>'+
    '<main>'+
    '<section id="carsList" class="container"><button id="resetCarWash">Reset Car Wash</button></section>'+
    '</main>';

    const cars = [
        {car_id: 1, car_name: 'Audi A5', number_plate: 'JDM234GP', username: 'jaedon'},
        {car_id: 2, car_name: 'Lexus IS250', number_plate: 'ANG777GP', username: 'angie'},
        {car_id: 3, car_name: 'Ford Ranger', number_plate: 'XYZ123GP', username: 'dummy'},
        {car_id: 4, car_name: 'BMW 320i', number_plate: 'KRC257GP', username: 'keren'},
        {car_id: 5, car_name: 'Volkswagon Golf', number_plate: 'PRK911GP', username: 'prashant'},
        {car_id: 6, car_name: 'Mercedes-Benz CLA200', number_plate: 'SKA699GP', username: 'skassen2'},
        {car_id: 7, car_name: 'Jeep Wrangler', number_plate: 'TAR125GP', username: 'taruna'}
    ];

    const carsBooked = [    
        {car_id: 4, slot: 'Wednesday'},
        {car_id: 5, slot: 'Friday'},
        {car_id: 6, slot: 'Friday'}
    ];

    fetch.mockResponseOnce(JSON.stringify({value: cars})).mockResponseOnce(JSON.stringify({value: carsBooked}));
    const func = require('../src/carsBooked.js');

    test('Test getAllCars() returns the right data', async () => {
        fetch.mockResponseOnce(JSON.stringify({value: cars}));
        const carsReturned = await func.getAllCars();
        expect(carsReturned).toStrictEqual(cars);
    });

    test('test that getAllCars() throws error when needed', async () =>{
        fetch.resetMocks();
        fetch.mockRejectOnce(new Error('Failed to fetch'));
        await expect(func.getAllCars()).rejects.toThrow('An error occurred while fetching staff cars. Please try again later.');
    });

    test('Test getAllCarwashBookings() returns the right data', async () => {
        fetch.mockResponseOnce(JSON.stringify({value: carsBooked}));
        const carsReturned = await func.getAllCarwashBookings();
        expect(carsReturned).toStrictEqual(carsBooked);
    });

    test('test that getAllCarwashBookings() throws error when needed', async () =>{
        fetch.resetMocks();
        fetch.mockRejectOnce(new Error('Failed to fetch'));
        await expect(func.getAllCarwashBookings()).rejects.toThrow('An error occurred while fetching car wash bookings. Please try again later.');
    });
    
    test('Test filterCarAndCarwash() returns the right data', () => {
        expect(func.filterCarAndCarwash(cars, carsBooked)).toStrictEqual([
            {car_id: 4, car_name: 'BMW 320i', number_plate: 'KRC257GP', username: 'keren', slot: 'Wednesday'},
            {car_id: 5, car_name: 'Volkswagon Golf', number_plate: 'PRK911GP', username: 'prashant', slot: 'Friday'},
            {car_id: 6, car_name: 'Mercedes-Benz CLA200', number_plate: 'SKA699GP', username: 'skassen2', slot: 'Friday'}
          ]);
    });

    test('Test that DOMContentLoaded event listener loads content', async () => {
        fetch.mockClear();
        fetch.mockResponseOnce(JSON.stringify({value: cars})).mockResponseOnce(JSON.stringify({value: carsBooked}));
        const butn = document;
        const event = new Event('DOMContentLoaded', { bubbles: true });
        butn.dispatchEvent(event);
        await Promise.resolve();
        expect(fetch).toHaveBeenCalled();
    });

    test('Test that DOMContentLoaded event listener loads content and throws error when needed', async () => {
        fetch.resetMocks();
        fetch.mockRejectOnce(new Error({error: 'Failed to fetch'}));
        const butn = document;
        const event = new Event('DOMContentLoaded', { bubbles: true });
        butn.dispatchEvent(event);
        expect(fetch).toHaveBeenCalled();
    });

    test('Test that resetCarWash event listener deletes all car wash bookings', async () => {
        fetch.resetMocks();
        fetch.mockResponseOnce(JSON.stringify({value: carsBooked}));
        Object.defineProperty(window, 'location', {
            value: {
              reload: jest.fn(),
            },
        });
        const btn = document.getElementById("resetCarWash");
        const event = new Event('click', { bubbles: true });
        btn.dispatchEvent(event);
        await new Promise(process.nextTick); 
        expect(fetch).toHaveBeenCalledTimes(1+carsBooked.length);
        expect(window.location.reload).toHaveBeenCalled();
    });
});
