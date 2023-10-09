
import request from "request";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import schedule from "node-schedule";
import { Crawling } from "./crawling/crawling.js";
import dataRouter from "./router/data.js";
import authRouter from './router/auth.js';

const word = "CRPS 환우의 기록";
const url = "https://rss.blog.naver.com/whitedevel.xml";
const app = express();

//const rule = '* * 03 * * *';   // 매일 3시에 실행
// const rule = '10 * * * * *';
const rule = new schedule.RecurrenceRule();
rule.hour = 3;
rule.minute = 0;
rule.tz = 'Asia/Seoul'

const IS_DEV = true;
const PORT = IS_DEV ? 8080 : 3000;

let crawling = new Crawling(word);

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan('tiny'));    // 

app.use('/auth', authRouter);
app.use('/records', dataRouter);


app.use((req, res, next) => {
    res.sendStatus(404);
});

app.use((error, req, res, next) => {
    console.error(error);
    res.sendStatus(500);
});


// setInterval(request, 60 * 1000);
// setInterval(() => {
//     request(url, function (err, res, data) {
//         console.log(`called request, url is ${url}`)
//         if (!err && res.statusCode == 200) {
//             crawling.parseXML(data);
//         } else {
//             console.log(`error -> ${err}`);
//         }
//     });
// }, 60 * 1000)

// request(url, function (err, res, data) {
//     // console(`called request, url is ${url}`)
//     if (!err && res.statusCode == 200) {
//         crawling.parseXML(data);
//     } else {
//         console.log(`error -> ${err}`);
//     }
// });

//*
request(url, function (err, res, data) {
    if (!err && res.statusCode == 200) {
        crawling.parseXML(data);
    } else {
        console.log(`error -> ${err}`);
    }
});
// */

/*
schedule.scheduleJob(rule, function() {
    console.log(`called request, rule is ${rule}`);
    request(url, function (err, res, data) {
        if (!err && res.statusCode == 200) {
            crawling.parseXML(data);
        } else {
            console.log(`error -> ${err}`);
        }
    });
}); 
// */

/**
 * 6시간 마다 한 번씩 호출
 */  
// setInterval(() => {
//     console.log(`called request, rule is ${rule}`);
//     request(url, function (err, res, data) {
//         if (!err && res.statusCode == 200) {
//             crawling.parseXML(data);
//         } else {
//             console.log(`error -> ${err}`);
//         }
//     });
// }, 6 * 60 * 60 * 1000);

app.listen(PORT);


