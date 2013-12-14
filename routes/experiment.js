
exports.list = function (req, res) {
    var data = {
        title: 'Experiment overview',
        experiments: [
            { name: 'Variante 1', url: 'variant1.html' },
            { name: 'Variante 2', url: 'variant2.html' }
        ]
    };

    res.render('experiment-list', data);
};