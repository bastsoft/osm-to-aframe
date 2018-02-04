AFRAME.registerGeometry('roof', {
    schema: {
        vertices: {
            default: [],
        }
    },
    init: function (data) {
        const shape = new THREE.Shape();

        data.vertices.forEach(function (vertex, index) {
            const points = vertex.split(' ').map(function (x) {
                return parseInt(x);
            });

            if (index === 0) {
                shape.moveTo(points[0], points[2]);
            } else {
                shape.lineTo(points[0], points[2]);
            }
        });

        const geometry = new THREE.ShapeGeometry(shape);

        geometry.vertices = geometry.vertices.map(function (vertex, i) {
            const points = data.vertices[i].split(' ').map(function (x) {
                return parseInt(x);
            });

            return new THREE.Vector3(vertex.x, points[1], vertex.y);
        });

        this.geometry = geometry;
    }
});

AFRAME.registerGeometry('roof2', {
    schema: {
        vertices: {
            default: [],
        }
    },
    init: function (data) {
        const geometry = new THREE.Geometry();

        const vertices = data.vertices.map(function (vertex) {
            return vertex.split(' ').map(function (x) {
                return parseInt(x);
            });
        });

        console.log(vertices);

        geometry.vertices = vertices.map(function (vertex) {
            return new THREE.Vector3(vertex[0], vertex[1], vertex[2]);
        });

        const triangles = THREE.ShapeUtils.triangulateShape(geometry.vertices, []);

        geometry.computeBoundingBox();

        for (let i = 0; i < triangles.length; i++) {
            geometry.faces.push(new THREE.Face3(triangles[i][0], triangles[i][1], triangles[i][2]));
        }


        // geometry.faces.push(new THREE.Face3(3, 4, 5));
        // geometry.faces.push(new THREE.Face3(5, 6, 7));
        geometry.mergeVertices();
        geometry.computeFaceNormals();
        geometry.computeVertexNormals();
        this.geometry = geometry;
    }
});