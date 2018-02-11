import {calculateAngleBetweenTwoStraight, calculateLengthSegment, calculateMidPoint} from "../../math.js";

const buildingByWay = function (way, world) {
    const elem = [];
    const currentNd = way.nd;
    const levels = Number(way.tag["building:levels"]) || 1;
    const minLevel = Number(way.tag["building:min_level"]) || 0;
    const height = 4 * levels;
    const minHeight = 4 * minLevel;

    let lastPoint = null;
    const verticesArrayRoof = [];
    Object.keys(currentNd).forEach(function (index) {
        const ref = currentNd[index]._ref;
        const currentPoint = world.nodesObj[ref].point;


        if (lastPoint) {
            verticesArrayRoof.push([currentPoint.x, currentPoint.y].join(" "));
            const trueWidth = calculateLengthSegment(currentPoint.x, currentPoint.y, lastPoint.x, lastPoint.y);
            const m1 = calculateMidPoint(currentPoint.x, lastPoint.x, currentPoint.y, lastPoint.y);

            const ang = calculateAngleBetweenTwoStraight(
                {X: m1.x, Y: m1.y},
                {X: Number(lastPoint.x), Y: Number(lastPoint.y)},
                {X: Number(m1.x + (trueWidth / 2)), Y: Number(m1.y)}
            );

            const countWindow = trueWidth / 12;
            const vertices = [m1.x, (height / 2) + minHeight, m1.y].join(" ");
            elem.push(['a-plane', {
                position: vertices,
                rotation: "0 " + ang + " 0",
                width: trueWidth,
                height: height,
                color: "orange",
                material: "src: #window1; repeat: " + countWindow + " " + levels + "; side: double"
            }]);
        }

        lastPoint = currentPoint;
    });

    elem.push(['a-entity', {
        geometry: "primitive: buildingCover; vertices: " + verticesArrayRoof.join(", ") + "; height: " + (height + minHeight),
        material: 'side:double'
    }]);

    if (minHeight !== 0) {
        elem.push(['a-entity', {
            geometry: "primitive: buildingCover; vertices: " + verticesArrayRoof.join(", ") + "; height: " + minHeight,
            material: 'side:double'
        }]);
    }


    return ['a-entity', {}, elem];
};

export default buildingByWay;