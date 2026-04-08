import { query } from "../database/connection.js";

/**
 * Stimulus Mode 가져오기 (최근 입력 날자 기준)
 * @returns json
 */
export async function getStimulusInfo() {
    // let sql = "SELECT type, \`index\`, createAtTime " +  
    //     "FROM StimulusType " + 
    //     "WHERE (type, createAtTime) " +  
    //     "IN (" + 
    //         "SELECT type, max(createAtTime) " +
    //             "FROM StimulusType " +
    //             "GROUP BY type" + 
    //        ") " +
    //     "ORDER BY type";

    const sql = "SELECT * " + 
            "FROM (" + 
                "SELECT " +
                    "type, createAtTime, " +
                    "ROW_NUMBER() OVER ( " +
                        "PARTITION BY type " +
                        "ORDER BY createAtTime DESC, `index` DESC " +
                    ") AS rn " +
                "FROM StimulusType t " +
            ") x " +
            "WHERE rn = 1;"

    return await query(sql); 
}

export async function getStimulusTypeDetail(nowIndex) {
    let sql = 'SELECT * FROM StimulusType WHERE `index` = ?;'

    return await query(sql, [nowIndex]);

}

export async function getStimulusChargeInfo(number) {
    let sql = 'SELECT * FROM ' + 
        'StimulusUseInfo ' + 
        'WHERE charging = 1 ORDER BY createAtTime DESC LIMIT ?';

    return await query(sql, [number]);
}

export async function getStimulusUsedTypeInfo() {

}