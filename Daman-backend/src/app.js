import dotenv from "dotenv";
import express, { json, urlencoded } from "express";
import helmet from "helmet";
import cors from "cors";
import { createServer } from "http";

import dbConnect from "./db/connect.js";
import routes from "./routes/index.routes.js";

dotenv.config({ path: ".env" });
const PORT = process.env.PORT || 8000;
const app = express();

// Create HTTP server
const server = createServer(app);


app.use(json());
app.use(urlencoded({ extended: true }));
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN,
}));

app.get("/", (req, res) => {
  res.status(200).json({ status: 200, message: "API working!" });
});

app.use("/api/damanorganic", routes);

dbConnect();

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}.`);
});

export default app;