import request from "request";
import express from "express";
import { Crawling } from "./crawling/crawling.js";
import mainDB from "./database/mainDB";

const word = "CRPS 환우의 기록";
const url = "https://rss.blog.naver.com/whitedevel.xml";
const app = express();




app.use(express.json());
mainDB.connect();
// TODO: 추가해야할 모듈  
// app.use(helmet());
// app.use(cors());
// app.use(morgan('tiny'));


let crawling = new Crawling(word);


request(url, function (err, res, data) {
    if(!err && res.statusCode == 200) {
        crawling.parseXML(data);
    } else {
        console.log('error -> ${err}');
    }
});

