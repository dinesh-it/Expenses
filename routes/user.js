
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.render('users',{ name_list: ['dinesh','baskar','test'], title: 'Test'});
};
