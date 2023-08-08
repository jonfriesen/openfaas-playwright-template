const handler = require('./handler');

const event = {
  body: {
    uri: "https://jonfriesen.ca" // You can change this to any URL you want to fetch
  }
};

const context = {
  status: (code) => ({
    succeed: (result) => {
      console.log(`Status Code: ${code}, Result:`, result);
      return result;
    }
  })
};

(async () => {
  try {
    await handler(event, context);
  } catch (error) {
    console.error('Error occurred:', error);
  }
})();
