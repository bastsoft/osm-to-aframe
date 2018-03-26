AFRAME.registerGeometry('buildingCover', {
    schema: {
        vertices: {default: []},
        height: {default: 0}
    },
    init: function (data) {
        const pts = data.vertices.map(function (vertex) {
            const points = vertex.split(' ').map(x => Number(x));

            return new THREE.Vector2(points[0], points[1]);
        });
        const shape = new THREE.Shape(pts);
        const geometry = new THREE.ShapeGeometry(shape);

        geometry.vertices = geometry.vertices.map(
            v => new THREE.Vector3(v.x, Number(data.height), v.y)
        );

        this.geometry = geometry;
    }
});
