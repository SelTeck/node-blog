
import db from "../database/connection.js"


export async function insertRss(title, summary, url, reg_date) {
    try {
        let query = 'INSERT IGNORE INTO Blog_Rss(' +
            'title' +
            ', synopsis' +
            ', url' +
            ', reg_date' +
            ') VALUES (?, ?, ?, ?)';
        return await db.execute(query, [title, summary, url, reg_date]);
        
    } catch (err) {
        throw err;
    } finally {
        if (db) db.release();
    }
}

export async function insertCrawling(diary, weather, getup, sleep_point, pain_min, pain_max, reg_date) {
    try {
        // let query = 'INSERT INTO Rss_Crawling (' +
        //     'weather' +
        //     ',getup_diary' +
        //     ',sleep_point' +
        //     ',pain_min' +
        //     ',pain_max' +
        //     ',reg_date' +
        //     ') VALUES (?, ?, ?, ?, ?, ?)';
        // + ' on duplicate key update reg_date = ?';

        return await db.execute('CALL USP_ADD_CRAWLING(?, ?, ?, ?, ?, ?, ?)', 
            [diary, weather, getup, sleep_point, pain_min, pain_max, reg_date]);
    } catch (error) {
        throw error;
    } finally {
        if (db) db.release();
    }
}

export async function insertCrawlingContent(diary, reg_date) {
    try {
        return await db.execute('CALL USP_ADD_CONTENT(?, ?)', [diary, reg_date]);
    } catch(error) {
        throw error;
    } finally {
        if (db) db.release();
    }
}

