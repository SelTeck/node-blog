import * as dataRepository from '../data/data.js';

export async function getAll(req, res) {
    console.log('called getAll function');
    const data = await dataRepository.getAll();
    res.status(200).json(data);
}

// Get records/:page/:viewCount
export async function getPage(req, res) {
    console.log('called getPage function');
    // let page = req.query.page;
    // let viewCount = req.query.viewCount;
    let page = req.params.page;
    let viewCount = req.params.viewCount;

    console.log(`page is ${page} and viewCount is ${viewCount}`);

    const data = await dataRepository.getPaging(page ? page : 1, viewCount ? viewCount: 10);
    res.status(200).json(data);
}

// Get records/detail/:rssIndex
export async function getContent(req, res) {
    console.log('called getContent function');

    let rssIndex = req.params.rssIndex;
    console.log(`rssIndex is ${rssIndex}`);
    const data = await dataRepository.getContent(rssIndex);

    if (data.length != 0) {
        res.status(200).json(data);
    } else {
        res.status(401).json({message: 'The data is not available.'});
    }
}

export async function getPainAverage(req, res) {
    console.log('called getAverage function');
    let day = req.params.days;
    const data = await dataRepository.getPainAverage(day);
    res.status(200).json(data);
}