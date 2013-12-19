var experiment = new Experiment({
    name: 'experiment1',
    variant: 'variant1'
});

var room_green = new Room({
    color: "green",
    payments: normally_distributed_random_numbers(200, 3, 2.25, 0, 7)
});

var room_red = new Room({
    color: "red",
    payments: normally_distributed_random_numbers(200, 3, 0.64, 1, 5)
});

var room_blue = new Room({
    color: "blue",
    payments: chi_square_distributed_random_numbers(200, -2, 10, 3)
});

var door_green = new Door({
    color: "green",
    state: DoorState.CLOSED
});

var door_red = new Door({
    color: "red",
    state: DoorState.CLOSED
});

var door_blue = new Door({
    color: "blue",
    state: DoorState.CLOSED
});

$(document).on(ExperimentEvent.FINISHED, function () {
    experiment.modal("Danke für deine Teilnahme :)",
        '<h3>Bitte halte dieses Fenster offen, bis alle fertig sind.</h3>' +
            '<p>Du hast <strong>{0}</strong>&#160;&#162; verdient.</p>'.format(experiment.$cash.text()))
});
