import { query } from "../database/connection.js";

export async function getAll() {
    let sql = 'SELECT R.title as TITLE' +
        ', R.synopsis  as DAIRY' +
        ', R.url AS URL' +
        ', C.weather AS WEATHER' +
        ', C.sleep_point AS SP' +
        ', C.pain_min  AS PAIN_MIN' +
        ', C.pain_max AS PAIN_MAX' +
        ' FROM Blog_Rss R JOIN Rss_Crawling C' +
        ' WHERE R.reg_date = C.reg_date' +
        ' ORDER BY R.reg_date DESC';

    return await query(sql)
        .then((result) => {
                rows = result;
        }
    );
}

export async function getRssList(page, viewCount) {
    const offset = Math.max(0, (page - 1) * viewCount);
    
    let sql = 'SELECT ' +
            ' idx' +
            ', title ' +
            ', synopsis ' +
            ', url ' +
            ', DATE_FORMAT(reg_date, \'%Y-%m-%d\') AS createAtTime' +
            ' FROM Blog_Rss' +
            ' ORDER BY reg_date DESC' +
            ' LIMIT ?, ?';    // offset, view_count
    
    return await query(sql, [offset, parseInt(viewCount)]);
}

export async function getContent(rss_index) {
    let sql = `SELECT * FROM Rss_Content WHERE Rss_Idx = ?`;

    return await query(sql, rss_index);
}


// 최근 day 만큼의 최대, 최소, 평균 통증 강도를 조회해 가져온다. 
export async function getPainDaysInfo(day) {
     let sql = 'SELECT' + 
        ' pain_min AS MIN, pain_max AS MAX, (pain_min + pain_max) / 2 AS AVG, reg_date AS DAY' + 
        ' FROM Rss_Crawling ORDER BY reg_date DESC LIMIT ?';


    return query(sql, [day]);
}

export async function getSleepPointDaysInfo(day) {
    let sql = 'SELECT' + 
        ' sleep_point, SUBSTRING_INDEX(getup_diary, \'없음 <\', 1) AS getup_diary , reg_date' +
        ' FROM Rss_Crawling rc  ORDER BY reg_date DESC LIMIT ?;';        
    
    return await query(sql, [day]);
}

export async function getStimulusChargeInfo(number) {
    let sql = 'SELECT * FROM ' + 
        'StimulusUseInfo ' + 
        'WHERE charging = 1 ORDER BY createAtTime DESC LIMIT ?';

    return await query(sql, [number]);
}

export async function getStimulusUsedTypeInfo() {

}

export async function inputDailyComments(rssIndex, takeMorning, takeEvening, antiAnalgesic, narcoticAnalgesic, usePath,
    swelling, activeMode, sleepMode, chargingStimulus, comments) {
    let sql = 'CALL USP_ADD_DAILY_COMMENT(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    
    return query(sql, [rssIndex, takeMorning, takeEvening, antiAnalgesic, narcoticAnalgesic, usePath,
            swelling, activeMode, sleepMode, chargingStimulus, comments]);
}

export async function updateDailyComments(rssIndex, takeMorning, takeEvening, antiAnalgesic, narcoticAnalgesic, usePath,
    swelling, activeMode, sleepMode, chargingStimulus, comments) {
    let sql = 'UPDATE Comment c, Swelling w, StimulusUseInfo s' + 
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
    
    return query(sql, [takeMorning, takeEvening, antiAnalgesic, narcoticAnalgesic, usePath, comments, 
            activeMode, sleepMode, chargingStimulus, swelling, rssIndex, rssIndex, rssIndex]);
}

export async function getDailyComments(blogIndex) {
    let sql = 'SELECT c.*' + 
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

    return query(sql, [blogIndex])
}

export async function inputStimulusInfo(type, upright, lyingFront, lyingBack,lyingLeft, lyingRight, reclining) {
    let sql = "INSERT INTO StimulusType (" + 
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

    return await query(sql, [type, upright, lyingFront, lyingBack, lyingLeft, lyingRight, reclining]);
}

/**
 * Stimulus Mode 가져오기 (최근 입력 날자 기준)
 * @returns json
 */
export async function getStimulusInfo() {
    let sql = "SELECT type, \`index\`, createAtTime " +  
        "FROM StimulusType " + 
        "WHERE (type, createAtTime) " +  
        "IN (" + 
            "SELECT type, max(createAtTime) " +
                "FROM StimulusType " +
                "GROUP BY type" + 
           ") " +
        "ORDER BY type";

    return await query(sql); 
}

export async function getStimulusTypeDetail(nowIndex) {
    let sql = 'SELECT * FROM StimulusType WHERE `index` = ?;'

    return await query(sql, [nowIndex]);

}

// export async function updateStimulusInfo(crawlingIndex, activeMode, sleepMode, charging) {
//     let sql = 'UPDATE StimulusInfo' +
//                 ' SET ' + 
//                 ' activeMode = ?' + 
//                 ', sleepMode = ?' + 
//                 ', charging = ?' + 
//                 ', updateAtTime = NOW()' + 
//             ' WHERE crawlingIdx = ?';
//     return await query(sql, [activeMode, sleepMode,  charging, crawlingIndex]);
// }

function getToday() {
    var date = new Date();
    var year = date.getFullYear();
    var month = ("0" + (1 + date.getMonth())).slice(-2);
    var day = ("0" + date.getDate()).slice(-2);

    return year + "-" + month + "-" + day;
}