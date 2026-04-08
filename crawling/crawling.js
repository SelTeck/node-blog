
import axios from "axios";
import * as cheerio from 'cheerio';
import xml2Json from "xml2js";
import * as make_data from "../data/make_data.js";

const TitleWord = 'CRPS';

export class Crawling {
  constructor(word) {
    this._word = word;
  }

  parseXML(xml) {
    const parser = xml2Json.Parser({
      explicitArray: false, // 배열 제거 (중요!)
      ignoreAttrs: false
    });

    parser.parseString(xml, (err, result) => {
      if (err) throw err;
      const channel = result.rss.channel;
            
      const items = channel.item;
      for (var item in items) {
        const category = items[item].category;
        const pubDate = items[item].pubDate;
        if (category === this._word) {
          const reg_date = this.#changeDate(pubDate);
          const title = items[item].title;

          if (title.startsWith(TitleWord)) {
            const createAtTime = title.match(/\b\d{2}\.\d{2}\.\d{2}\b/)?.[0] ?? reg_date;
            const subTitle = title.match(/\(([^)]*)\)/)?.[1] ?? "";
            
            make_data.insertRss(subTitle, items[item].description, items[item].link, createAtTime);  
            this.#crawlNaverBlog(items[item].link);
          }
        }
      }
    });
  }

  async #crawlNaverBlog(url) {
    try {
      const rssHtml = await axios.get(url);
      const $ = cheerio.load(rssHtml.data);
      // id가 겹치지 않는 경우 가능함 (id => #, class => .)
      // let src = $('#mainFrame').attr("src"); 
      // 정확하게 하기 위해 root를 타는 것이 좋다.
      let iframeSrc = $("body > iframe#mainFrame").attr("src");
      let blogUrl = "http://blog.naver.com/" + iframeSrc;
      
      // Blog Crawling
      const blogHtml = await axios.get(blogUrl);
      const $$ = cheerio.load(blogHtml.data);
      const div_list = $$("div.se-module.se-module-text");
      
      // console.log($$(div_list[0]).find(`span`).map((i, el) => {return $$(el).text();}).get().join('\n')  // title
      // console.log($$(div_list[1]).find(`span`).map((i, el) => {return $$(el).text();}).get().join('\n')  // weather
      // console.log($$(div_list[2]).find(`span`).map((i, el) => {return $$(el).text();}).get().join('\n')  // 기상 후 몸 체크
      // console.log($$(div_list[3]).find(`span`).map((i, el) => {return $$(el).text();}).get().join('\n')  // 수면 포인트
      // console.log($$(div_list[4]).find(`span`).map((i, el) => {return $$(el).text();}).get().join('\n')  // 기상 후 몸 체크 내용
      // console.log($$(div_list[5]).find(`span`).map((i, el) => {return $$(el).text();}).get().join('\n')  // CRPS 통증 기록 
    

      const title = $$(div_list[0]).find(`span`).map((i, el) => {
        return $$(el).text();
      }).get().join('\n');
      // const title = titleElement.match(/\(([^)]*)\)/)?.[1] ?? "";
      const weather = $$(div_list[1]).find(`span`).map((i, el) => {
        return $$(el).text();
      }).get().join('\n').replace('날씨:', '');

      const wakeup = $$(div_list[2]).find(`span`).map((i, el) => {
        return $$(el).text();
      }).get().join('\n');
      
      const sleep_point = $$(div_list[3]).find(`span`).text().replace(/[^0-9]/g, '');
      
      const diary = $$(div_list[5]).find(`span`).map((i, el) => {
        return $$(el).text();
      }).get().join('\n');

      const reg_date = title.match(/\d{2}\.\d{2}\.\d{2}/);
      const painInfo = diary.match(/통증\s*강도:\s*~?\s*([0-9]+)/);

      if (painInfo) {
          const painLevel = painInfo[1].replace(/\s+/g, '');
          const pains = this.#extractPainLevels(painLevel)
          
          make_data.insertCrawling(diary, weather, wakeup, sleep_point,
            pains[0], pains[1], reg_date);
      }

    } catch(err) {
      console.log("crawlNaverBlog err " + err.toString());
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

  #getPainLevels(text) {
    const match = text.match(/통증\s*강도:\s*~?\s*([0-9]+)\s*(?:~\s*([0-9]+))?/);

    if (!match) {
        return null;
    }

    const first = parseInt(match[1], 10);
    const second = match[2] ? parseInt(match[2], 10) : first;

    return [first, second];
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
