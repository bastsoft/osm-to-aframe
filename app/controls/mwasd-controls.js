(function (AFRAME) {
    if (!AFRAME) {
        console.error('Component attempted to register before AFRAME was available.');
        return;
    }

    const KEYCODE_TO_CODE = {
        '38': 'ArrowUp',
        '37': 'ArrowLeft',
        '40': 'ArrowDown',
        '39': 'ArrowRight',
        '87': 'KeyW',
        '65': 'KeyA',
        '83': 'KeyS',
        '68': 'KeyD'
    };

    const shouldCaptureKeyEvent = function (event) {
        if (event.metaKey) {
            return false;
        }
        return document.activeElement === document.body;
    };

    const isEmptyObject = function (keys) {
        let key;
        for (key in keys) {
            return false;
        }
        return true;
    };

    const CLAMP_VELOCITY = 0.00001;
    const MAX_DELTA = 0.2;
    const KEYS = [
        'KeyW', 'KeyA', 'KeyS', 'KeyD',
        'ArrowUp', 'ArrowLeft', 'ArrowRight', 'ArrowDown'
    ];

    /**
     * WASD component to control entities using WASD keys.
     */
    (AFRAME.aframeCore || AFRAME).registerComponent('mwasd-controls', {
        schema: {
            acceleration: {default: 65},
            adAxis: {default: 'x', oneOf: ['x', 'y', 'z']},
            adEnabled: {default: true},
            adInverted: {default: false},
            easing: {default: 20},
            enabled: {default: true},
            fly: {default: false},
            wsAxis: {default: 'z', oneOf: ['x', 'y', 'z']},
            wsEnabled: {default: true},
            wsInverted: {default: false}
        },

        init: function () {
            // To keep track of the pressed keys.
            this.keys = {};

            this.position = {};
            this.velocity = new THREE.Vector3();

            this.log("init");
            this.initGamepad();

            window.addEventListener("gamepadconnected", (e) => {
                this.log("connected new gamepad");
                this.initGamepad();
            });

            window.addEventListener("gamepaddisconnected", (e) => {
                this.log("gamepaddisconnected");
            });

            // Bind methods and add event listeners.
            this.currentAxes = [];
            this.onBlur = this.onBlur.bind(this);
            this.onFocus = this.onFocus.bind(this);
            this.onKeyDown = this.onKeyDown.bind(this);
            this.onKeyUp = this.onKeyUp.bind(this);
            this.onVisibilityChange = this.onVisibilityChange.bind(this);
            this.attachVisibilityEventListeners();
        },

        log(text) {
            if (!this.debug) {
                this.debug = document.querySelector('#debugText');
                this.buffer = [];
            }

            this.buffer.push(text);
            this.buffer = this.buffer.slice(-40);

            this.debug.setAttribute('text', "value:" + this.buffer.join("\n") + " ; color: red; width: 1;");
            console.log(text);
        },

        initGamepad: function () {
            const gamepads = this.getGamePads();

            Object.keys(gamepads).forEach((key) => {
                const gp = gamepads[key];
                if (gp !== null) {
                    this.gpIndex = gp.index;
                    this.isCardboard = (gp.id.indexOf("Cardboard") !== -1);
                    this.currentAxes = [];
                    this.log(key);
                    this.log("new ->" + gp.id);
                }
            });
            this.log("-->" + this.getCurGamePads().id + "<--");
        },

        getCurGamePads() {
            return this.getGamePads()[this.gpIndex] || {};
        },

        getGamePads() {
            return navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
        },

        tick: function (time, delta) {
            const gp = this.getCurGamePads();
            const buttons = (gp.buttons || []);
            const cardboardBtnPressed = (buttons[0] || {}).pressed;

            let newGpAxes = (gp.axes || []).slice();

            if (!newGpAxes.toString()) {
                newGpAxes = [0, 0];
            }

            if (cardboardBtnPressed) {
                newGpAxes[1] = -1;
            }

            if (this.currentAxes.toString() !== newGpAxes.toString()) {
                this.checkChangeAxes(newGpAxes);
            }

            if (!this.el) {
                this.el = document.querySelector('#mainUser');
            }

            const el = this.el;
            const currentPosition = el.getAttribute('position');
            var data = this.data;
            var movementVector;
            var position = this.position;
            var velocity = this.velocity;

            if (!velocity[data.adAxis] && !velocity[data.wsAxis] &&
                isEmptyObject(this.keys)) {
                return;
            }

            // Update velocity.
            delta = delta / 1000;
            this.updateVelocity(delta);

            if (!velocity[data.adAxis] && !velocity[data.wsAxis]) {
                return;
            }

            // Get movement vector and translate position.
            movementVector = this.getMovementVector(delta);
            position.x = currentPosition.x + movementVector.x;
            position.y = currentPosition.y + movementVector.y;
            position.z = currentPosition.z + movementVector.z;
            el.setAttribute('position', position);
        },

        checkChangeAxes(newAxes) {
            const oldAxes = this.currentAxes;

            if (oldAxes[0] !== newAxes[0]) {
                this.changeX(newAxes[0]);
            }

            if (oldAxes[1] !== newAxes[1]) {
                this.changeY(newAxes[1]);
            }

            this.currentAxes = newAxes;
        },

        changeX(x) {
            if (x === 0) {
                delete this.keys[this.curKeyCodeX];
            } else {
                this.curKeyCodeX = x === 1 ? 'ArrowRight' : 'ArrowLeft';
                this.keys[this.curKeyCodeX] = true;
            }
        },

        changeY(y) {
            if (y === 0) {
                delete this.keys[this.curKeyCodeY];
            } else {
                this.curKeyCodeY = y === 1 ? 'ArrowDown' : 'ArrowUp';
                this.keys[this.curKeyCodeY] = true;
            }
        },


        remove: function () {
            this.removeKeyEventListeners();
            this.removeVisibilityEventListeners();
        },

        play: function () {
            this.attachKeyEventListeners();
        },

        pause: function () {
            this.keys = {};
            this.removeKeyEventListeners();
        },

        updateVelocity: function (delta) {
            var acceleration;
            var adAxis;
            var adSign;
            var data = this.data;
            var keys = this.keys;
            var velocity = this.velocity;
            var wsAxis;
            var wsSign;

            adAxis = data.adAxis;
            wsAxis = data.wsAxis;

            // If FPS too low, reset velocity.
            if (delta > MAX_DELTA) {
                velocity[adAxis] = 0;
                velocity[wsAxis] = 0;
                return;
            }

            // Decay velocity.
            if (velocity[adAxis] !== 0) {
                velocity[adAxis] -= velocity[adAxis] * data.easing * delta;
            }
            if (velocity[wsAxis] !== 0) {
                velocity[wsAxis] -= velocity[wsAxis] * data.easing * delta;
            }

            // Clamp velocity easing.
            if (Math.abs(velocity[adAxis]) < CLAMP_VELOCITY) {
                velocity[adAxis] = 0;
            }
            if (Math.abs(velocity[wsAxis]) < CLAMP_VELOCITY) {
                velocity[wsAxis] = 0;
            }

            if (!data.enabled) {
                return;
            }

            // Update velocity using keys pressed.
            acceleration = data.acceleration;
            if (data.adEnabled) {
                adSign = data.adInverted ? -1 : 1;
                if (keys.KeyA || keys.ArrowLeft) {
                    velocity[adAxis] -= adSign * acceleration * delta;
                }
                if (keys.KeyD || keys.ArrowRight) {
                    velocity[adAxis] += adSign * acceleration * delta;
                }
            }
            if (data.wsEnabled) {
                wsSign = data.wsInverted ? -1 : 1;
                if (keys.KeyW || keys.ArrowUp) {
                    velocity[wsAxis] -= wsSign * acceleration * delta;
                }
                if (keys.KeyS || keys.ArrowDown) {
                    velocity[wsAxis] += wsSign * acceleration * delta;
                }
            }
        },

        getMovementVector: (function () {
            var directionVector = new THREE.Vector3(0, 0, 0);
            var rotationEuler = new THREE.Euler(0, 0, 0, 'YXZ');

            return function (delta) {
                var rotation = this.el.getAttribute('rotation');
                var velocity = this.velocity;
                var xRotation;

                directionVector.copy(velocity);
                directionVector.multiplyScalar(delta);

                // Absolute.
                if (!rotation) {
                    return directionVector;
                }

                xRotation = this.data.fly ? rotation.x : 0;

                // Transform direction relative to heading.
                rotationEuler.set(THREE.Math.degToRad(xRotation), THREE.Math.degToRad(rotation.y), 0);
                directionVector.applyEuler(rotationEuler);
                return directionVector;
            };
        })(),

        attachVisibilityEventListeners: function () {
            window.addEventListener('blur', this.onBlur);
            window.addEventListener('focus', this.onFocus);
            document.addEventListener('visibilitychange', this.onVisibilityChange);
        },

        removeVisibilityEventListeners: function () {
            window.removeEventListener('blur', this.onBlur);
            window.removeEventListener('focus', this.onFocus);
            document.removeEventListener('visibilitychange', this.onVisibilityChange);
        },

        attachKeyEventListeners: function () {
            window.addEventListener('keydown', this.onKeyDown);
            window.addEventListener('keyup', this.onKeyUp);
        },

        removeKeyEventListeners: function () {
            window.removeEventListener('keydown', this.onKeyDown);
            window.removeEventListener('keyup', this.onKeyUp);
        },

        onBlur: function () {
            this.pause();
        },

        onFocus: function () {
            this.play();
        },

        onVisibilityChange: function () {
            if (document.hidden) {
                this.onBlur();
            } else {
                this.onFocus();
            }
        },

        onKeyDown: function (event) {
            var code;
            if (!shouldCaptureKeyEvent(event)) {
                return;
            }
            code = event.code || KEYCODE_TO_CODE[event.keyCode];
            if (KEYS.indexOf(code) !== -1) {
                this.keys[code] = true;
            }
        },

        onKeyUp: function (event) {
            var code;
            code = event.code || KEYCODE_TO_CODE[event.keyCode];

            delete this.keys[code];
        }
    });

}(window.AFRAME));
