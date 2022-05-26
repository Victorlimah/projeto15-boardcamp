import cors from "cors";
import chalk from "chalk";
import dotenv from "dotenv";
import express, { json } from "express";

const App = express();
const PORT = process.env.PORT || 4000;
const MESSAGE = chalk.green(`Server is running on port ${PORT}`);

App.use(json());
App.use(cors());

App.listen(PORT, () => console.log(MESSAGE));
