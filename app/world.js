import {calculateMidPoint} from "./math.js";
import mercator from "./mercator.js";

class World {
    setData(XMLDataJson) {
        const nodes = XMLDataJson.osm.node;
        this.ways = XMLDataJson.osm.way;
        this.bounds = XMLDataJson.osm.bounds;
        this.minPointBounds = mercator.ll2m(this.bounds._minlon, this.bounds._minlat);
        this.maxPointBounds = mercator.ll2m(this.bounds._maxlon, this.bounds._maxlat);

        this.midpointBounds = calculateMidPoint(
            this.maxPointBounds.x,
            this.minPointBounds.x,
            this.maxPointBounds.y,
            this.minPointBounds.y
        );

        this.nodesObj = Object.keys(nodes).reduce(function (acc, key) {
            const id = nodes[key]._id;
            acc[id] = nodes[key];

            return acc;
        }, {});
    }

    getData(lat, lon, radius) {
        const urlResurse = "https://blooming-beach-75686.herokuapp.com";//http://www.openstreetmap.org
        const mainUrl = urlResurse + "/api/0.6/map?bbox=";
        const point = mercator.ll2m(lon, lat);
        const point1 = mercator.m2ll(point.x - radius, point.y - radius);
        const point2 = mercator.m2ll(point.x + radius, point.y + radius);
        const bbox = {
            left: point1.lon,
            bottom: point1.lat,
            right: point2.lon,
            top: point2.lat
        };

        return fetch(mainUrl + [bbox.left, bbox.bottom, bbox.right, bbox.top].join(","), {
            mode: "cors"
        })
            .then(response => response.text())
            .then(str => (new window.DOMParser()).parseFromString(str, "text/xml"))
            .then(str => (new X2JS()).xml2json(str))
    }

    convertPoint(pointObj) {
        const point = mercator.ll2m(pointObj._lon, pointObj._lat);
        const x = this.midpointBounds.x - point.x;
        const y = this.midpointBounds.y - point.y;

        return {
            'x': y,
            'y': x
        }
    }
}

export {World as default};