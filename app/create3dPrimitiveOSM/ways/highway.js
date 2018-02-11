import {calculateAngleBetweenTwoStraight, calculateLengthSegment, calculateMidPoint} from "../../math.js";

const creationHighway = function (way, world) {
    const elem = [];
    const currentNd = way.nd;

    let lastPoint = null;
    Object.keys(currentNd).forEach(function (index) {
        const ref = currentNd[index]._ref;
        const currentPoint = world.nodesObj[ref].point;

        if (lastPoint) {
            const trueWidth = calculateLengthSegment(currentPoint.x, currentPoint.y, lastPoint.x, lastPoint.y);
            const m1 = calculateMidPoint(currentPoint.x, lastPoint.x, currentPoint.y, lastPoint.y);

            const ang = calculateAngleBetweenTwoStraight(
                {X: m1.x, Y: m1.y},
                {X: Number(lastPoint.x), Y: Number(lastPoint.y)},
                {X: Number(m1.x + (trueWidth / 2)), Y: Number(m1.y)}
            );

            let height = 1;
            let color = "red";
            let zindex = 0.01;

            if (way.tag.highway === "footway") {
                height = 4;
                color = "orange";
                zindex = 0.02;
            }

            if (way.tag.highway === "service") {
                height = 8;
                color = "gray";
                zindex = 0.03;
            }

            if (way.tag.highway === "residential") {
                height = 10;
                color = "silver";
                zindex = 0.04;
            }

            if (way.tag.highway === "secondary") {
                height = 12;
                color = "gainsboro";
                zindex = 0.05;
            }

            if (color === "red") {
                console.log(way.tag.highway);
            }


            elem.push(['a-plane', {
                position: [m1.x, zindex, m1.y].join(" "),
                rotation: "-90 " + ang + " 0",
                width: trueWidth,
                height: height,
                color: color,
            }]);
        }

        lastPoint = currentPoint;
    });

    return ['a-entity', {}, elem];
};

export default creationHighway;