
import { db } from '../database/connection.js'

export async function getAll() {
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
        return await db.execute(query)
            .then((result) => {
                rows = result;
            });
      
    } catch (error) {
        throw error;
    } finally {
        if (db) await db.release();
    }
}

export async function getRssList(page, viewCount) {
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

        return await db.execute(query, [(page - 1) * viewCount, viewCount]);
        
    } catch (error) {
        throw error;
    } finally {
        if (db) await db.release();
    }
}

export async function getContent(rss_index) {
    try {
        let query = `SELECT * FROM Rss_Content WHERE Rss_Idx = ?`;

        return await db.execute(query, rss_index);
        
    } catch (error) {
        throw error;
    } finally {
        if (db) await db.release();
    }
}

export async function getPainAvgInfo(day) {
    try {
        let query = 'SELECT' +
            ' Min(pain_min) AS PAIN_MIN' +
            ', Max(pain_max) AS PAIN_MAX' +
            ', (AVG(pain_min) + AVG(pain_max)) / 2 AS PAIN_AVG' +
            ' FROM Rss_Crawling ORDER BY reg_date DESC LIMIT 0, ?';

        return await db.execute(query, [day]);
        
    } catch (error) {
        if (db) await db.release();
        throw error;
    } finally {
        if (db) await db.release();
    }
}

export async function getPainDaysInfo(day) {
    try {
        let query = 'SELECT' + 
        ' pain_min AS MIN, pain_max AS MAX, reg_date AS DAY' + 
        ' FROM Rss_Crawling ORDER BY reg_date DESC LIMIT ?';

        return db.execute(query, [day]);
    } catch (error) {
        throw error;
    } finally {
        if (db) await db.release();
    }
}

export async function getSleepPointDaysInfo(day) {
    let result;
    try {
        let query = 'SELECT' + 
        ' sleep_point, SUBSTRING_INDEX(getup_diary, \'없음 <\', 1) AS getup_diary , reg_date' +
        ' FROM Rss_Crawling rc  ORDER BY reg_date DESC LIMIT ?;';        
        
        // 'SELECT' + 
        //     ' sleep_point , reg_date as DAY' + 
        //     ' FROM Rss_Crawling ORDER BY reg_date DESC LIMIT ?';

        return db.execute(query, [day]);

    } catch (error) {
        throw error;
    } finally {
        if (db) db.release();
    }
}

export async function inputDailyComments(rssIndex, takeMorning, takeEvening, antiAnalgesic, narcoticAnalgesic, usePath,
    swelling, activeMode, sleepMode, chargingStimulus, comments) {
    try {
        let query = 'CALL USP_ADD_DAILY_COMMENT(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        return await db.execute(query, [rssIndex, takeMorning, takeEvening, antiAnalgesic, narcoticAnalgesic, usePath,
            swelling, activeMode, sleepMode, chargingStimulus, comments]);
    } catch (error) {
        if (db) await db.release();
        throw error;
    } finally {
        if (db) await db.release();
    }
}

export async function updateDailyComments(rssIndex, takeMorning, takeEvening, antiAnalgesic, narcoticAnalgesic, usePath,
    swelling, activeMode, sleepMode, chargingStimulus, comments) {
    
    try {
        let query = 'UPDATE Comment c, Swelling w, StimulusUseInfo s' + 
        ' SET' + 
        ' c.Morning = ?' + 
        ', c.Evening = ?' + 
        ', c.Analgesic = ?' +
        ', c.Narcotic = ?' +   
        ', c.usePath = ?' + 
        ', c.Comments = ?' + 
        ', c.updateAtTime = NOW()' + 
        ', s.activeMode = ?' + 
        ', s.sleepMode = ?'+
        ', s.charging = ?' + 
        ', s.updateAtTime = NOW()' + 
        ', w.swellingLv = ?' + 
        ', w.updateAtTime = NOW()'
        ' WHERE c.blogIndex = ? AND s.blogIndex = ? AND w.blogIndex = ?';

        return db.query(query, [takeMorning, takeEvening, antiAnalgesic, narcoticAnalgesic, usePath, comments, 
            activeMode, sleepMode, chargingStimulus, swelling, rssIndex, rssIndex, rssIndex]);
    } catch (error) {
        if (db) await db.release();
        throw error;
    } finally {
        if (db) await db.release;
    }
}

export async function getDailyComments(blogIndex) {
    try {
        let query = 'SELECT c.*' + 
        ', w.swellingLv' + 
        // ', IFNULL((SELECT `type` FROM StimulusType WHERE `index` = si.activeMode), \'N\') as activeMode' + 
        // ', IFNULL((SELECT `type` FROM StimulusType WHERE `index` = si.sleepMode), \'N\') as sleepMode' +  
        ', si.activeMode' +
        ', si.sleepMode' + 
        ', si.charging' + 
        ' FROM Comment c' + 
        ' LEFT JOIN StimulusUseInfo si' + 
        ' ON c.blogIndex = si.blogIndex' + 
        ' LEFT JOIN Swelling w' + 
        ' ON c.blogIndex = w.blogIndex' + 
        ' WHERE c.blogIndex = ?';

        return await db.execute(query, [blogIndex]);
    } catch (error) {
        throw error;
    } finally {
        if (db) db.release();
    }
}

export async function inputStimulusInfo(type, upright, lyingFront, lyingBack,lyingLeft, lyingRight, reclining) {
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

        return await db.execute(query, [type, upright, lyingFront, lyingBack, lyingLeft, lyingRight, reclining]);
       
    } catch (error) {
        throw error;
    } finally  {
        if (db) await db.release();
    }
}

/**
 * Stimulus Mode 가져오기 (최근 입력 날자 기준)
 * @returns json
 */
export async function getStimulusInfo() {
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

        return db.execute(query);
    } catch (error) {
        throw error;
    } finally {
        if (db) db.release();
    }

    
}

export async function getStimulusTypeDetail(nowIndex) {
    try {
        let query = 'SELECT * FROM StimulusType WHERE `index` = ?;'
        return db.execute(query, [nowIndex]);
    } catch (error) {
        throw error;
    } finally {
        if (db) db.release();
    }
}

// export async function updateStimulusInfo(crawlingIndex, activeMode, sleepMode, charging) {
//     let rows;
//     try {
//         let query = 'UPDATE StimulusInfo' +
//                 ' SET ' + 
//                 ' activeMode = ?' + 
//                 ', sleepMode = ?' + 
//                 ', charging = ?' + 
//                 ', updateAtTime = NOW()' + 
//             ' WHERE crawlingIdx = ?';

//         rows = await db.execute(query, [activeMode, sleepMode,  charging, crawlingIndex]);
//     } catch (error) {
//         if (db) db.release();
//         throw error;
//     }

//     if (db) await db.release();
    
//     return rows;
// }

function getToday() {
    var date = new Date();
    var year = date.getFullYear();
    var month = ("0" + (1 + date.getMonth())).slice(-2);
    var day = ("0" + date.getDate()).slice(-2);

    return year + "-" + month + "-" + day;
}