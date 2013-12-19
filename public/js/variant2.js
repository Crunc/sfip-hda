var experiment = new Experiment({
    name: 'experiment1',
    variant: 'variant2'
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
    lifetime: 15,
    state: DoorState.CLOSED
});

var door_red = new Door({
    color: "red",
    lifetime: 15,
    state: DoorState.CLOSED
});

var door_blue = new Door({
    color: "blue",
    lifetime: 15,
    state: DoorState.CLOSED
});

$(document).on(ExperimentEvent.FINISHED, function () {
    experiment.modal("Danke für deine Teilnahme :)",
        '<h3>Bitte halte dieses Fenster offen, bis alle fertig sind.</h3>' +
        '<p>Du hast <strong>{0}</strong>&#160;&#162; verdient.</p>'.format(experiment.$cash.text()))
});

$(document).ready(function () {
    var desc = '<ul>' +
        '<li>Bitte lies die folgenden Anweisungen <strong>still</strong> für dich selbst</li>' +
        '<li>Türen werden mit der Zeit <strong>kleiner</strong></li>' +
        '<li>Ist eine Tür so klein dass sie nicht mehr sichtbar ist, so ist sie <strong>verloren</strong></li>' +
        '<li>Ein Klick auf eine Tür stellt ihre ursprüngliche Größe wieder her</li>' +
        '</ul>';

   experiment.modal("Bitte genau durchlesen!", desc, "Ok, ich habe verstanden");
});
