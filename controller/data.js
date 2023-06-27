import * as dataRepository from '../data/data.js';

export async function getAll(req, res) {
    console.log('called getAll function');
    const data = await dataRepository.getAll();
    res.status(200).json(data);
}

// Get records/:page/:viewCount
export async function getRssList(req, res) {
    console.log('called getRssList function');
    // let page = req.query.page;
    // let viewCount = req.query.viewCount;
    let page = req.params.page;
    let viewCount = req.params.viewCount;

    console.log(`page is ${page} and viewCount is ${viewCount}`);

    const data = await dataRepository.getRssList(page, viewCount);
    res.status(200).json(data);
}

// Get records/detail/:rssIndex
export async function getContent(req, res) {
    console.log('called getContent function');

    let rss_index = req.params.rss_index;
    console.log(`rss_index is ${rss_index}`);
    const data = await dataRepository.getContent(rss_index);

    if (data.length != 0) {
        res.status(200).json(data[0]);
    } else {
        res.status(401).json({message: 'The data is not available.'});
    }
}

export async function getPainInfor(req, res) {
    console.log('called getAverage function');
    let day = req.params.days;
    const data = await dataRepository.getPainInfor(day);
    res.status(200).json(data);
}