import express from 'express';
import * as crawlingData from '../controller/get_data.js';

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
// router.get('/:page/viewCount/:viewCount', crawlingData.getPage);
router.get("/:page/viewCount/:viewCount", crawlingData.getPage);

router.get("/:days", crawlingData.getAverage);


export default router;