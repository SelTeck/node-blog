import request from "request";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import schedule from "node-schedule"
import { Crawling } from "./crawling/crawling.js";
import dataRouter from "./router/get_data.js";


// const rule = '* 0 3 * * *';   // 매일 3시에 실행
const word = "CRPS 환우의 기록";
const url = "https://rss.blog.naver.com/whitedevel.xml";
const app = express();
let crawling = new Crawling(word);


app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan('tiny'));    // 

app.use('/records', dataRouter);


app.use((req, res, next) => {
    res.sendStatus(404);
});

app.use((error, req, res, next) => {
    console.error(error);
    res.sendStatus(500);
});

request(url, function (err, res, data) {
    if (!err && res.statusCode == 200) {
        crawling.parseXML(data);
    } else {
        console.log(`error -> ${err}`);
    }
});

// schedule.scheduleJob(rule, ()=> {
//   
//});
// app.get("/records", (req, res)=> {
//     res.send('Welcome!');
//     let array = crawlingData.getAll();
//     // if (array) {

//     // }
// });


app.listen(8080);


