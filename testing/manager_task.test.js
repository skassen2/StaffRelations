require('jest-fetch-mock').enableFetchMocks();

beforeEach(() => {
    fetch.mockResponse(JSON.stringify());
    document.body.innerHTML = '';
});

describe('Functions from manager_task', () => {
    
});
