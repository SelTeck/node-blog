import { pool } from "../database/connection.js";


export async function insertRss(title, summary, url, reg_date) {
    let rows;
    let connection;
    try {
        connection = await pool.getConnection();
        let query = 'INSERT IGNORE INTO Blog_Rss(' +
            'title' +
            ', synopsis' +
            ', url' +
            ', reg_date' +
            ') VALUES (?, ?, ?, ?)';
            rows = await connection.query(query, [title, summary, url, reg_date]);
    } catch (err) {
        throw err;
    }

    if (connection) {
        connection.end();
    }

    return rows;
}

export async function insertCrawling(weather, getup, sleep_point, pain_min, pain_max, reg_date) {
    let rows;
    let connection;
    try {
        connection = await pool.getConnection();
        let query = 'INSERT IGNORE INTO Rss_Crawling (' +
            'weather' +
            ',getup_diary' +
            ',sleep_point' +
            ',pain_min' +
            ',pain_max' +
            ',reg_date' +
            ') VALUES (?, ?, ?, ?, ?, ?)'; 
            // + ' on duplicate key update reg_date = ?';
        rows = await connection.query(query, [weather, getup, sleep_point, pain_min, pain_max, reg_date]);
    } catch (error) {
        throw error;
    }

    if (connection) {
        connection.end();
    }

    return rows;
}

