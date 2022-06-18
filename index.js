
import axios from "axios";
import cheerio from "cheerio";
import request from "request";
import xml2Json from "xml2js";
// import express from 'express';

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
        if (words[0] == word) {
            parsing(items[item].link[0]);
            break;
        
          // let guid = items[item].guid[0];
          // let index = guid.lastIndexOf("/")
          // guid = guid.substr(index + 1, guid.lenth);
          // console.log(`guid is ${guid}`);
        //     crpsArray.push ({
        //         title: title,
        //         data: words[1],
        //         url: items[item].link[0],
        //         content: items[item].description[0],
        //     });

        }
        
        // log(crpsArray);

        // var category = items[item].category[0];
        
        // var url = items[item].link[0];
        // var guid = items[item].guid[0];

        // console.log("카테고리 : " + category);
        // console.log("제목 : " + title);
        // console.log("url: " + url);
    }
  });
}


async function getHtml(url) {
  try {
    return await axios.get(url);
  } catch(err) {
      log(err);
  }
}

async function parsing(url) {
  const html = await getHtml(url);
  console.log(html.data);
  const $ = cheerio.load(html.data);

  // id가 겹치지 않는 경우 가능함 (id => #, class => .)
  // let src = $('#mainFrame').attr("src"); 
  // 정확하게 하기 위해 root를 타는 것이 좋다.
  let src = $("body > iframe#mainFrame").attr("src"); 
  console.log(`src is ${src}`);
  let real = "http://blog.naver.com/" + src;
  console.log(`real is ${real}`);
  // TODO. 여기에서 다시 html 파싱 필요 
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
//     console.log($)
//     var src = $('#iframe#mainFrame').attr("src");
    
//     var real = "https://blog.naver.com" + src;
//     log("real : " + real);
//     const realHtml = getHtml(real);
//     log(realHtml);
    
// }

// parsing("https://blog.naver.com/whitedevel/222723174172");
// // log(src.load);

