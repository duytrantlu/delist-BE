const connection = require('../../socket').connection();
const Order = require('mongoose').model('Order');
const _ = require('lodash');

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

function handleFilter(filter) {
  const keys = Object.keys(filter);
  switch (keys[0]) {
    case 'store':
      if (filter[keys[0]].length === 0) {
        return {
          qr: { $exists: true, $ne: filter[keys[0]] },
          field: 'store'
        }
      }
      return {
        qr: { $in: filter[keys[0]] },
        field: 'store'
      }
    case 'payment_method':
      if (filter[keys[0]].length === 0) {
        return {
          qr: { $exists: true, $ne: filter[keys[0]] },
          field: 'payment_method'
        }
      }
      return {
        qr: new RegExp(filter[keys[0]], 'i'),
        field: 'payment_method'
      }
    case 'updated_paypal':
      if (filter[keys[0]].length === 0) {
        return {
          qr: { $exists: true, $ne: 3 },
          field: 'updated_paypal'
        }
      }
      return {
        qr: filter[keys[0]],
        field: 'updated_paypal'
      }
    case 'status':
      if (filter[keys[0]].length === 0) {
        return {
          qr: { $exists: true, $ne: filter[keys[0]] },
          field: 'status'
        }
      }
      return {
        qr: { $in: filter[keys[0]] },
        field: 'status'
      }
    case 'shipped':
      if (filter[keys[0]].length === 0) {
        return {
          qr: { $exists: true, $ne: 3 },
          field: 'shipped'
        }
      }
      return {
        qr: filter[keys[0]],
        field: 'shipped'
      }
    case 'email':
      if(filter[keys[0]].length === 0){
        return {
          qr: [{'billing.email': {'$exists': true, $ne: ''}, 'billing.phone': {'$exists': true, $ne: ''}}],
          field: '$or'
        }
      }
      return {
        qr: [{'billing.email':  new RegExp(filter[keys[0]].replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'i')}, {'billing.phone': new RegExp(filter[keys[0]].replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'i')}],
        field: '$or'
      }
    case 'createdAt': {
      const dates = filter[keys[0]].split('/');
      return {
        qr: { "$gte": new Date(`${dates[0]}`), "$lt": new Date(`${dates[1]}`) },
        field: 'createdAt'
      }
    }
  }
}

exports.listOrder = function (req, res, next) {
  const pageOptions = {
    page: req.query['page'] ? parseInt(req.query['page']) : 1,
    limit: req.query['limit'] ? parseInt(req.query['limit']) : 1000,
    sort: req.query['sort'] || { updatedAt: -1 }
  };
  let filterOptions = {};
  try {
    const filterParam = JSON.parse(req.query['filter']);
    if (Array.isArray(filterParam) && filterParam.length > 0) {
      filterParam.forEach((item) => {
        const objQuery = handleFilter(item);
        filterOptions[objQuery.field] = objQuery.qr;
      });
    }
  } catch (err) {
    console.log('[List Order] Could not parse \'filter\' param ' + err);
  }
  Order.paginate(filterOptions, pageOptions, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(200).json({
        success: false,
        errors: [JSON.stringify(err)]
      });
    }
    return res.json(result);
  });
}