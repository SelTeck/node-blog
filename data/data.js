
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
      
    } catch (error) {
        if (db) await db.release();
        throw error;
    }

    if (db) await db.release();

    return rows;
}

export async function getRssList(page, viewCount) {
    let result;
    try {
        let query = 'SELECT ' +
            ' idx' +
            ', title ' +
            ', synopsis ' +
            ', url ' +
            ', DATE_FORMAT(reg_date, \'%Y-%m-%d\') AS createAtTime' +
            ' FROM Blog_Rss' +
            ' ORDER BY reg_date DESC' +
            ' LIMIT ?, ?';    // offset, view_count

        result = await db.execute(query, [(page - 1) * viewCount, viewCount]);
        
    } catch (error) {
        if (db) await db.release();
        throw error;
    }

    if (db) await db.release();

    return result;
}

export async function getContent(rss_index) {
    let result;

    try {
        let query = `SELECT * FROM Rss_Content WHERE Rss_Idx = ?`;

        result = await db.execute(query, rss_index);
        
    } catch (error) {
        if (db) db.release();
        throw error;
    }

    if (db) await db.release();

    return result;
}

export async function getPainInfo(day) {
    let result;
    try {
        let query = 'SELECT' +
            ' Min(pain_min) AS PAIN_MIN' +
            ', Max(pain_max) AS PAIN_MAX' +
            ', (AVG(pain_min) + AVG(pain_max)) / 2 AS PAIN_AVG' +
            ' FROM Rss_Crawling ORDER BY reg_date DESC LIMIT 0, ?';

        result = await db.execute(query, [day]);
        
    } catch (error) {
        if (db) await db.release();
        throw error;
    }

    if (db) await db.release();

    return result;
}

export async function inputDailyEvent(crawlingIdx, takeMorning, takeEvening, antiAnalgesic, narcoticAnalgesic, usePath,
    activeMode, sleepMode, chargingStimulus, createAtTime) {
    let rows;
    try {
        let query = 'CALL USP_ADD_DAILY_EVENT(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        rows = await db.execute(query, [crawlingIdx, takeMorning, takeEvening, antiAnalgesic, narcoticAnalgesic, usePath,
            activeMode, sleepMode, chargingStimulus, createAtTime]);
    } catch (error) {
        if (db) await db.release();
        throw error;
    }

    if (db) await db.release();

    return rows;
}

export async function inputStimulusInfo(type, upright, lyingFront, lyingBack,lyingLeft, lyingRight, reclining) {
    let rows;
   
    try {
        let query = "INSERT INTO StimulusType (" + 
           "type" +
           ", upright" +
           ", lying_Front" +
           ", lying_Back" +
           ", lying_Left" +
           ", lying_Right" +
           ", reclining" +
           ", createAtTime" + 
        ") VALUES (" + 
            "?, ?, ?, ?, ?, ?, ?, NOW()"+  
        ")";

        rows = await db.execute(query, [type, upright, lyingFront, lyingBack, lyingLeft, lyingRight, reclining]);
       
    } catch (error) {
        if (db) await db.release();
        throw error;
    }

    if (db) await db.release();

    return rows;
}

export async function getStimulusInfo() {
    let rows;
    try {
        let query = "SELECT type, \`index\`, createAtTime " +  
        "FROM StimulusType " + 
        "WHERE (type, createAtTime) " +  
        "IN (" + 
            "SELECT type, max(createAtTime) " +
                "FROM StimulusType " +
                "GROUP BY type" + 
           ") " +
        "ORDER BY type";

        rows = db.execute(query);
    } catch (error) {
        if (db) db.release();
        throw error;
    }

    if (db) db.release();
    
    return rows;
}

export async function updateStimulusInfo(crawlingIndex, activeMode, sleepMode, charging) {
    let rows;
    try {
        let query = 'UPDATE StimulusInfo SET (' + 
                'activeMode = ?' + 
                ', sleepMode = ?' + 
                ', charging = ?' + 
                ', updateAtTime = ' + getDate() + 
            ') WHERE crawlingIdx = ?';

        rows = await db.execute(query, [activeMode, sleepMode,  charging, crawlingIndex]);
    } catch (error) {
        if (db) db.release();
        throw error;
    }

    if (db) await db.release();
    
    return rows;
}

function getToday() {
    var date = new Date();
    var year = date.getFullYear();
    var month = ("0" + (1 + date.getMonth())).slice(-2);
    var day = ("0" + date.getDate()).slice(-2);

    return year + "-" + month + "-" + day;
}