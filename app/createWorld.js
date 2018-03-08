import {processingWays, processingRelation} from "./create3dPrimitiveOSM/create3dPrimitiveOSM.js";
import {calculateLengthSegment} from "./math.js";
import createCamera from "./camera/createCamera.js";

const createWorld = function (json, sceneEl) {
    const showAllNode = function () {
        const elem = [];

        Object.keys(json.node).forEach(function (id) {
            const currentPoint = json.node[id].point;

            elem.push(['a-dodecahedron', {
                position: [currentPoint.x, 0, currentPoint.y].join(" "),
                color: "#CCC",
                radius: "0.1"
            }]);
        });

        return ['a-entity', {}, elem];
    };

    const showBounds = function () {
        const minPoint = json.minPointBounds;
        const maxPoint = json.maxPointBounds;

        const heightBounds = calculateLengthSegment(
            minPoint.x, minPoint.y, maxPoint.x, minPoint.y
        );
        const widthBounds = calculateLengthSegment(
            minPoint.x, minPoint.y, minPoint.x, maxPoint.y
        );

        return ['a-plane', {
            position: [json.midPointBounds.x, 0, json.midPointBounds.y],
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
        createCamera(json),
        //showAllNode(),
        showBounds(),
        processingWays(json),
        processingRelation(json)
    ]];

    sceneEl.appendChild(createElem(elementJson));
};

export {createWorld as default};