const connection  = require('../../socket').connection();

exports.create = function(req, res, next) {
  connection.sendEvent('webhookWooCommerce', 'xin chao! minh dung day tu chieu create');
  console.log("======create====", req.body);
  res.json({success: true})
}

exports.update = function(req, res, next) {
  connection.sendEvent('webhookWooCommerce', 'xin chao! minh dung day tu chieu update');
  console.log("======update====", req.body);
  res.json({success: true})
}

exports.delete = function(req, res, next) {
  connection.sendEvent('webhookWooCommerce', 'xin chao! minh dung day tu chieu delete');
  console.log("======delete====", req.body);
  res.json({success: true})
}
