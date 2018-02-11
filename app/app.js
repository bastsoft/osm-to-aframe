import {calculateLengthSegment} from './math.js';
import World from './world.js';
import processingWays from './create3dPrimitiveOSM/create3dPrimitiveOSM.js';
import createCamera from './camera/createCamera.js';


const world = new World();

const createWorld = function (XMLDataJson, sceneEl) {
    world.setData(XMLDataJson);

    const showAllNode = function () {
        const elem = [];

        Object.keys(world.nodesObj).forEach(function (id) {
            const currentPoint = world.nodesObj[id].point;

            elem.push(['a-dodecahedron', {
                position: [currentPoint.x, 0, currentPoint.y].join(" "),
                color: "#CCC",
                radius: "0.1"
            }]);
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

        return ['a-plane', {
            position: [world.midpointBounds.x, 0, world.midpointBounds.y],
            rotation: "-90 0 0",
            width: widthBounds,
            height: heightBounds,
            color: "#7BC8A4"
        }];
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
        ['a-sky', {src: "#sky"}],
        createCamera(world),
        //showAllNode(),
        showBounds(),
        processingWays(world)
    ]];

    sceneEl.appendChild(createElem(elementJson));
};

const runApp = function (lat, lon, radius) {
    world.getData(lat, lon, radius).then(function (XMLDataJson) {
        const sceneEl = document.querySelector('a-scene');
        createWorld(XMLDataJson, sceneEl);
    });
};

export {runApp as default};

