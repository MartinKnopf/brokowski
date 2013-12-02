exports.check = function(req, res) {
  if(req.params['check'] == 'alive')
    res.send(200);
  res.send(405);
};