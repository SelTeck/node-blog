
import { connection } from '../database/connection.js'
// import * as db from '../database/connection.js'

export async function getAll() {
    let rows;
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

    try {
        await connection.execute(query)
            .then((result) => {
                rows = result;
            });
        await connection.release();
        // console.log('------connection release');
        // console.log('------totalConnections', db.pool.totalConnections());
        // console.log('------activeConnections', db.pool.activeConnections());
        // console.log('------idleConnections', db.pool.idleConnections());
    } catch (error) {
        if (connection) await connection.release();
        throw error;
    }

    return rows;
}

export async function getPaging(page, viewCount) {

    let result;
    try {
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
        
        result = await connection.execute(query, [(page - 1), viewCount]);
        await connection.release();
    } catch (error) {
        if (connection) await connection.release();
        throw error;
    }

    return result;
}

