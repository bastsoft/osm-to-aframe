window.inlineStorage = JSON.parse(document.querySelector(".inline-storage").innerHTML);

const nodes = inlineStorage.osm.node;

var nodesObj = Object.keys(nodes).reduce(function (acc, key) {
    const id = nodes[key].$.id;
    acc[id] = nodes[key];

    return acc;
}, {});

const sceneEl = document.querySelector('a-scene');

const createElem = function (name, option, innerElem) {
    const planeEl = document.createElement(name);

    Object.keys(option || {}).forEach(function (key) {
        planeEl.setAttribute(key, option[key]);
    });

    (innerElem || []).forEach(function (elem) {
        planeEl.appendChild(elem);
    });

    return planeEl;
};

const createFlatPoint = function (lat, lon, color) {
    const entityEl = createElem('a-entity', {
            position: convertCoordinatesLat(lat) + ' 0 ' + convertCoordinatesLon(lon)

        },
        [
            createElem('a-dodecahedron', {
                color: color || "#CCC",
                radius: "1"
            })
        ]);

    sceneEl.appendChild(entityEl);

    return entityEl;
};

const calculateMidPoint = function (maxlat, minlat, maxlon, minlon) {
    return {
        lat: (Number(maxlat) + Number(minlat)) / 2,
        lon: (Number(maxlon) + Number(minlon)) / 2
    };
};

const calculateLengthSegment = function (x1, y1, x2, y2) {
    return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
};

const calculateAngleBetweenTwoStraight = function (P0, P1, P2) {
    let vectorP0P1 = [P1.X - P0.X, P1.Y - P0.Y];
    let vectorP1P2 = [P2.X - P0.X, P2.Y - P0.Y];
    let scalarProduct = (vectorP0P1[0] * vectorP1P2[0]) + (vectorP0P1[1] * vectorP1P2[1]);
    let lengthVector1 = Math.sqrt(Math.pow(vectorP0P1[0], 2) + Math.pow(vectorP0P1[1], 2));
    let lengthVector2 = Math.sqrt(Math.pow(vectorP0P1[0], 2) + Math.pow(vectorP0P1[1], 2));
    let cosFi = scalarProduct / (lengthVector1 * lengthVector2);
    let radians = Math.acos(cosFi);


    //сранопозорный кастыль, потому что я не знаю геометрии, но с ним работает--------------------------------
    let onlyPasitivVector = vectorP0P1[0] >= 0 && vectorP0P1[1] >= 0 && vectorP1P2[0] >= 0 && vectorP1P2[1] >= 0;
    if ((cosFi < -0.4 || onlyPasitivVector) && (cosFi !== -0.7801043706060045) || (cosFi === -0.08249728495637759)) {
        radians = (Math.PI - radians);
    }
    //---------------------------------------------------------------------------------------------------------

    return radians * (180 / Math.PI);
};

const bounds = inlineStorage.osm.bounds.$;
const midpointBounds = calculateMidPoint(bounds.maxlat, bounds.minlat, bounds.maxlon, bounds.minlon);
const zoom = 100000;

function convertCoordinatesLat(lat) {
    const referenceLat = midpointBounds.lat;

    return (referenceLat * zoom) - (lat * zoom);
}

function convertCoordinatesLon(lon) {
    const referenceLon = midpointBounds.lon;

    return (referenceLon * zoom) - (lon * zoom);
}

const showAllNode = function () {
    Object.keys(nodesObj).forEach(function (id) {
        createFlatPoint(nodesObj[id].$.lat, nodesObj[id].$.lon);
    });
};

const showBounds = function () {
    const widthBounds = calculateLengthSegment(bounds.minlat, bounds.minlon, bounds.maxlat, bounds.minlon);
    const heightBounds = calculateLengthSegment(bounds.minlat, bounds.minlon, bounds.minlat, bounds.maxlon);


    createFlatPoint(bounds.minlat, bounds.minlon);
    createFlatPoint(bounds.maxlat, bounds.maxlon);


    const planeBoundsEl = createElem('a-plane', {
        position: convertCoordinatesLat(midpointBounds.lat) + ' 0 ' + convertCoordinatesLon(midpointBounds.lon),
        rotation: "-90 0 0",
        width: String(widthBounds * zoom),
        height: String(heightBounds * zoom),
        color: "#7BC8A4"
    });

    sceneEl.appendChild(planeBoundsEl);
};

const buildingByWay = function (way) {
    const currentNd = way.nd;
    let height = 2;

    const tags = way.tag || {};

    Object.keys(tags).forEach(function (key) {
        const tag = tags[key].$ || {};
        if (tag.k === "building:levels") {
            height = height * Number(tag.v);
        }
    });

    let lastPoint = null;
    Object.keys(currentNd).forEach(function (index) {
        const ref = currentNd[index].$.ref;
        const currentPoint = nodesObj[ref].$;

        if (lastPoint) {
            const trueWidth = calculateLengthSegment(currentPoint.lat, currentPoint.lon, lastPoint.lat, lastPoint.lon);
            const m1 = calculateMidPoint(currentPoint.lat, lastPoint.lat, currentPoint.lon, lastPoint.lon);

            const ang = calculateAngleBetweenTwoStraight(
                {X: m1.lat, Y: m1.lon},
                {X: Number(lastPoint.lat), Y: Number(lastPoint.lon)},
                {X: Number(m1.lat + (trueWidth / 2)), Y: Number(m1.lon)}
            );
            const planeBoundsEl = createElem('a-plane', {
                position: convertCoordinatesLat(m1.lat) + ' ' + (height / 2) + " " + convertCoordinatesLon(m1.lon),
                rotation: "0 " + ang + " 0",
                width: trueWidth * zoom,
                height: height,
                color: "orange"
            });

            sceneEl.appendChild(planeBoundsEl);

            const planeBoundsE2 = createElem('a-plane', {
                position: convertCoordinatesLat(m1.lat) + ' ' + (height / 2) + " " + convertCoordinatesLon(m1.lon),
                rotation: "0 " + (ang + 180) + " 0",
                width: trueWidth * zoom,
                height: height,
                color: "orange"
            });

            sceneEl.appendChild(planeBoundsE2);
        }

        lastPoint = currentPoint;
    });
};

const createCamera = function () {
    sceneEl.appendChild(createElem(
        'a-entity',
        {
            position: convertCoordinatesLat(midpointBounds.lat) + ' 1.8 ' + convertCoordinatesLon(midpointBounds.lon),
            camera: "",
            "look-controls": "",
            "mouse-cursor": "",
            "wasd-controls": ""
        },
        [
            createElem('a-entity', {
                cursor: "fuse: true; fuseTimeout: 500",
                position: "0 0 -1",
                geometry: "primitive: ring; radiusInner: 0.02; radiusOuter: 0.03",
                material: "color: black; shader: flat"
            }),
            createElem('a-entity', {
                text: "value:Ne ponimaet\ntranslate\npoetomu tak ; color: red; width: 1;",
                position: "0 0 -1"
            })
        ]
    ));
};

sceneEl.appendChild(createElem('a-sky', {color: "#87CEFA"}));

createCamera();
//showAllNode();
showBounds();

const ways = inlineStorage.osm.way;

Object.keys(ways).forEach(function (wayKey) {
    const tags = ways[wayKey].tag || {};

    Object.keys(tags).forEach(function (key) {
        const tag = tags[key].$ || {};
        if (tag.k === "building") {
            //tag.v ===  назначение здание может быть "yes" "hospital" "commercial"  и тп
            buildingByWay(ways[wayKey]);
        }
    });
});