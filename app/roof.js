AFRAME.registerGeometry('roof', {
    schema: {
        vertices: {
            default: [],
        }
    },
    init: function (data) {
        const shape = new THREE.Shape();

        const vertices = data.vertices.map(function (vertex, index) {
            const points = vertex.split(' ').map(function (x) {
                return Number(x);
            });

            if (index === 0) {
                shape.moveTo(points[0], points[2]);
            } else {
                shape.lineTo(points[0], points[2]);
            }

            return points;
        });

        const geometry = new THREE.ShapeGeometry(shape);

        geometry.vertices = geometry.vertices.map(
            (vertex, i) => new THREE.Vector3(vertex.x, vertices[i][1], vertex.y)
        );

        this.geometry = geometry;
    }
});
