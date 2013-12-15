var RoomEvent = {
    CLICKED: "Room.Clicked",
    CASH_EARNED: "Room.CashEarned"
};

var RoomState = {
    ACTIVE: "enabled",
    INACTIVE: "disabled"
};

function Room(options) {

    /**
     * The room itself. Use 'this' only for declaring members! Use 'self' everywhere else!
     *
     * @type {Room}
     */
    var self = this;

    /**
     * The configuration options for this room. It contains the rooms color and current state.
     *
     * @type {{color: string, amount: number, maxPay: number, minPay: number, state: string, enabled: boolean, context: {}}}
     */
    this.options = $.extend({
        color: "gray",
        amount: 10,
        maxPay: 3.1,
        minPay: 0.2,
        state: RoomState.INACTIVE,
        enabled: true,
        context: document
    }, options);

    /**
     * The jQuery element representing this room.
     *
     * @type {jQuery}
     */
    this.$room = $("#room-{0}".format(self.options.color));

    /**
     * The jQuery element representing this room's button element.
     *
     * @type {jQuery}
     */
    this.$button = self.$room.children(".btn-pay");

    /**
     * The jQuery element representing this room's container element.
     *
     * @type {jQuery}
     */
    this.$container = $("#room-container");

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
     * @param event The event object.
     * @param door The Door that has been opened.
     */
    this.onDoorOpened = function (event, door) {
        if (door.options.color === self.options.color) {
            // the door to this room has been opened
            self.changeState(RoomState.ACTIVE);
        }
        else {
            // the door to another room has been opened
            self.changeState(RoomState.INACTIVE);
        }
    };

    /**
     * Event handler that is called when this room's button is clicked by the user
     *
     * @param event
     */
    this.onButtonClick = function (event) {
        self.$context.trigger(RoomEvent.CLICKED, self);

        if (self.options.enabled) {
            var max = self.options.maxPay;
            var min = self.options.minPay;
            var amount = Math.random() * (max - min) + min;

            if (self.options.amount < amount) {
                amount = self.options.amount;
            }

            self.options.amount -= amount;

            console.log("earned {0} from {1}".format(amount, self.options.color));
            self.$context.trigger(RoomEvent.CASH_EARNED, {amount: amount, room: self});
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
     * Lets this room change its state from its current state (self.options.state) to the given new state.
     *
     * @param newState The new state, must be one of RoomState.ACTIVE ("enabled") or RoomState.INACTIVE ("inactive").
     */
    this.changeState = function (newState) {
        self.$room.removeClass("room-{0}".format(self.options.state));
        self.$room.addClass("room-{0}".format(newState));
        self.options.state = newState;
    };

    this.$context.on(DoorEvent.OPENED, self.onDoorOpened);
    this.$context.on(ExperimentEvent.FINISHED, self.onExperimentFinished);
    this.$button.click(self.onButtonClick);
};