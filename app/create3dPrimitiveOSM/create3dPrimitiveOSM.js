import {buildingByWay, buildingByRelation} from './ways/building.js';
import creationHighway from './ways/highway.js';

const processingWays = function (world) {
    const elem = [];

    Object.keys(world.way).forEach(function (wayKey) {
        let way = world.way[wayKey];
        const tag = (way.tag || {});

        if (tag.building) {
            elem.push(buildingByWay(way, world));
            way = null;
        }

        if (tag.highway) {
            elem.push(creationHighway(way, world));
            way = null;
        }
    });

    return ['a-entity', {class: "way"}, elem];
};

const processingRelation = function (world) {
    const elem = [];

    Object.keys(world.relation).forEach(function (relationKey) {
        let relation = world.relation[relationKey];
        const tag = (relation.tag || {});

        if (tag.building || tag.type === "building") {
            elem.push(buildingByRelation(relation, world));
            relation = null;
        }
    });

    return ['a-entity', {class: "relation"}, elem];
};

export {processingWays, processingRelation};

