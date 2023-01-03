
import axios from "axios";
import cheerio from "cheerio";
import xml2Json from "xml2js";
import * as db from "../data/make_data.js";

export class Crawling {
  constructor(word) {
    this._word = word;
  }

  parseXML(xml) {
    xml2Json.parseString(xml, function (err, obj) {
      if (err) {
        console.log(err);
        return;
      }

      var items = obj.rss.channel[0].item;
      for (var item in items) {
        let category = items[item].category[0];
        let date = items[item].pubDate[0];

        if (category === this._word) {
          let reg_date = this.#changeDate(date);
          // console.log(`title is ${items[item].title[0]}, date is ${reg_date}`);
          let title = items[item].title[0];
          let start = title.indexOf("(") + 1
          let end = title.lastIndexOf(")")
          // let subject = title.substring(start, end);
          // console.log(`subject is ${subject}` ) 
          db.insertRss(title.substring(start, end), items[item].description[0], items[item].link[0], reg_date);
          this.#crawlingUrl(items[item].link[0]);
        }

        // var category = items[item].category[0];
        // var url = items[item].link[0];
        // var guid = items[item].guid[0];

        // console.log("카테고리 : " + category);
        // console.log("제목 : " + title);
        // console.log("url: " + url);
      }
    }.bind(this));
  }


  async #getHtml(url) {
    try {
      return await axios.get(url);
    } catch (err) {
      log(err);
    }
  }

  async #crawlingUrl(url) {
    const html = await this.#getHtml(url);
    const $ = cheerio.load(html.data);

    // id가 겹치지 않는 경우 가능함 (id => #, class => .)
    // let src = $('#mainFrame').attr("src"); 
    // 정확하게 하기 위해 root를 타는 것이 좋다.
    let src = $("body > iframe#mainFrame").attr("src");
    let real = "http://blog.naver.com/" + src;

    // TODO. 여기에서 다시 html 파싱 필요 
    this.#crawlingBlog(real);
  }

  async #crawlingBlog(url) {
    const html = await this.#getHtml(url);
    // console.log(`html is ${html.data}`);
    const $ = cheerio.load(html.data);

    // console.log($("meta[property='og:title']").attr("content"));
    // let title = $("div.se-component-content > span.se-fs- se-ff-").text();

    let div_list = $("div.se-module.se-module-text");
    // if (div_list.length) {
    //   console.log(`div_list.length is ${div_list.length}`);
    //   // div_list.each((_, e) => {
    //   //   console.log($(e).find(`span`).text());
    //   // });
    // } else {
    //   console.log(`div_list.lenth is zero!!!`);
    // }

    const getup_sub_count = 12;
    const pain_diary_sub_count = 8;

    let title = $(div_list[0]).find(`span`).text();
    let splits = title.split(" - ");
    let weather = $(div_list[1]).find(`span`).text().replace('날씨:', '');
    let getUp = $(div_list[2]).find(`span`).text().substring(getup_sub_count);
    let sleep_point = $(div_list[3]).find(`span`).text().replace('수면 포인트:', '');
    // 통증 강도 가져오기 
    let diary = $(div_list[5]).find(`span`).text().substring(pain_diary_sub_count);
    let count = diary.lastIndexOf('통증 강도');
    let pain = diary.substring(count, diary.length - 2).replace('통증 강도:', '');
    let pains = pain.split('~');
    let pain_min = pains[0] === ' ' ? pains[1] : pains[0];
    db.insertCrawling(weather, getUp, sleep_point, pain_min, pains[1], splits[1].replaceAll('.', '-'));

    // console.log(`pain min is ${paints[0]} and max is ${paints[1]}`);
    // console.log('1' + $(div_list[0]).find(`span`).text());  // title
    // console.log('2' + $(div_list[1]).find(`span`).text());  // weather
    // console.log('3' + $(div_list[2]).find(`span`).text());  // 기상 후 몸 체크
    // console.log('4' + $(div_list[3]).find(`span`).text());  // 수면 포인트
    // console.log('5' + $(div_list[4]).find(`span`).text());  // 기상 후 몸 체크 내용
    // console.log('6' + $(div_list[5]).find(`span`).text());  // CRPS 통증 기록 

  }

  #changeDate(date) {
    // const monthNames = {
    //   month_names: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    //   month_names_short: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    // };

    let days = date.split(' ');
    let month = "JanFebMarAprMayJunJulAugSepOctNovDec".indexOf(days[2]) / 3 + 1
    return new Date(days[3], month - 1, parseInt(days[1]) + 1).toISOString().substring(0, 10);
  }
}
