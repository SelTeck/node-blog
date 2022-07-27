import express from 'express';

const router = express.Router();

// get All Crawling Data
router.get("/", (req, res, next) => {

});

// get Crawling Data to paging
router.get("/:page")