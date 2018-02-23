import preprocessing from './preprocessing.js';
import createWorld from './createWorld.js';
import {getBbox} from "./mercator.js";

const run = function (lat, lon, radius) {
    getData(lat, lon, radius).then(json => createWorld(json, document.querySelector('a-scene')));
};

const getData = function (lat, lon, radius) {
    const urlResurse = "https://blooming-beach-75686.herokuapp.com";//http://www.openstreetmap.org
    const mainUrl = urlResurse + "/api/0.6/map?bbox=";
    const bbox = getBbox(lon, lat, radius);

    return fetch(mainUrl + [bbox.leftLon, bbox.bottomLat, bbox.rightLon, bbox.topLat].join(","), {
        mode: "cors"
    })
        .then(response => response.text())
        .then(str => preprocessing(str))
    //.then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
    //.then(str => (new X2JS()).xml2json(str))
};

const init = function () {
    const latlon = (window.location.href.split("?")[1] || "").split("&");
    let lat = null;
    let lon = null;
    let radius = null;

    if (latlon.length > 2) {
        lat = latlon[0].split("=")[1];
        lon = latlon[1].split("=")[1];
        radius = latlon[2].split("=")[1].replace("#", "");
    }

    if (lat && lon && radius) {
        run(Number(lat), Number(lon), Number(radius));
    } else {
        run(55.15556, 61.40892, 200);
    }
};

export {
    init,
    getData,
    getBbox
};

