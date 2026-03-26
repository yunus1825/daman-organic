import mongoose from "mongoose";
import {createDefaultAdminUser} from "../controllers/AdminUser.controller.js";



export default async () => {
  try {
    mongoose.set("strictQuery", false);
    console.log("DB_URI: ", process.env.DB_URI);
    const db = await mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Connected: MongoDb connected with ${db.connection.host}`);
    await createDefaultAdminUser();
    console.log("Default admin user checked/created successfully.");
   


  } catch (error) {
    console.error(`ERROR: Not able to connect to database due to ${error.message}`);
    throw new Error(`Database connection failed: ${error.message}`);
  }
};
