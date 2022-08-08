import express from 'express';
import * as crawlingData from '../data/get_data.js';

const router = express.Router();

// get All Crawling Data
router.get("/", (req, res, next) => {
    res.send('Welcome! pain record data');
    crawlingData.getAll();

});

// get Crawling Data to paging
router.get("/:page", (req, rex, next) => {
    // req.
});

export default router;