var experiment = new Experiment({
    name: 'experiment1',
    variant: 'variant2'
});

var room_green = new Room({
    color: "green"
});

var room_red = new Room({
    color: "red"
});

var room_blue = new Room({
    color: "blue"
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
