export default  {
    schema: {},

    init: function () {
        this.currentAxes = [];
        this.log("init");
        this.initGamepad();

        window.addEventListener("gamepadconnected", (e) => {
            this.log("connected new gamepad");
            this.initGamepad();
        });

        window.addEventListener("gamepaddisconnected", (e) => {
            this.log("gamepaddisconnected");
        });
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

    update: function () {
        this.log("update");
    },
    tick: function (time, delta) {
        const gp = this.getCurGamePads();
        const buttons = (gp.buttons || []);
        const cardboardPressed = (buttons[0] || {}).pressed;

        if (this.currentAxes.toString() !== (gp.axes || []).toString()) {
            this.checkChangeAxes(gp.axes);
        }

        if (cardboardPressed !== this.oldCardboardPressed) {
            this.checkChangeButtonCardboard(cardboardPressed, delta);
        }
    },


    checkChangeButtonCardboard(cardboardPressed, delta) {
        this.log("checkChangeButtonCardboard : " + cardboardPressed);

        if (cardboardPressed) {
            this.updateAttributePosition(delta);
        }

        this.oldCardboardPressed = cardboardPressed;
    },

    updateAttributePosition(delta) {
        this.log("updateAttributePosition");
        this.log(delta);

        if (!this.elUser) {
            this.elUser = document.querySelector('#mainUser');
        }


        // this.log(JSON.stringify(el || ["NOTVALUE"]));
        // const position = this.position;
        // this.log(JSON.stringify(position || ["NOTVALUE"]));

        const currentPosition = this.elUser.getAttribute('position');
        //this.log(currentPosition.x);
        //const movementVector = this.getMovementVector(delta);
        currentPosition.x = currentPosition.x + 1;
        currentPosition.y = currentPosition.y + 1;
        currentPosition.z = currentPosition.z + 1;
        this.elUser.setAttribute('position', currentPosition);
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
        let eventObj = document.createEvent("Events");
        let eventType = "keyup";

        if (x !== 0) {
            eventType = "keydown";
            this.curKeyCodeX = x === 1 ? '68' : '65';
            this.log("x : " + x);
        }

        eventObj.initEvent(eventType, true, true);
        eventObj.keyCode = this.curKeyCodeX;
        document.dispatchEvent(eventObj);
    },

    changeY(y) {
        let eventObj = document.createEvent("Events");
        let eventType = "keyup";

        if (y !== 0) {
            eventType = "keydown";
            this.curKeyCodeY = y === 1 ? '83' : '87';
            this.log("y : " + y);
        }

        eventObj.initEvent(eventType, true, true);
        eventObj.keyCode = this.curKeyCodeY;
        document.dispatchEvent(eventObj);
    },

    remove: function () {
        this.log("remove");
    },
    pause: function () {
        this.log("pause");
    },
    play: function () {
        this.log("play");
    }
}