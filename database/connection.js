import mariadb from "mariadb";
import { config } from "../config.js";

export const pool = mariadb.createPool({
    host: config.database.host,
    port: config.database.port,
    user: config.database.user,
    password: config.database.pw,
    database: config.database.db,
    connectionLimit: 10,
    charset: 'utf8mb4'
});

export function getConnection(callback) {
    pool.getConnection(function (err, conn) {
        if (err) return callback(err, null);
        callback(null, conn);
    });
}

// async 기반 query
export async function query(sql, params) {
    let conn;
    try {
        conn = await pool.getConnection();
        return await conn.query(sql, params);
    } finally {
        if (conn) conn.release();
    }
}

// async 기반 execute
export async function execute(sql, params) {
    let conn;
    try {
        conn = await pool.getConnection();
        return await conn.execute(sql, params);
    } finally {
        if (conn) conn.release();
    }
}

// 트랜잭션
export async function transaction(callback) {
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.beginTransaction();

        const result = await callback(conn);

        await conn.commit();
        return result;
    } catch (err) {
        if (conn) await conn.rollback();
        throw err;
    } finally {
        if (conn) conn.release();
    }
}       


