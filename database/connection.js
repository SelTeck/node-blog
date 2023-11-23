import mariadb from "mariadb";
import { config } from "../config.js";

export const pool = mariadb.createPool({
    host: config.database.host, 
    port: config.database.port,
    user: config.database.user, 
    password: config.database.pw,
    database: config.database.db,
    testWhileIdle: true,
    validationQuery: 'SELECT 1 FROM dual',
    timeBetweenEvictionRunsMills: 60 * 60 * 1000,
    testOnBorrow: true, // 커넥션 풀에서 커넥션을 가져올 때 커넥션 유효 여부 확인 
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
