import preprocessing from './preprocessing.js';
import createWorld from './createWorld.js';
import {getBbox, converterMercator} from "./mercator.js";
import {calculateMidPoint} from "./math.js";


const run = function (lat, lon, radius) {
    getData(lat, lon, radius)
        .then((json) => {
            json.minPointBounds = converterMercator.ll2m(json.bounds[0][1], json.bounds[0][0]);
            json.maxPointBounds = converterMercator.ll2m(json.bounds[1][1], json.bounds[1][0]);
            json.midPointBounds = calculateMidPoint(
                json.maxPointBounds.x,
                json.minPointBounds.x,
                json.maxPointBounds.y,
                json.minPointBounds.y
            );

            const point = converterMercator.ll2m(lon, lat);

            json.freeMoveArea = [
                [point.x - radius / 2, point.y - radius / 2],
                [point.x - radius / 2, point.y - radius / 2]
            ];

            return preprocessing(json, json.midPointBounds);
        })
        .then(json => createWorld(json, document.querySelector('a-scene')));
};

const getData = function (lat, lon, radius) {
    let getDataFunction = null;
    const stubData = {
        "55.15556-61.40892-200": 'stub/data.json',
        "55.75547233180139-37.618315787003674-200": 'stub/dataMoscowRedSquare.json'
    };
    const keyForStub = lat + "-" + lon + "-" + radius;

    if (stubData[keyForStub]) {
        getDataFunction = fetch(stubData[keyForStub])
    } else {
        getDataFunction = _getDataFromHeroku(lat, lon, radius);
    }

    return getDataFunction.then(response => response.json());
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

