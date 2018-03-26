AFRAME.registerComponent('building', {
    schema: {
        vertices: {
            default: [],
        },
        height: {
            default: 0
        }
    },

    /**
     * Initial creation and setting of the mesh.
     */
    init: function () {
        const data = this.data;
        const el = this.el;

        this.material = new THREE.MeshStandardMaterial({color: data.color});


        const pts = data.vertices.map(function (vertex) {
            const points = vertex.split(' ').map(function (x) {
                return Number(x);
            });

            return new THREE.Vector2(points[1], points[0]);
        });

        const shape = new THREE.Shape(pts);

        const extrudeSettings = {
            amount: Number(data.height),
            steps: 0,
            bevelEnabled: true,
            bevelThickness: 0,
            bevelSize: 0,
            bevelSegments: 1
        };

        this.geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        this.geometry.rotateX(THREE.Math.degToRad(-90));
        this.geometry.rotateY(THREE.Math.degToRad(-90));

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        el.setObject3D('mesh', this.mesh);
    },

    remove: function () {
        this.el.removeObject3D('mesh');
    }
});