
import * as db from '../database/connection.js'

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


    db.getConnection((conn) => {
        console.log("connected ! connection id is " + conn.threadId);
            conn.execute(query).then((result) => {
                console.log(result.length);
            });
        conn.release(); //release to pool
    });
    
    // return db.connection.execute(query).then(result);
    // db.db.then(conn => {
    //     console.log("connected ! connection id is " + conn.threadId);
    //     conn.execute(query).then((result) => {
    //         console.log(result.length);
    //     });
    //     conn.release(); //release to pool
    // })
    // .catch(error => {
    //     console.log("not connected due to error: " + error);
    // })

    // db.execute(query).then((result) => {
    //     console.log(result.length);
    // });
    // db.release();

    // db.then(conn => {
    //     console.log("connected ! connection id is " + conn.threadId);
    // conn.execute(query).then((result) => {
    //     console.log(result.length);
    // });
    // conn.release(); //release to pool
    //   })
    //   .catch(err => {
    //     console.log("not connected due to error: " + err);
    //   });


    // db.pool((err, conn) => {
    //     if (err) {
    //         console.log("not connected due to error: " + err);
    //     } else {
    //         console.log("connected ! connection id is " + conn.threadId);
    //         conn.execute(query).then((result) => {
    //             console.log(result.length);
    //         });
    //         conn.end();
    //     }
    // });

    // let res;
    // let connection;
    // try {
    //     // connection = await pool.getConnection();
    //     console.log("connected ! connection id is " + db.threadId);
    //             db.execute(query).then((result) => {
    //                 console.log(result.length);
    //             });
    //             db.release();

    // } catch (error) {
    //     throw error;
    // }

    // if (connection) {
    //     connection.release();
    // }

    // // console.log(res);
    // return res;
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
        return await db.query(query, [page, viewCount]);

    } catch (error) {
        return error;
    }
}

