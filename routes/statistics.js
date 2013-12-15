var inspect = require('util').inspect;

var DATA_LENGTH = 10;

var stats = {
    experiment1: {
        variant1: {
            data: []
        },
        variant2: {
            data: []
        }
    }
};

exports.plot = function (req, res) {
    res.render('statistics-plot', {});
};

var randomVal = function (min, max) {
    return Math.random() * (max - min) + min;
};

var makeRandomSeries = function () {
    var series = [];
    for (var idx = 0; idx < 10; ++idx) {
        series.push([(idx + 1) * 10, randomVal(1, 7)]);
    }
    return series;
};

var validateRecord = function (record, callback) {
    var err = null;
    if (err == null) {
        err = (record) ? null : "no record";
    }
    if (err == null) {
        err = (record.experiment) ? null : "no record.experiment";
    }
    if (err == null) {
        err = (record.variant) ? null : "no record.variant";
    }
    if (err == null) {
        err = (record.data) ? null : "no record.data";
    }
    if (err == null) {
        err = (record.data.length) ? null : "invalid record.data";
    }
    if (err == null) {
        err = (record.data.length > 0) ? null : "invalid record.data";
    }
//    if (err == null) {
//        record.data.forEach(function (entry, index) {
//            if (err == null) {
//                err = (entry) ? null : "record.data contains an invalid item at index " + index
//            }
//            if (err == null) {
//                err = (entry.length) ? null : "record.data contains an invalid item at index " + index
//            }
//            if (err == null) {
//                err = (entry.length > 0) ? null : "record.data contains an invalid item at index " + index
//            }
//        });
//    }

    callback(err, record);
};

var makeDataArray = function (recordData) {
    var dataArr = [];

    for (var i = 0; i < DATA_LENGTH; ++i) {
        if (i < recordData.length) {
            dataArr[i] = recordData[i];
        }
        else {
            dataArr[i] = 0;
        }
    }

    return dataArr;
};

exports.addRecord = function (req, res) {
    if (req.is("json")) {
        validateRecord(req.body, function (err, record) {
            if (!err) {
                var experiment = stats[record.experiment];

                if (!experiment) {
                    experiment = {};
                    stats[record.experiment] = experiment;
                }

                var variant = experiment[record.variant];
                if (!variant) {
                    variant = {
                        data: []
                    };
                    experiment[record.variant] = variant;
                }

                variant.data.push(makeDataArray(record.data));

                var resTxt = [];
                variant.data.forEach(function (row) {
                    resTxt.push(row);
                });

                res.location('/statistics');
                res.send(202, inspect(resTxt));
            }
            else {
                res.send(400, err);
            }
        });
    }
    else {
        res.send(400, 'no json');
    }
};

var calculateSeries = function (data) {
    var series = [];

    for (var i = 0; i < DATA_LENGTH; ++i) {
        var average = 0;
        for (var k = 0; k < data.length; ++k) {
            average += data[k][i];
        }
        if (data.length > 0) {
            average = average / data.length;
        }

        series.push(average);
    }

    return series;
};

exports.plotData = function (req, res) {
    var series1 = calculateSeries(stats.experiment1.variant1.data);
    var series2 = calculateSeries(stats.experiment1.variant2.data);

    var plotData = [
        {
            label: 'Variante 1',
            data: series1
        },
        {
            label: 'Variante 2',
            data: series2
        }
    ];

    res.json(plotData);
};