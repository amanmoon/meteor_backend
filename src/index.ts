import express from "express";

import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import connectDB from "./db.connect";

const app = express();

// MIddlewares
app.use(
  cors({
    credentials: true,
  })
);
app.use(compression()); // compress res for faster http res
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);
const PORT = 8080;
const URL =
  "mongodb+srv://user:user@meteordb.3mmiy63.mongodb.net/?retryWrites=false&w=majority";

server.listen(PORT, () => {
  console.log(`METEOR running on server http://localhost:${PORT}/`);
});

// connect to mongoDB database
connectDB(URL);