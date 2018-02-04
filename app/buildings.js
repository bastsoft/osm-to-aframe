import {calculateAngleBetweenTwoStraight, calculateLengthSegment, calculateMidPoint} from "./math.js";

const buildingByWay = function (way, world) {
    const elem = [];
    const currentNd = way.nd;
    let levels = Number(way.tag["building:levels"]);

    let height = 4 * levels;

    let lastPoint = null;
    const verticesArrayRoof = [];
    Object.keys(currentNd).forEach(function (index) {
        const ref = currentNd[index]._ref;
        const currentPoint = world.nodesObj[ref].point;


        if (lastPoint) {
            verticesArrayRoof.push([currentPoint.x, height, currentPoint.y].join(" "));
            const trueWidth = calculateLengthSegment(currentPoint.x, currentPoint.y, lastPoint.x, lastPoint.y);
            const m1 = calculateMidPoint(currentPoint.x, lastPoint.x, currentPoint.y, lastPoint.y);

            const ang = calculateAngleBetweenTwoStraight(
                {X: m1.x, Y: m1.y},
                {X: Number(lastPoint.x), Y: Number(lastPoint.y)},
                {X: Number(m1.x + (trueWidth / 2)), Y: Number(m1.y)}
            );

            const countWindow = trueWidth / 12;
            const vertices = [m1.x, height / 2, m1.y].join(" ");
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
        geometry: "primitive: roof; vertices: " + verticesArrayRoof.join(", "),
        material: 'side:double'
    }]);

    return ['a-entity', {}, elem];
};

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

            if (way.tag.highway === "footway") {
                height = 4;
                color = "orange"
            }

            if (way.tag.highway === "service") {
                height = 8;
                color = "gray"
            }

            if (way.tag.highway === "residential") {
                height = 10;
                color = "silver"
            }

            if (way.tag.highway === "secondary") {
                height = 12;
                color = "gainsboro"
            }

            if (color === "red") {
                console.log(way.tag.highway);
            }


            elem.push(['a-plane', {
                position: [m1.x, 0.01, m1.y].join(" "),
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

const createBuildings = function (world) {
    const elem = [];
    Object.keys(world.relation).forEach(function (relationKey) {
        const relation = world.relation[relationKey];

        console.log(relation.tag);
    });

    console.log("way");
    //обработка ways
    Object.keys(world.ways).forEach(function (wayKey) {
        let way = world.ways[wayKey];
        const tag = way.tag;


        if (tag.building) {
            //tag.v ===  назначение здание может быть "yes" "hospital" "commercial"  и тп
            elem.push(buildingByWay(way, world));
            way = null;
        }

        if (tag.highway) {
            elem.push(creationHighway(way, world));
            way = null;
        }

        if (way) {
            //console.log(way.tag);
        }
    });

    return ['a-entity', {}, elem];
};

export default createBuildings;

