
const checkLogin = require('../src/coverage-test');

test('testing that coverage report tool works using mock function, expect 1', () => {
    expect(checkLogin("skassen2", "ekse")).toBe(1);
});

test('testing that coverage report tool works using mock function, expect 0', () => {
    expect(checkLogin("skassen2", "eks")).toBe(0);
});
  
