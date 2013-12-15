
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', {
      title: 'Dan Ariely\'s Experiment',
      instructions: 'Wähle die Variante der du zugeteilt wurdest.'
  });
};