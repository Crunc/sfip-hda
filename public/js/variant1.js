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
    payments: normally_distributed_random_numbers(200, 3, 5.2, 0, 10)
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
