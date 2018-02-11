import buildingByWay from './ways/building.js';
import creationHighway from './ways/highway.js';

const processingWays = function (world) {
    const elem = [];

    //обработка ways
    Object.keys(world.ways).forEach(function (wayKey) {
        let way = world.ways[wayKey];
        const tag = (way.tag || {});

        if (!way.tag) {
            console.log("not Tag: ", way);
        }

        if (tag.building) {
            elem.push(buildingByWay(way, world));
            way = null;
        }

        if (tag.highway) {
            elem.push(creationHighway(way, world));
            way = null;
        }
    });

    return ['a-entity', {}, elem];
};

export default processingWays;

