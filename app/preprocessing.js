import {calculateMidPoint} from "./math.js";
import {converterMercator} from "./mercator.js";


const preprocessing = function (json) {
    json.minPointBounds = converterMercator.ll2m(json.bounds[0][1], json.bounds[0][0]);
    json.maxPointBounds = converterMercator.ll2m(json.bounds[1][1], json.bounds[1][0]);
    json.midpointBounds = calculateMidPoint(
        json.maxPointBounds.x,
        json.minPointBounds.x,
        json.maxPointBounds.y,
        json.minPointBounds.y
    );

    Object.keys(json.node || {}).forEach((key) => {
        const currentNode = json.node[key];

        if (currentNode.LatLng) {
            currentNode.point = convertPoint(currentNode.LatLng, json.midpointBounds);
        }
    });

    return json;
};

const convertPoint = function (latLng, midpointBounds) {
    const point = converterMercator.ll2m(latLng[1], latLng[0]);

    return {
        'x': midpointBounds.y - point.y,
        'y': midpointBounds.x - point.x
    }
};

export {preprocessing as default};