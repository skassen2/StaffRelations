
const gR = require('../src/index');

test('testing that checkLogin returns 1, test need not work for sprint 1, this is to test if code coverage report tool is working', async () => {
    const data = await gR.checkLogin('skassen2', 'ekse');
    expect(data).toBe(1);
});
  
