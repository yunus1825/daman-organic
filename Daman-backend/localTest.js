import { handler } from './lambda.js';

const event = {}; // Simulate an API Gateway event
const context = {}; // Simulate a Lambda context

handler(event, context).then(response => {
  console.log(response);
}).catch(error => {
  console.error(error);
});
