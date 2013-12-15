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
        clicks: 30,
        name: 'unnamed',
        variant: 'unknown',
        context: document
    }, options);

    if (self.options.clicks % 10 !== 0) {
        throw "options.clicks must be a multiple of 10!";
    }

    this.finished = false;
    this.clicked = 0;
    this.stats = [];

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

    this.$cashChange = $("#cash-change");

    /**
     *
     * @type {jQuery}
     */
    this.$clicks = $("#clicks");
    self.$clicks.text(self.options.clicks);

    /**
     *
     * @param {boolean} roomChanged
     */
    this.handleClick = function (roomChanged) {
        if (self.finished === false) {
            if (self.clicked >= self.options.clicks) {
                // the experiment is over
                self.finished = true;
                self.$context.trigger(ExperimentEvent.FINISHED, self);
                self.$clicks.text("0");
            }
            else {
                self.clicked += 1;

                self.stats.push({
                    roomChanged: !!roomChanged
                });

                self.$clicks.text(self.options.clicks - self.clicked);
            }
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
        if (door.options.state !== DoorState.OPEN) {
            self.handleClick(true);
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
        self.handleClick(false);
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
        var $cashChange = $("#cash-change");
        var cash = parseFloat($cash.text());

        cash += payData.amount;

        $cash.text(cash.toFixed(2));
        $cashChange.stop();
        $cashChange.text(" {0}{1}".format(payData.amount >= 0 ? "+" : "-", payData.amount.toFixed(2)));
        $cashChange.css({
            "visibility": "visible",
            "color": payData.amount >= 0 ? "green" : "red",
            "opacity": 1
        });
        $cashChange.animate({
            "opacity": 0
        }, {
            duration: 2500,
            complete: function () {
                $cashChange.css({
                    "visibility": "hidden"
                });
            }
        });
    };

    /**
     *
     * @param event
     */
    this.onExperimentFinished = function (event) {
        var blockSize = self.options.clicks / 10;
        var series = [];
        for (var i = 0; i < 10; ++i) {
            var changeCount = 0;
            for (var k = 0; k < blockSize; ++k) {
                var idx = (i * blockSize) + k;

                if (idx < self.stats.length && self.stats[idx].roomChanged) {
                    changeCount += 1;
                }
            }

            series.push(changeCount);
        }

        var data = {
            experiment: self.options.name,
            variant: self.options.variant,
            data: series
        };

        var jqxhr = $.ajax({
            type: "POST",
            url: '/statistics',
            data: JSON.stringify(data),
            contentType: 'application/json'
        });

        jqxhr.done(function () {
            console.log("success");
        });
        jqxhr.fail(function () {
            console.log("error");
        });
        jqxhr.always(function () {
            console.log("complete");
        });
    };

    this.$context.on(DoorEvent.CLICKED, self.onDoorClicked);
    this.$context.on(RoomEvent.CLICKED, self.onRoomClicked);
    this.$context.on(RoomEvent.CASH_EARNED, self.onCashEarned);
    this.$context.on(ExperimentEvent.FINISHED, self.onExperimentFinished);
}
