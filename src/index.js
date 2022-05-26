import cors from "cors";
import chalk from "chalk";
import dotenv from "dotenv";
import router from "./routes/index.js";
import express, { json } from "express";

const App = express();
dotenv.config();

const PORT = process.env.PORT || 4000;
const MESSAGE = chalk.green(`Server is running on port ${PORT}`);

App.use(json());
App.use(cors());

App.use(router);

App.listen(PORT, () => console.log(MESSAGE));
