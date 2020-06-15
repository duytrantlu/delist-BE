const connection = require('../../socket').connection();
const Order = require('mongoose').model('Order');

exports.syncData = function (req, res, next) {
  const { listOrder } = req.body;
  const options = { upsert: true, new: true, setDefaultsOnInsert: true };
  const errors = [];
  try {
    if (listOrder && listOrder.length > 0) {
      listOrder.forEach(function (or) {
        const query = { id: or.id, store: or.store };
        Order.findOneAndUpdate(query, or, options, function (err, result) {
          if (err) {
            console.log(err);
            errors.push({ success: false, status: 409, errors: [err.message] })
          }
        });
      })
    }
    if (errors.length > 0) {
      res.status(200).json({
        success: false,
        err: errors
      });
    }
    res.status(200).json({
      success: true
    });
  } catch (err) {
    res.status(200).json({ success: false, err })
  }
}

exports.listOrder = function (req, res, next) {
  const pageOptions = {
    page: req.query['page'] ? parseInt(req.query['page']) : 1,
    limit: req.query['limit'] ? parseInt(req.query['limit'])  : 1000,
    sort: req.query['sort'] || { updatedAt: -1 }
  };

  let filterOptions = {};
  try {
    const filterParam = JSON.parse(req.query['filter']);
    if (Array.isArray(filterParam) && filterParam.length > 0) {
      filterParam.forEach((item) => {
        filterOptions[item.id] = new RegExp(item.value, 'i');
      });
    }
  } catch (err) {
    console.log('Could not parse \'filter\' param ' + err);
  }
  Order.paginate(filterOptions, pageOptions, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        errors: [JSON.stringify(err)]
      });
    }

    return res.json(result);
  });
}