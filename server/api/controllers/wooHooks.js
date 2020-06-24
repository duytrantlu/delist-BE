const connection = require('../../socket').connection();
const Order = require('mongoose').model('Order');

function extractHostname(url) {
  let hostname;
  //find & remove protocol (http, ftp, etc.) and get hostname

  if (url.indexOf("//") > -1) {
    hostname = url.split('/')[2];
  }
  else {
    hostname = url.split('/')[0];
  }

  //find & remove port number
  hostname = hostname.split(':')[0];
  //find & remove "?"
  hostname = hostname.split('?')[0];

  return hostname.split('.')[0];
}

exports.create = function (req, res, next) {
  const { body } = req;
  console.log("===body===", body);
  const store = extractHostname(body._links.self[0].href);
  console.log("===store===", store);
  const options = { upsert: true, new: true, setDefaultsOnInsert: true };
  if (body.webhook_id) {
    return res.json({ success: false });
  } else {
    Order.findOneAndUpdate({ $and: [{ id: body.id }, { number: body.number }] }, {...body, store}, options, (err, result) => {
      if (err) {
        console.log(err);
        return res.json({
          success: false
        });
      }
      connection.sendEvent('webhookWooCommerceCreateEvent', {success: true});
      return res.status(200).json({ success: true });
    });
  }
}

exports.update = function (req, res, next) {
  const { body } = req;
  const store = extractHostname(body._links.self[0].href);
  if (body.webhook_id) {
    return res.json({ success: false });
  } else {
    Order.findOneAndUpdate({ $and: [{ id: body.id }, { number: body.number }] }, {...body, store}, (err, result) => {
      if (err) {
        console.log(err);
        return res.json({
          success: false
        });
      }
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
