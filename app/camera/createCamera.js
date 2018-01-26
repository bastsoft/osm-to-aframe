const createCamera = function (world) {
    return [
        'a-entity',
        {
            position: [0, 1.8, 0].join(" "),
            camera: "userHeight: 1.8",
            id: "mainUser",
            "look-controls": "",
            "mouse-cursor": "",
            "mwasd-controls": {acceleration: 300}
        },
        [
            ['a-entity', {
                cursor: "fuse: true; fuseTimeout: 500",
                position: "0 0 -1",
                geometry: "primitive: ring; radiusInner: 0.02; radiusOuter: 0.03",
                material: "color: black; shader: flat"
            }],
            ['a-entity', {
                id: "debugText",
                text: "value:Ne ponimaet\ntranslate\npoetomu tak ; color: red; width: 1;",
                position: "0 0 -1"
            }]
        ]
    ];
};

export default createCamera;