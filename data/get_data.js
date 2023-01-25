

import { connection } from '../database/connection.js'

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
            ', R.reg_date AS REG_DATE' +
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

export async function getPainAverage(day) {
    let result;
    try {
        let query = 'SELECT' + 
        ' (AVG(pain_min) + AVG(pain_max)) / 2 AS pain' +
        ' FROM Rss_Crawling ORDER BY reg_date DESC LIMIT 0, ?' ;
        
        result = await connection.execute(query, day);
        await connection.release();
    } catch (error) {
        if (connection) await connection.release();
        throw error;
    }
    
    return result;
}

