import {calculateAngleBetweenTwoStraight, calculateLengthSegment, calculateMidPoint} from "./math.js";

const buildingByWay = function (way, world) {
    const elem = [];
    const currentNd = way.nd;
    let height = 4;

    const tags = way.tag || {};

    Object.keys(tags).forEach(function (key) {
        const tag = tags[key] || {};
        if (tag._k === "building:levels") {
            height = height * Number(tag._v);
        }
    });

    let lastPoint = null;
    Object.keys(currentNd).forEach(function (index) {
        const ref = currentNd[index]._ref;
        const currentPoint = world.convertPoint(world.nodesObj[ref]);

        if (lastPoint) {
            const trueWidth = calculateLengthSegment(currentPoint.x, currentPoint.y, lastPoint.x, lastPoint.y);
            const m1 = calculateMidPoint(currentPoint.x, lastPoint.x, currentPoint.y, lastPoint.y);

            const ang = calculateAngleBetweenTwoStraight(
                {X: m1.x, Y: m1.y},
                {X: Number(lastPoint.x), Y: Number(lastPoint.y)},
                {X: Number(m1.x + (trueWidth / 2)), Y: Number(m1.y)}
            );

            elem.push(['a-plane', {
                position: [m1.x, height / 2, m1.y].join(" "),
                rotation: "0 " + ang + " 0",
                width: trueWidth,
                height: height,
                color: "orange"
            }]);

            elem.push(['a-plane', {
                position: [m1.x, height / 2, m1.y].join(" "),
                rotation: "0 " + (ang + 180) + " 0",
                width: trueWidth,
                height: height,
                color: "orange"
            }]);
        }

        lastPoint = currentPoint;
    });

    return ['a-entity', {}, elem];
};

const createBuildings = function (world) {
    const elem = [];

    Object.keys(world.ways).forEach(function (wayKey) {
        const tags = world.ways[wayKey].tag || {};

        Object.keys(tags).forEach(function (key) {
            const tag = tags[key] || {};
            if (tag._k === "building") {
                //tag.v ===  назначение здание может быть "yes" "hospital" "commercial"  и тп
                elem.push(buildingByWay(world.ways[wayKey], world));
            }
        });
    });

    return ['a-entity', {}, elem];
};

export default createBuildings;

