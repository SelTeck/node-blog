import mariadb from "mariadb";
import { config } from "../config.js";

export const pool = mariadb.createPool({
    host: config.database.host, 
    port: config.database.port,
    user: config.database.user, 
    password: config.database.pw,
    database: config.database.db,
    connectionLimit: 50
});

// module.exports = pool;
export const db = await pool.getConnection();

export function getConnection(callback) {
    pool.getConnection(function (err, conn) {
        if (!err) {
            callback(conn);
        } else {
            conn.release();
        }
    });
}
