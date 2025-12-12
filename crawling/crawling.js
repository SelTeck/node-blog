
import axios from "axios";
import cheerio from "cheerio";
import xml2Json from "xml2js";
import * as make_data from "../data/make_data.js";

const TitleWord = 'CRPS';

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
          let title = items[item].title[0];

          if (title.startsWith(TitleWord)) {
            // console.log(`title is ${title}, date is ${reg_date}`);
            let start = title.indexOf("(")
            let end = title.lastIndexOf(")")
            
            const regex = /\d{2}.\d{2}.\d{2}/g;
            let times = title.match(regex);
            let createAtTime = times == null ? null : times.toString();
            // let createAtTime = title.substring(0, start).split(' - ')[1].replaceAll('.', '-');
            
            make_data.insertRss(title.substring(start + 1, end),
              items[item].description[0],
              items[item].link[0],
              createAtTime == null ? reg_date : (reg_date != createAtTime ? createAtTime : reg_date)
            );
            this.#crawlingUrl(items[item].link[0]);
          }
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
      console.log(err);
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
    const $ = cheerio.load(html.data);

    let div_list = $("div.se-module.se-module-text");
    const getup_sub_count = 12;
    
    /*
        console.log('1' + $(div_list[0]).find(`span`).text());  // title
        console.log('2' + $(div_list[1]).find(`span`).text());  // weather
        console.log('3' + $(div_list[2]).find(`span`).text());  // 기상 후 몸 체크
        console.log('4' + $(div_list[3]).find(`span`).text());  // 수면 포인트
        console.log('5' + $(div_list[4]).find(`span`).text());  // 기상 후 몸 체크 내용
        console.log('6' + $(div_list[5]).find(`span`).text());  // CRPS 통증 기록 
    // */
    console.log(div_list.length);
    try {
      let title = $(div_list[0]).find(`span`).text();
      let titles = title.split(" - ");

      let reg_date = titles[1].substring(0, titles[1].lastIndexOf('('));
      let weather = $(div_list[1]).find(`span`).text().replace('날씨:', '');

      // 수면 후 정보 가져오기 
      let getUp = $(div_list[2]).find(`span`).text().substring(getup_sub_count);
      // 수면 점수 가져오기     
      let sleep_point = $(div_list[3]).find(`span`).text().replace(/[^0-9]/g, '');
      
      // 통증 강도 가져오기 
      // let diaryText = $(div_list[5]).find(`span`).text();
      // let diaryIndex = diaryText.replace('【오늘의 기록】', '')
      
      let diary = $(div_list[5]).find(`span`).text().replace('【오늘의 기록】', '');
      
      let count = diary.lastIndexOf('통증 강도');
      let painInfo = diary.substring(count, diary.length - 2);
      let pains = this.#extractPainLevels(painInfo)
           
      make_data.insertCrawling(diary, weather, getUp, sleep_point,
        pains[0], pains[1], reg_date.replaceAll('.', '-'), 
      );
    } catch (err) {
      throw err;
    } 
  }

  #extractPainLevels(text) {
    // 모든 숫자를 추출
    const numbers = text.match(/\d+/g);

    if (!numbers) return [0, 0];

    // "~ 4"처럼 앞 숫자가 없는 경우 → 앞 숫자를 뒤 숫자로 복제
    if (numbers.length === 1) {
        return [numbers[0], numbers[0]];
    }

    // "3 ~ 5"처럼 두 숫자가 있는 경우 그대로 반환
    return numbers.slice(0, 2);
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
