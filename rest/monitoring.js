exports.check = function(req, res) {
  if(req.params['check'] == 'alive')
    res.send(200);
  else
    res.send(405);
};