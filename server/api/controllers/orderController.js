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
      if (filter[keys[0]].length === 0) {
        return {
          qr: [{ 'billing.email': { '$exists': true, $ne: '' }, 'billing.phone': { '$exists': true, $ne: '' } }],
          field: '$or'
        }
      }
      return {
        qr: [{ 'billing.email': new RegExp(filter[keys[0]].replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'i') }, { 'billing.phone': new RegExp(filter[keys[0]].replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'i') }],
        field: '$or'
      }
    case 'date_created': {
      const dates = filter[keys[0]].split('/');
      return {
        qr: { "$gte": new Date(`${dates[0]}`), "$lt": new Date(`${dates[1]}`) },
        field: 'date_created'
      }
    }
  }
}

exports.listOrder = function (req, res, next) {
  const pageOptions = {
    page: req.query['page'] ? parseInt(req.query['page']) : 1,
    limit: req.query['limit'] ? parseInt(req.query['limit']) : 1000,
    sort: req.query['sort'] || { date_created: -1 }
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

function formatCsvData(csvData) {
  if (!csvData.length) return [];
  return csvData.map(csv => {
    return {
      'Tracking Number': csv.tracking_number,
      'Note': '',
      'Order Number': csv.number,
      'Order Status': csv.status,
      'Order Date': csv.date_created,
      'Paid Date': csv.date_paid,
      'Currency': csv.currency,
      'Order Shipping Amount': csv.shipping_total,
      'Order Tax Amount': csv.total_tax,
      'Order Total Amount': csv.total,
      'Coupons Used': '',
      'Discount Amount': csv.discount_total,
      'Shipping Method Title': csv.shipping_lines.length > 0 ? csv.shipping_lines.map(v => v.method_title).join(',') : '',
      'Item Name': csv.line_items.length > 0 ? csv.line_items.map(v => v.name).join(',') : '',
      'Quantity': csv.line_items.length > 0 ? csv.line_items.map(v => v.quantity).join(',') : '',
      'SKU': csv.line_items.length > 0 ? csv.line_items.map(v => v.sku).join(',') : '',
      'Item Cost': csv.line_items.length > 0 ? csv.line_items.map(v => v.price).join(',') : '',
      'Full Name (Billing)': `${csv.billing.first_name} ${csv.billing.last_name}`,
      'Address 1&2 (Billing)': `${csv.billing.address_1} ${csv.billing.address_2}`,
      'Company (Billing)': `${csv.billing.company}`,
      'City (Billing)': `${csv.billing.city}`,
      'Postcode (Billing)': `${csv.billing.postcode}`,
      'State Code (Billing)': `${csv.billing.state}`,
      'Country Code (Billing)': `${csv.billing.country}`,
      'Full Name (Shipping)': `${csv.shipping.first_name} ${csv.shipping.last_name}`,
      'Address 1&2': `${csv.shipping.address_1} ${csv.shipping.address_2}`,
      'Company': `${csv.shipping.company}`,
      'City (Shipping)': `${csv.shipping.city}`,
      'State Code (Shipping)': `${csv.shipping.state}`,
      'Postcode (Shipping)': `${csv.shipping.postcode}`,
      'Country Code (Shipping)': `${csv.shipping.country}`,
      'Email (Billing)': `${csv.billing.email}`,
      'Phone (Billing)': `${csv.billing.phone}`,
      'Customer Note': csv.customer_note,
      'Payment Method Title': csv.payment_method_title,
      'Transaction ID': csv.transaction_id,
      'Order Refund Amount': csv.refunds.length,
      'Order Subtotal Amount Refunded': '',
      'Store': csv.store,
      'id': csv._id,
    }
  })
}

exports.exportData = function (req, res, next) {
  let filterOptions = {};
  try {
    const filterParam = JSON.parse(req.query['filter']);
    if (Array.isArray(filterParam) && filterParam.length > 0) {
      filterParam.forEach((item) => {
        filterOptions['date_created'] = { '$gte': new Date(item.startDate), '$lt': new Date(item.endDate) }
      });
    }
  } catch (err) {
    console.log('[List Order] Could not parse \'filter\' param ' + err);
  }
  Order.find(filterOptions, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(200).json({
        success: false,
        errors: [JSON.stringify(err)]
      });
    }
    try {
      const rs = formatCsvData(result)
      return res.status(200).json(rs);
    } catch (error) {
      return res.status(200).json({
        success: false,
        errors: [JSON.stringify(error)]
      });
    }
  });
}

exports.updateOrders = function (req, res, next) {
  const errors = [];
  const { orders } = req.body;
  if (orders.length) {
    try {
      orders.forEach(function (order) {
        try {
          Order.findOneAndUpdate({ _id: order.id }, { $set: { tracking_number: order.tracking_number } }, function (err, rs) {
            if (err) errors.push({tracking: order.tracking_number, err: JSON.stringify(err)});
          }); 
        } catch (err) {
          errors.push({tracking: order.tracking_number, err: JSON.stringify(err)});
        }
      });

      return res.status(200).json({
        success: true,
        errors,
      });
    } catch (error) {
      return res.status(200).json({
        success: false,
        errors: JSON.stringify(error),
      });
    }
  } else {
    return res.status(200).json({
      success: false,
      errors: new Error("Nothing for update")
    });
  }
}