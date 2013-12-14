var routes = require('./routes');
var experiment = require('./routes/experiment');
var statistics = require('./routes/statistics');

module.exports = function (app) {
    app.get('/', routes.index);
    app.get('/experiments', experiment.list);

    app.get('/statistics', statistics.plot);
    app.get('/statistics/plotData', statistics.plotData);
    app.post('/statistics', statistics.addRecord);
};