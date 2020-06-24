const connection = require('../../socket').connection();
const Order = require('mongoose').model('Order');

exports.create = function (req, res, next) {
  const { body } = req;
  const options = { upsert: true, new: true, setDefaultsOnInsert: true };
  if (body.webhook_id) {
    return res.json({ success: false });
  } else {
    Order.findOneAndUpdate({ $and: [{ id: body.id }, { number: body.number }] }, body, options, (err, result) => {
      if (err) {
        console.log(err);
        return res.json({
          success: false
        });
      }
      console.log("===create===")
      connection.sendEvent('webhookWooCommerceCreateEvent', {success: true});
      return res.status(200).json({ success: true });
    });
  }
}

exports.update = function (req, res, next) {
  const { body } = req;
  if (body.webhook_id) {
    return res.json({ success: false });
  } else {
    Order.findOneAndUpdate({ $and: [{ id: body.id }, { number: body.number }] }, body, (err, result) => {
      if (err) {
        console.log(err);
        return res.json({
          success: false
        });
      }
      console.log("===update===")
      connection.sendEvent('webhookWooCommerceUpdateEvent', {success: true});
      return res.status(200).json({ success: true });
    });
  }

}

exports.delete = function (req, res, next) {
  connection.sendEvent('webhookWooCommerce', 'xin chao! minh dung day tu chieu delete');
  console.log("======delete====", req.body);
  res.json({ success: true })
}
