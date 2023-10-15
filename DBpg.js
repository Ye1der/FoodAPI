import pkg from 'pg'
import { DBPort, DBName, host, password, user } from './config.js';
const {Pool} = pkg;

export const pool = new Pool({
  user: user,
  host: host,
  database: DBName,
  password: password,
  port: DBPort
})