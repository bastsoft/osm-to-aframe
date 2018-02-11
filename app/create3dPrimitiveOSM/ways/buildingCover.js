AFRAME.registerGeometry('buildingCover', {
    schema: {
        vertices: {
            default: [],
        },
        height: {
            default: 0
        }
    },
    init: function (data) {
        const shape = new THREE.Shape();

        data.vertices.forEach(function (vertex, index) {
            const points = vertex.split(' ').map(function (x) {
                return Number(x);
            });

            if (index === 0) {
                shape.moveTo(points[0], points[1]);
            } else {
                shape.lineTo(points[0], points[1]);
            }

            return points;
        });

        const geometry = new THREE.ShapeGeometry(shape);

        geometry.vertices = geometry.vertices.map(
            vertex => new THREE.Vector3(vertex.x, Number(data.height), vertex.y)
        );

        this.geometry = geometry;
    }
});
