import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
const { Pool } = pg;

const dbCofig = new Pool({
  connectionString: process.env.DATABASE_URL,
});

if (process.env.MODE === "PROD") {
  dbCofig.ssl = {
    rejectUnauthorized: false,
  };
}
export const connection = dbCofig;
