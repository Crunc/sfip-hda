var ExperimentEvent = {
  FINISHED: "Experiment.Finished"
};

function Experiment(options) {

    /**
     * The stats itself. Use 'this' only for declaring members! Use 'self' everywhere else!
     *
     * @type {Experiment}
     */
    var self = this;

    /**
     * The configuration options for this stats. It contains the current cash and the context.
     *
     * @type {{cash: number, clicks: number, context: {}}}
     */
    this.options = $.extend({
        cash: 0,
        clicks: 10,
        context: document
    }, options);

    /**
     * The enclosing context (aka the full 'experiment'). It is used as a shared event bus for communicating with other
     * components like doors and rooms.
     *
     * @type {jQuery}
     */
    this.$context = $(self.options.context);

    /**
     *
     * @type {jQuery}
     */
    this.$cash = $("#cash");
    self.$cash.text(self.options.cash.toFixed(2));

    /**
     *
     * @type {jQuery}
     */
    this.$clicks = $("#clicks");
    self.$clicks.text(self.options.clicks);

    /**
     *
     * @param {number} clicks
     */
    this.handleClicks = function(clicks) {
        self.options.clicks -= clicks;

        if (self.options.clicks < 0) {
            // the experiment is over
            self.$context.trigger(ExperimentEvent.FINISHED, self);
            self.$clicks.text("0");
        }
        else {
            self.$clicks.text(self.options.clicks);
        }
    };

    /**
     * Event handler that is called whenever a door has been opened.
     *
     * @param {*} event
     *          The eventObject.
     * @para {Door} door
     *          The door that has been opened.
     */
    this.onDoorClicked = function (event, door) {
        if (door.options.state !== DoorState.ENTERED) {
            self.handleClicks(1);
        }
    };

    /**
     * Event handler that is called whenever a door has been entered.
     *
     * @param {*} event
     *          The eventObject.
     * @param {Room} room
     *          The door that has been opened.
     */
    this.onRoomClicked = function (event, door) {
        self.handleClicks(1);
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
        var $cash = $("#cash");
        var cash = parseFloat($cash.text());

        cash += payData.amount;

        $cash.text(cash.toFixed(2));
    };

    this.$context.on(DoorEvent.CLICKED, self.onDoorClicked);
    this.$context.on(RoomEvent.CLICKED, self.onRoomClicked);
    this.$context.on(RoomEvent.CASH_EARNED, self.onCashEarned);
}
