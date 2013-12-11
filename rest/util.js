exports.normalizeBrokerUrl = function(url) {
  return url[url.length - 1] == '/' ? url : url + '/';
}