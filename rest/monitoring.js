exports.check = function(check) {
  if(check == 'alive')
    return 200;
  else
    return 405;
};