import mysql, {PoolOptions} from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config({path: path.resolve(__dirname, '../.env')});

const mysqlEnv: PoolOptions = {
  host: process.env.mysql_host,
  user: process.env.mysql_user,
  password: process.env.mysql_password,
  database: process.env.mysql_database,
  multipleStatements: true,
};

const pool = mysql.createPool(mysqlEnv);

export {pool};
