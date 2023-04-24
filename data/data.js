
import { db } from '../database/connection.js'

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
        await db.execute(query)
            .then((result) => {
                rows = result;
            });
        await db.release();

    } catch (error) {
            if (db) await db.release();
            throw error;
    }

    return rows;
}

export async function getRssList(page, viewCount) {

    let result;
    try {
        let query = 'SELECT * ' + 
            ' FROM Blog_Rss' +
            ' ORDER BY reg_date DESC' +
            ' LIMIT ?, ?';    // offset, view_count
        
        result = await db.execute(query, [(page - 1), viewCount]);
        await db.release();
    } catch (error) {
        if (db) await db.release();
        throw error;
    }

    return result;
}

export async function getContent(rssIndex) {
    let result;

    try{
        let query = 'SELECT Content FROM Rss_Content WHERE Rss_Idx = ?';

        result = await db.execute(query, [rssIndex]);
        await db.release();
    } catch(error) {
        if (db) db.release();
        throw error;
    }

    return result;
}

export async function getPainInfor(day) {
    let result;
    try {
        let query = 'SELECT' + 
        ' Min(pain_min) AS PAIN_MIN' + 
        ', Max(pain_max) AS PAIN_MAX' + 
        ', (AVG(pain_min) + AVG(pain_max)) / 2 AS PAIN_AVG' +
        ' FROM Rss_Crawling ORDER BY reg_date DESC LIMIT 0, ?' ;
        
        result = await db.execute(query, [day]);
        await db.release();
    } catch (error) {
        if (db) await db.release();
        throw error;
    }
    
    return result;
}

