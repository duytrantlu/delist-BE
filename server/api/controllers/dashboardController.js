const connection = require('../../socket').connection();
const Order = require('mongoose').model('Order');
const Store = require('mongoose').model('Store');
const _ = require('lodash');

const formatDashboard = async (orders, stores) => {
  let netTotal = 0;
  let orderTotal = 0;
  let itemTotal = 0;

  const storesSpecific = {};
  stores.forEach(s => {
    storesSpecific[s] = {
      netStore: 0,
      orderStore: 0,
      itemStore: 0,
      AOV: 0,
      AOI: 0,
    }
  });
  
  orders.forEach(o => {
    stores.forEach(s => {
      if (o.store === s) {
        storesSpecific[s].netStore += (parseFloat(o.total) - parseFloat(o.total_tax));
        storesSpecific[s].orderStore += 1;
        o.line_items.forEach(i => {
          storesSpecific[s].itemStore += parseInt(i.quantity);
        });
      }
    });
    orderTotal += 1;
    netTotal += (parseFloat(o.total) - parseFloat(o.total_tax));
    o.line_items.forEach(i => {
      itemTotal += parseInt(i.quantity);
    });
  });

  return {
    headerInfo: {
      netTotal,
      orderTotal,
      itemTotal
    },
    storeInfo: storesSpecific
  }



}

exports.dashboardInfo = async (req, res, next) => {
  let filterOptions = {};
  try {
    const filterParam = JSON.parse(req.query['filter']);
    try {
      if (Array.isArray(filterParam) && filterParam.length > 0) {
        filterParam.forEach((item) => {
          filterOptions['createdAt'] = { '$gt': new Date(item.startDate), '$lte': new Date(item.endDate) }
        });
      }
    } catch (err) {
      console.log('[Dash Board] Could not parse \'filter\' param ' + err);
    }
    const stores = await Store.find({});
    const storeName = [];
    stores.forEach(s => {
      storeName.push(s.name);
    });
    filterOptions['store'] = { '$in': storeName };
    const orders = await Order.find(filterOptions);
    const result = await formatDashboard(orders, storeName);
    return res.status(200).json(result);

  } catch (error) {
    return res.status(500).json({
      error: [error.message],
      success: false,
    });
  }

}

