import { query } from "express";
import { pool } from "../database/connection.js";


export async function insertRss(title, summary, url, reg_date) {
    let rows;
    let connection;
    try {
        connection = await pool.getConnection();

        let query = 'CALL USP_ENTER_RSS(?, ?, ?, ?)'
        // let query = 'INSERT IGNORE INTO Blog_Rss(' +
        //     'title' +
        //     ', synopsis' +
        //     ', url' +
        //     ', reg_date' +
        //     ') VALUES (?, ?, ?, ?)';
        rows = await connection.execute(query, [title, summary, url, reg_date]);
        
    } catch (err) {
        throw err;
    }

    if (connection) {
        connection.release();
    }

    return rows;
}

export async function insertCrawling(diary, weather, getup, sleep_point, pain_min, pain_max, reg_date) {
    let rows;
    let connection;
    try {
        connection = await pool.getConnection();
        let query = 'CALL USP_ENTER_CRAWLING(?, ?, ?, ?, ?, ?, ?)'
        // let query = 'INSERT INTO Rss_Crawling (' +
        //     'weather' +
        //     ',getup_diary' +
        //     ',sleep_point' +
        //     ',pain_min' +
        //     ',pain_max' +
        //     ',reg_date' +
        //     ') VALUES (?, ?, ?, ?, ?, ?)';
        // + ' on duplicate key update reg_date = ?';

        rows = await connection.execute(query, [diary, weather, getup, sleep_point, pain_min, pain_max, reg_date]);
    } catch (error) {
        throw error;
    }

    if (connection) {
        connection.release();
    }

    return rows;
}

export async function insertCrawlingContent(diary, reg_date) {
    let rows;
    let connection;
    
    try {
        connection = await pool.getConnection();
        let query = 'CALL USP_ENTER_CONTENT(?, ?)';
        
        rows = await connection.execute(query, [diary, reg_date]);
        
    } catch(error) {
        throw error;
    }

    if (connection) {
        connection.release();
    }

    return rows;
}

