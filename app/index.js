import {run} from './app.js';

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
    run(55.15556, 61.40892, 200); //- мой двор
    //run(55.75547233180139, 37.618315787003674, 200);
}