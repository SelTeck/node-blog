
import axios from "axios";
import cheerio from "cheerio";
import request from "request";
import xml2Json from "xml2js";
// import express from 'express';

const url = "https://rss.blog.naver.com/whitedevel.xml";


const word = "CRPS 환우의 기록";

request(url, function (err, res, data) {
  if (!err && res.statusCode == 200) {
    parseXML(data);
  } else {
    console.log('error -> ${err}');
  }
});

function parseXML(xml) {
  xml2Json.parseString(xml, function (err, obj) {
    if (err) {
      console.log(err);
      return;
    }

    var items = obj.rss.channel[0].item;
    for (var item in items) {
      var title = items[item].title[0];
      var words = title.split(" - ");
      if (words[0] == word) {
        parsing(items[item].link[0]);
      }

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
  } catch (err) {
    log(err);
  }
}

async function parsing(url) {
  const html = await getHtml(url);
  const $ = cheerio.load(html.data);

  // id가 겹치지 않는 경우 가능함 (id => #, class => .)
  // let src = $('#mainFrame').attr("src"); 
  // 정확하게 하기 위해 root를 타는 것이 좋다.
  let src = $("body > iframe#mainFrame").attr("src");
  // console.log(`src is ${src}`);
  let real = "http://blog.naver.com/" + src;
  // console.log(`real is ${real}`);

  // TODO. 여기에서 다시 html 파싱 필요 
  parsingBlog(real);
}

async function parsingBlog(url) {
  const html = await getHtml(url);
  // console.log(`html is ${html.data}`);
  const $ = cheerio.load(html.data);

  // console.log($("meta[property='og:title']").attr("content"));
  // let title = $("div.se-component-content > span.se-fs- se-ff-").text();

  let div_list = $("div.se-module.se-module-text");
  if (div_list.length) {
    // console.log(`div_list.length is ${div_list.length}`);
    // div_list.each((_, e) => {
    //   console.log($(e).find(`span`).text());
    // });
    console.log($(div_list[0]).find(`span`).text());
    console.log($(div_list[1]).find(`span`).text());
    console.log($(div_list[2]).find(`span`).text());
    console.log($(div_list[3]).find(`span`).text());
    console.log($(div_list[4]).find(`span`).text());
    console.log($(div_list[5]).find(`span`).text());
  } else {
    console.log(`div_list.lenth is zero!!!`);
  }

}

