import express from 'express';
import * as crawlingData from '../controller/data.js';
import { isAuth } from '../middleware/auth.js';

const router = express.Router();

/**
 * query => {
 *  쿼리 스트링은, 필터링이나, 정렬 같은것을 할때 주로 사용 
 *  records?page=:page_number
 *  req.query.page
 * }
 * 
 * 
 * params => {
 *  Rest API 디자인에 있어서, path는 유니크한 (유일한, unique) 리소스를 나타낼때 사용
 *  /record/1
 *  req.params.page
 * }
 */


router.get("/", crawlingData.getAll);
// get Crawling Data to paging
router.get("/list/:page/:viewCount", isAuth, crawlingData.getRssList);
router.get("/detail/:rss_index", isAuth, crawlingData.getContent);

router.get("/data/pain/average/:day", isAuth, crawlingData.getPainAvgInfo);
// 10, 20, 30, 60, 90, 120 별로 통증 Max, Min 정보를 가져온다.
router.get("/data/pain/days/:day", isAuth, crawlingData.getPainDaysInfo);
router.get("/data/sleep/days/:day", isAuth, crawlingData.getSleepPointDaysInfo);
router.get("/data/daily/comment/:blogIndex", isAuth, crawlingData.getDailyComments);
router.get("/data/stimulus/info", isAuth, crawlingData.getStimulusInfo);
router.get("/data/stimulus/detail/:nowIndex", isAuth, crawlingData.getStimulusTypeDetail);

router.put("/data/update/daily", isAuth, crawlingData.updateDailyComments);
// "update/Stimulus/"
// router.put("/data/update/stimulus", isAuth, crawlingData.updateStimulusInfo);

router.post("/data/input/daily", isAuth, crawlingData.inputDailyComments);
router.post("/data/input/stimulus/info", isAuth, crawlingData.inputStimulusInfo);

export default router;