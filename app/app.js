import preprocessing from './preprocessing.js';
import createWorld from './createWorld.js';
import {getBbox} from "./mercator.js";


const run = function (lat, lon, radius) {
    getData(lat, lon, radius).then(json => createWorld(json, document.querySelector('a-scene')));
};

const getData = function (lat, lon, radius) {
    let getDataFunction = null;

    if (lat === 55.15556 && lon === 61.40892 && radius === 200) {
        getDataFunction = fetch('stub/data.json')
    } else {
        getDataFunction = _getDataFromHeroku(lat, lon, radius);
    }

    return getDataFunction.then(response => response.json())
        .then(str => preprocessing(str));
};

const _getDataFromHeroku = function (lat, lon, radius) {
    const urlResurse = "https://blooming-beach-75686.herokuapp.com";//http://www.openstreetmap.org
    const mainUrl = urlResurse + "/api/0.6/map?bbox=";
    const bbox = getBbox(lon, lat, radius);

    return fetch(mainUrl + [bbox.leftLon, bbox.bottomLat, bbox.rightLon, bbox.topLat].join(","), {
        mode: "cors"
    });
};

export {
    run,
    getData,
    getBbox
};

