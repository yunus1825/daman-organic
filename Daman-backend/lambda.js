import awsServerlessExpress from 'aws-serverless-express';
import app from './src/app.js';
import dotenv from 'dotenv';
// import { updateDatabaseHandler } from './src/controllers/Products.controller.js';

// Load environment variables from .env file
dotenv.config();

const server = awsServerlessExpress.createServer(app);

export const handler = (event, context) => {
  awsServerlessExpress.proxy(server, event, context);
  
};
// export const scheduledTaskHandler = async (event, context) => {
//   await updateDatabaseHandler();
// };
