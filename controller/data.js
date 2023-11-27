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

    const data = await dataRepository.getRssList(page, viewCount);
    res.status(200).json(data);
}

// Get records/detail/:rssIndex
export async function getContent(req, res) {
    console.log('called getContent function');

    let rss_index = req.params.rss_index;
    
    const result = await dataRepository.getContent(rss_index);

    if (result.length != 0) {
        res.status(200).json(result[0]);
    } else {
        res.status(401).json({message: 'The data is not available.'});
    }
}

// get records/page/viewCount
export async function getPainInfo(req, res, next) {
    console.log('called getAverage function');
    let day = req.params.days;
    const result = await dataRepository.getPainInfo(day);

    res.status(200).json(result);
}

// Post records/input/daily
export async function inputDailyComments(req, res, next) {
    console.log('called inputDailyComments function');
    const { crawlingIdx, takeMorning, takeEvening, antiAnalgesic, 
        narcoticAnalgesic, usePath, activeMode, sleepMode, chargingStimulus, comment } = req.body;
    

     let result = await dataRepository.inputDailyComments(crawlingIdx, takeMorning, takeEvening, 
        antiAnalgesic, narcoticAnalgesic, usePath, activeMode, sleepMode, chargingStimulus, comment);

    if (!result) {
        return res.status(401).json({message: 'Failed enter DailyComments information.'});
    }

    res.status(200).json({message: "OK"});
}

// Get records/data/daily:
export async function getDailyComments(req, res, next) {
    console.log('called getDailyComments function');

    let blogIndex = req.params.blogIndex;

    let result = await dataRepository.getDailyComments(blogIndex);

    if (!result) {
        return res.status(401).json({message: 'Failed search DailyComments information.'});
    }

    res.status(200).json(result);
}

// Update records/data/update/daily
export async function updateDailyComments(req, res, next) {
    console.log('called updateDailyComments function');

    const { crawlingIdx, takeMorning, takeEvening, antiAnalgesic, 
        narcoticAnalgesic, usePath, activeMode, sleepMode, chargingStimulus, comment} = req.body;

    
    let result = await dataRepository.updateDailyComments(crawlingIdx, takeMorning, takeEvening, antiAnalgesic, 
        narcoticAnalgesic, usePath, activeMode, sleepMode, chargingStimulus, comment);

    if (!result) {
        return res.status(401).json({message: 'Failed update of DailyComments.'});
    }

    res.status(200).json({message: 'OK'});
}

// POST records/input/StimulusInfo
export async function inputStimulusInfo(req, res, next) {
    console.log('called inputStimulusInfo function');
    let {type, upright, lyingFront, lyingBack,lyingLeft, lyingRight, reclining} = req.body;
    
    let result = await dataRepository.inputStimulusInfo(type, upright, lyingFront, lyingBack,
        lyingLeft, lyingRight, reclining );

    if (!result) {
        return res.status(401).json({message: 'Failed enter this information.'});
    }

    res.status(409).json({message: "OK"});
}

// GET records/data/stimulus/info
export async function getStimulusInfo(req, res, next) {
    console.log('called getStimulusInfo function');

    let result = await dataRepository.getStimulusInfo();

    if (!result) {
        return res.status(401).json({message: 'Failed search Stimulus information.'});
    }

    res.status(200).json(result);   
}

// PUT records/
export async function updateStimulusInfo(req, res, next) {
    console.log('called updateStimulusInfo function');
    let crawlingIdx = req.params.crawlingIdx;
    let {activeMode, sleepMode, charging} = req.body;

    let result = await dataRepository.updateStimulusInfo(crawlingIdx, activeMode, sleepMode, charging);
    if (!result) {
        return res.status(401).json({message: 'Failed update this information.'});
    }
    
    res.status(200).json({message: "Update Succeed!!"});
}