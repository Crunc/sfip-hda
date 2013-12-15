/**
 * Contains values for events that are triggered by a door.
 */
var DoorEvent = {
    /**
     * Indicates that a door has been clicked.
     */
    CLICKED: "Door.Clicked",

    /**
     * Indicates that a door has been opened.
     */
    OPENED: "Door.Opened"
};

/**
 * Contains values for Door.options.state.
 */
var DoorState = {
    /**
     * Indicates that the door is open. A door remains open until the user decides to click another door.
     *
     * @type {string}
     */
    OPEN: "open",

    /**
     * Indicating that the door is closed. A door remains closed until the user clicks the door or it is locked because
     * the user did not click it for a specific time.
     *
     * @type {string}
     */
    CLOSED: "closed",

    /**
     * Value for Door.options.state indicating that the door is locked. A locked door can never be opened again.
     * @type {string}
     */
    LOCKED: "locked"
};

/**
 * A Door that can be clicked by the user to open it or enter the room that corresponds to the doors color.
 *
 * @param options {{color: string, state: string, context: {}}}
 * @constructor
 */
function Door(options) {

    /**
     * The door itself. Use 'this' only for declaring members!
     * Use 'self' everywhere else!
     *
     * @type {Door}
     */
    var self = this;

    /**
     * The configuration options for this door. This contains the doors color and current state.
     *
     * @type {{color: string, state: string, lifetime: number, enabled: boolean, context: {}}}
     */
    this.options = $.extend({
        color: "red",
        state: DoorState.CLOSED,
        lifetime: 0,
        enabled: true,
        context: document
    }, options);

    /**
     * The jQuery element representing this door's button element.
     *
     * @type {jQuery}
     */
    this.$button = $("#door-{0}".format(self.options.color));

    /**
     * The jQuery element representing this door's container element.
     *
     * @type {jQuery}
     */
    this.$container = $("#door-{0}-container".format(self.options.color));

    /**
     * The enclosing context (aka the full 'experiment'). It is used as a shared event bus for communicating with other
     * components like doors and rooms.
     *
     * @type {jQuery}
     */
    this.$context = $(self.options.context);

    /**
     * Event handler that is called whenever a door has been opened.
     *
     * @param event     The eventObject.
     * @para door       The door that has been opened.
     */
    this.onDoorOpened = function (event, door) {
        if (door === self) {
            // this door has been opened
            self.changeState(DoorState.OPEN);
        }
        else {
            if (self.options.state === DoorState.OPEN) {
                self.changeState(DoorState.CLOSED);
            }
        }
    };

    /**
     * Called when this door's button is clicked by the user.
     */
    this.onButtonClick = function (event) {
        self.$context.trigger(DoorEvent.CLICKED, self);

        if (self.options.enabled) {
            switch (self.options.state) {
                case DoorState.CLOSED:
                    self.$context.trigger(DoorEvent.OPENED, self);
                    break;
                case DoorState.OPEN:
                    break;
                case DoorState.LOCKED:
                    break;
            }
        }
    };

    /**
     * Event handler that is called whenever cash is payed by a room.
     *
     * @param {*} event
     *          The event object.
     * @param {{amount: number, room: Room}} payData
     *          The data that is sent with the event. Contains the amount of cash payed and the room that payed it.
     */
    this.onCashEarned = function (event, payData) {
        if (payData.room.options.color !== self.options.color) {
            if (self.options.state === DoorState.OPEN) {
                self.changeState(DoorState.CLOSED);
            }
        }
    };

    /**
     * Event handler that is called when the experiment is finished.
     *
     * @param {*} event
     *          The event object.
     * @param {Experiment} experiment
     *          The experiment that is sent with the event.
     */
    this.onExperimentFinished = function (event, experiment) {
        self.options.enabled = false;
    };

    /**
     * Lets this door change its state from its current state (self.options.state) to the given new state.
     *
     * @param {string} newState
     *          The new state, must be one of DoorState.OPEN ("open") or DoorState.ENTERED ("entered") or
     *          DoorState.CLOSED ("closed") or DoorState.LOCKED ("locked").
     */
    this.changeState = function (newState) {
        console.log("changing state from {0} to {1}".format(self.options.state, newState));

        self.$button.removeClass("door-{0}-{1}".format(self.options.color, self.options.state));
        self.$button.addClass("door-{0}-{1}".format(self.options.color, newState));
        self.options.state = newState;
    };

    this.$context.on(DoorEvent.OPENED, self.onDoorOpened);
    this.$context.on(RoomEvent.CASH_EARNED, self.onCashEarned);
    this.$context.on(ExperimentEvent.FINISHED, self.onExperimentFinished);
    this.$button.click(self.onButtonClick);
}