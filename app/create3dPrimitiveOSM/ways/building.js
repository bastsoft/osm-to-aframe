import {calculateAngleBetweenTwoStraight, calculateLengthSegment, calculateMidPoint} from "../../math.js";

const buildingByWay = function (way, world) {
    return _building(way, world);
};

const _building = function (way, world, relationTag = {}) {
    const tag = Object.assign({}, way.tag || {}, relationTag);
    const elem = [];
    const currentNd = way.nd;
    const levels = Number(tag["building:levels"]) || 1;
    const minLevel = Number(tag["building:min_level"]) || 0;

    const height = Number(tag["height"]) || (4 * levels);
    const minHeight = Number(tag["min_height"]) || (4 * minLevel);

    let lastPoint = null;
    const verticesArrayRoof = [];
    Object.keys(currentNd).forEach(function (index) {
        const ref = currentNd[index].ref;
        const currentPoint = world.node[ref].point;


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

    createBuildingCover(elem, verticesArrayRoof, height, minHeight);

    return ['a-entity', {}, elem];
};


const createBuildingCover = function (elem, verticesArrayRoof, height, minHeight) {
    if (verticesArrayRoof.length > 2) {
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
    }
};

const buildingByRelation = function (relation, world) {
    const elem = [];
    const currentMembers = (Array.isArray(relation.member)) ? relation.member : [relation.member];

    memberLoop(currentMembers, world, relation.tag, elem);

    return ['a-entity', {}, elem];
};

const memberLoop = function (currentMembers, world, relationTag, elem) {
    currentMembers.forEach(function (member) {
        if (Array.isArray(member)) {
            memberLoop(member, world, relationTag, elem);
        } else {
            memberProcessing(member, world, relationTag, elem);
        }
    });
};

const memberProcessing = function (member, world, relationTag, elem) {
    if (member.type === "way" && world.way[Number(member.ref)]) {
        elem.push(_building(world.way[Number(member.ref)], world, relationTag));
    }
    if (member.type === "relation" && Boolean(world.relation[member.ref])) {
        console.log("YES");
        elem.push(buildingByRelation(world.relation[member.ref], world));
    }
};


export {buildingByWay, buildingByRelation};