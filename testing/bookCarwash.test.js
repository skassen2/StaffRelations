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
    '<section id="carsList" class="container"></section>'+
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
    const func = require('../src/bookCarwash.js');

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

    test('Test getCarByUsername returns the right car', () =>{
        expect(func.getCarsByUsername(cars, 'skassen2')).toStrictEqual([{car_id: 6, car_name: 'Mercedes-Benz CLA200', number_plate: 'SKA699GP', username: 'skassen2'}]);
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

    test('Test isCarInCarwash() returns true if the car is booked', () => {
        expect(func.isCarInCarwash(carsBooked, 4)).toBe(true);
    });

    test('Test isCarInCarwash() returns false if the car is not booked', () => {
        expect(func.isCarInCarwash(carsBooked, 7)).toBe(false);
    });

    test('Test getCarwashEntryById() returns the carwash entry', () => {
        expect(func.getCarwashEntryById(carsBooked, 4)).toStrictEqual({car_id: 4, slot: 'Wednesday'});
    });

    test('Test countCarwashesBySlot() returns the number of cars in the slot', () => {
        expect(func.countCarwashesBySlot(carsBooked, "Wednesday")).toBe(1);
    });

    test('Test filterCarAndCarwash() returns the right data', () => {
        expect(func.filterCarAndCarwash(cars, carsBooked)).toStrictEqual([
            {car_id: 4, car_name: 'BMW 320i', number_plate: 'KRC257GP', username: 'keren', slot: 'Wednesday'},
            {car_id: 5, car_name: 'Volkswagon Golf', number_plate: 'PRK911GP', username: 'prashant', slot: 'Friday'},
            {car_id: 6, car_name: 'Mercedes-Benz CLA200', number_plate: 'SKA699GP', username: 'skassen2', slot: 'Friday'}
          ]);
    });

    test('Test addCarwashBooking() posts the right data to the database', async () => {
        fetch.mockClear();
        const mockResponse = { status: 200, body: { message: 'Data posted successfully' } };
        fetch.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 });
        const data={
            car_id: 1,
            slot: 'Wednesday'
        }
        const endpoint = '/data-api/rest/Car_wash'; 
        return func.addCarwashBooking(1, 'Wednesday').then(response => {
            expect(fetch).toHaveBeenCalledWith(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
        });
    });

    test('Test DOMContentLoaded event listener does what is needed', async () => {
        fetch.resetMocks()
        fetch.mockResponseOnce(JSON.stringify({value: cars})).mockResponseOnce(JSON.stringify({value: carsBooked}))
        document.dispatchEvent(new Event('DOMContentLoaded', { bubbles: true }));
        await new Promise(process.nextTick); 
        expect(fetch).toHaveBeenCalledTimes(2);
        expect(fetch).toHaveBeenNthCalledWith(1, '/data-api/rest/Staff_cars');
        expect(fetch).toHaveBeenNthCalledWith(2, '/data-api/rest/Car_wash');
    });

    test('Test DOMContentLoaded event listener throws error when needed', async () => {
        fetch.resetMocks()
        fetch.mockRejectedValueOnce(new Error("error")).mockResponseOnce(JSON.stringify({value: carsBooked}))
        document.dispatchEvent(new Event('DOMContentLoaded', { bubbles: true }));
        await new Promise(process.nextTick); 
        expect(global.alert).toHaveBeenCalled();
        global.alert.mockClear();
    });

    /*test('Test that carsList event listener books car for slot on wednesday', async () => {
        func.car = [ {car_id: 7, car_name: 'Jeep Wrangler', number_plate: 'TAR125GP', username: 'taruna'}];
        const mockResponse = { status: 201, body: { message: 'Data posted successfully' } };
        fetch.mockResponseOnce(JSON.stringify(mockResponse), { status: 201 });
        document.body.innerHTML = '<main><section id="carsList" class="container"><section class="meal-container"><block class="meal-booking meal-card">'+
        '<h3><u>Jeep Wrangler</u></h3>'+
        '<p><Strong>Number Plate: TAR125GP</p>'+
        '<p><Strong>Available Slots:</Strong></p>'+
        '<button class="btn" id="Wednesday">Wednesday</button>'+
        '<button class="btn" id="Friday">Friday</button>'+
        '</block></section></section></main>';
        //const Button = document.querySelector('.btn#Wednesday');
        const Button = document.getElementsByClassName('btn')[0];
        Button.dispatchEvent(new Event('click', { bubbles: true }));
        await new Promise(process.nextTick);
        expect(global.alert).toHaveBeenCalledWith('Car wash booked successfully!');
    });*/
});



