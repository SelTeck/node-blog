
const axios = require("axios");
const cheerio = require("cheerio")
const xml2Json = require('xml2js'); 
const request = require('request');
const log = console.log;
const url = "https://rss.blog.naver.com/whitedevel.xml";


const word = "CRPS 환우의 기록";
let crpsArray = [];

request(url, function(err, res, data) {
    if(!err && res.statusCode == 200) {
        parseXML(data);
    } else {
        console.log('error -> ${err}');
    }
});

function parseXML(xml) {
  xml2Json.parseString(xml, function(err, obj) {
    if(err) {
      console.log(err);
      return;
    }

    var items = obj.rss.channel[0].item;
    for(var item in items) {
        var title = items[item].title[0];
        var words = title.split(" - ");
        // if (words[0] == word) {
        //     crpsArray.push ({
        //         title: title,
        //         data: words[1],
        //         url: items[item].link[0],
        //         content: items[item].description[0],
        //     });
        // }
        
        // log(crpsArray);

        var category = items[item].category[0];
        
        var url = items[item].link[0];
        var guid = items[item].guid[0];

        console.log("카테고리 : " + category);
        console.log("제목 : " + title);
        console.log("url: " + url);
        console.log("guid: " + guid);
    }
  });
}


// const getHtml = async(url) => {
//     try {
//         return await axios.get(url);
//     } catch(err) {
//         log(err);
//     }
// }

// const parsing = async(url) => {
//     const html = await getHtml(url);
//     // log(html);
//     const $ = cheerio.load(html.data);
//     var src = $('#mainFrame').attr("src");
    
//     var real = "https://blog.naver.com" + src;
//     log("real : " + real);
//     const realHtml = getHtml(real);
//     log(realHtml);
    
// }

// parsing("https://blog.naver.com/whitedevel/222723174172");
// // log(src.load);

