import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pg;

if(process.env.MODE === "PROD"){
  databaseConfig.ssl = {
    rejectUnauthorized: false
  }
}

export const connection = new Pool({
  connectionString: process.env.DATABASE_URL,
});
