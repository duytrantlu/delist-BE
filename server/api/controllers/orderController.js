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
        qr: filter[keys[0]],
        field: 'payment_method'
      }
    case 'updated_paypal':
      if (filter[keys[0]].length === 0) {
        return {
          qr: { $exists: true, $ne: filter[keys[0]] },
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
          qr: { $exists: true, $ne: filter[keys[0]] },
          field: 'shipped'
        }
      }
      return {
        qr: filter[keys[0]],
        field: 'shipped'
      }
    case 'createdAt': {
      const dates = filter[keys[0]].split('/');
      return {
        qr: { "gte": dates[0], "lt": dates[1] },
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
    console.log("==111==", { ...filterOptions, 'createdAt': { '$gte': new Date(filterOptions['createdAt'].gte), '$lt': new Date(filterOptions['createdAt'].lt) } });
  } catch (err) {
    console.log('[List Order] Could not parse \'filter\' param ' + err);
  }

  Order.paginate({ store: { '$exists': true, '$ne': '' }, updated_paypal: { '$exists': true, '$ne': '' }, status: { '$exists': true, '$ne': [] }, shipped: { '$exists': true, '$ne': '' }, payment_method: { '$exists': true, '$ne': '' }, createdAt: { '$gte': new Date('2020-05-31T17:00:00.000Z'), '$lt': new Date('2020-06-30T16:59:59.999Z') } }, pageOptions, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(200).json({
        success: false,
        errors: [JSON.stringify(err)]
      });
    }
    console.log("=result==", result);
    return res.json(result);
  });
}