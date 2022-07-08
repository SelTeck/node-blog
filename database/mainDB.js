import mariadb from "mariadb";
import { config } from "../config.js";

const pool = mariadb.createPool({
    host: config.database.host, 
    port: config.database.port,
    user: config.database.user, 
    password: config.database.pw,
    // database:
    connectionLimit: 5000
});

module.exports = pool;
