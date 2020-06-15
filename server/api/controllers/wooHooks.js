const connection  = require('../../socket').connection();

exports.test = function(req, res, next) {
  connection.sendEvent('webhookWooCommerce', 'xin chao! minh dung day tu chieu');
  console.log("======req.body====", req.body);
  res.json({success: true})
}