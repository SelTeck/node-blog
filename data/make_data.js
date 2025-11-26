import { query } from "../database/connection.js";


export async function insertRss(title, summary, url, reg_date) {
    let sql = 'INSERT IGNORE INTO Blog_Rss(' +
            'title' +
            ', synopsis' +
            ', url' +
            ', reg_date' +
            ') VALUES (?, ?, ?, ?)';

    return await query(sql, [title, summary, url, reg_date]);
}

export async function insertCrawling(diary, weather, getup, sleep_point, pain_min, pain_max, reg_date) {
    return await query('CALL USP_ADD_CRAWLING(?, ?, ?, ?, ?, ?, ?)', 
            [diary, weather, getup, sleep_point, pain_min, pain_max, reg_date]);
}

export async function insertCrawlingContent(diary, reg_date) {
    return await query('CALL USP_ADD_CONTENT(?, ?)', [diary, reg_date]);
}

