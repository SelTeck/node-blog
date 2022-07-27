import { pool } from '../database/connection.js'

export async function getAll() {
    let res;
    let connection;
    try {
        connection = await pool.getConnection();
        let query = 'SELECT R.title as TITLE' +
            ', R.synopsis  as DAIRY' +
            ', R.url AS URL' +
            ', C.weather AS WEATHER' +
            ', C.sleep_point AS SP' +
            ', C.pain_min  AS PAIN_MIN' +
            ', C.pain_max AS PAIN_MAX' +
            ' FROM Blog_Rss R JOIN Rss_Crawling C' +
            ' WHERE R.reg_date = C.reg_date' +
            ' ORDER BY R.reg_date DESC';
        connection.execute(query).then((result) => {
            console.log(result.length);
        });
    } catch (error) {
        throw error;
    }

    if (connection) {
        connection.end();
    }

    // console.log(res);
    return res;
}

export async function getPaging(page, viewCount) {
    let connection;
    try {
        connection = pool.getConnection();
        let query = 'SELECT R.title as TITLE' +
            ', R.synopsis  as DAIRY' +
            ', R.url AS URL' +
            ', C.weather AS WEATHER' +
            ', C.sleep_point AS SP' +
            ', C.pain_min  AS PAIN_MIN' +
            ', C.pain_max AS PAIN_MAX' +
            ' FROM Blog_Rss R JOIN Rss_Crawling C' +
            ' WHERE R.reg_date = C.reg_date' +
            ' ORDER BY R.reg_date DESC' + 
            ' LIMIT ?, ?';    // offset, view_count
        return await connection.query(query, [page, viewCount]);

    } catch (error) {
        return error;
    }
}

