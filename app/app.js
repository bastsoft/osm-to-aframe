import {calculateLengthSegment} from './math.js';
import World from './world.js';
import createBuildings from './buildings.js';
import createCamera from './camera/createCamera.js';


const world = new World();

const createWorld = function (XMLDataJson, sceneEl) {
    world.setData(XMLDataJson);

    const createFlatPoint = function (x, y, color) {
        return ['a-dodecahedron', {
            position: [x, 0, y].join(" "),
            color: color || "#CCC",
            radius: "1"
        }];
    };

    const showAllNode = function () {
        const elem = [];

        Object.keys(world.nodesObj).forEach(function (id) {
            const currentPoint = world.convertPoint(world.nodesObj[id]);

            elem.push(createFlatPoint(currentPoint.x, currentPoint.y));
        });

        return ['a-entity', {}, elem];
    };

    const showBounds = function () {
        const minPoint = world.minPointBounds;
        const maxPoint = world.maxPointBounds;

        const heightBounds = calculateLengthSegment(
            minPoint.x, minPoint.y, maxPoint.x, minPoint.y
        );
        const widthBounds = calculateLengthSegment(
            minPoint.x, minPoint.y, minPoint.x, maxPoint.y
        );

        return ['a-entity', {}, [
            createFlatPoint(minPoint.x, minPoint.y),
            createFlatPoint(maxPoint.x, maxPoint.y),
            ['a-plane', {
                position: [world.midpointBounds.x, 0, world.midpointBounds.y],
                rotation: "-90 0 0",
                width: widthBounds,
                height: heightBounds,
                color: "#7BC8A4"
            }]
        ]];
    };

    const createElem = function (arrElem) {
        const name = arrElem[0];
        const option = arrElem[1];
        const innerElem = arrElem[2];
        const planeEl = document.createElement(name);

        Object.keys(option || {}).forEach(function (key) {
            planeEl.setAttribute(key, option[key]);
        });

        (innerElem || []).forEach(function (elem) {
            planeEl.appendChild(createElem(elem));
        });

        return planeEl;
    };

    const elementJson = ['a-entity', {}, [
        ['a-sky', {color: "#87CEFA"}],
        createCamera(world),
        //showAllNode(),
        showBounds(),
        createBuildings(world)
    ]];

    sceneEl.appendChild(createElem(elementJson));
};

const runApp = function (lat, lon, radius) {
    world.getData(lat, lon, radius).then(function (XMLDataJson) {
        const sceneEl = document.querySelector('a-scene');
        createWorld(XMLDataJson, sceneEl);
    }).catch(alert);
};

export {runApp as default};

