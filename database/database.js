import { pool } from "./connection.js";


export async function insertRss(title, summary, url, reg_date) {
    let connection;
    try {
        connection = await pool.getConnection();
        let query = 'insert into Blog_Rss(title, synopsis, url, reg_date) values (?, ?, ?, ?) on duplicate key update reg_date = ?';
        const row = await connection.query(query, [title, summary, url, reg_date, reg_date]);
    } catch(err) {
        throw err;
    } 

    if (connection) {
        connection.end();
    }
}

export async function insertCrawling(title, weather, getup, sleep_point, pain_diary, pain_min, pain_max, reg_date) {
    let connection;
    try {
        connection = await pool.getConnection();
        let query = 'insert into Rss_Crawling (' +
            'title' +
            ',weather' +
            ',getup_diary' +
            ',sleep_point' +
            ',pain_diary' +
            ',pain_min' +
            ',pain_max' +
            ',reg_date' +
          ') values (?, ?, ?, ?, ?, ?, ?, ?)' + 
          ' on duplicate key update reg_date = ?';
        connection.query(query, [title, weather, getup, sleep_point, pain_diary, pain_min, pain_max, reg_date, reg_date]);
    } catch (error) {
        throw error
    }

    if (connection) {
        connection.end();
    }
}