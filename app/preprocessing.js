import {converterMercator} from "./mercator.js";


const preprocessing = function (json, midPointBounds) {
    Object.keys(json.node || {}).forEach((key) => {
        const currentNode = json.node[key];

        if (currentNode.LatLng) {
            currentNode.point = convertPoint(currentNode.LatLng, midPointBounds);
        }
    });

    return json;
};

const convertPoint = function (latLng, midPointBounds) {
    const point = converterMercator.ll2m(latLng[1], latLng[0]);

    return {
        'x': midPointBounds.y - point.y,
        'y': midPointBounds.x - point.x
    }
};

export {preprocessing as default};