const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const timestamps = require('mongoose-timestamp');

const Billing = new mongoose.Schema({
  address_1: {
    type: String,
  },
  address_2: {
    type: String,
  },
  city: {
    type: String,
  },
  company: {
    type: String,
  },
  country: {
    type: String,
  },
  email: {
    type: String,
  },
  first_name: {
    type: String
  },
  last_name: {
    type: String,
  },
  phone: {
    type: String,
  },
  postcode: {
    type: String,
  },
  state: {
    type: String,
  }
});

const metaData = new mongoose.Schema({
  id: {
    type: Number,
  },
  key: {
    type: String,
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
  }
})

const Shipping = new mongoose.Schema({
  address_1: {
    type: String,
  },
  address_2: {
    type: String,
  },
  city: {
    type: String,
  },
  company: {
    type: String,
  },
  country: {
    type: String,
  },
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  postcode: {
    type: String,
  },
  state: {
    type: String,
  }
});

const shippingLines = new mongoose.Schema({
  id: {
    type: Number,
  },
  instance_id: {
    type: String,
  },
  meta_data: [metaData],
  method_id: {
    type: String,
  },
  method_title: {
    type: String,
  },
  taxes: [],
  total: {
    type: String,
  },
  total_tax: {
    type: String,
  }
})

// define the User model schema
const OrderSchema = new mongoose.Schema({
  tracking_number: {
    type: String,
    default:"",
  },
  billing: Billing,
  cart_hash: {
    type: String,
  },
  cart_tax: {
    type: String,
  },
  created_via: {
    type: String,
  },
  currency: {
    type: String,
  },
  currency_symbol: {
    type: String,
  },
  customer_id: {
    type: Number
  },
  customer_ip_address: {
    type: String,
  },
  customer_note: {
    type: String,
  },
  customer_user_agent: {
    type: String,
  },
  date_completed: {
    type: Date,
  },
  date_completed_gmt: {
    type: Date
  },
  date_created: {
    type: Date
  },
  date_created_gmt: {
    type: Date,
  },
  date_modified: {
    type: Date,
  },
  date_modified_gmt: {
    type: Date
  },
  date_paid: {
    type: Date
  },
  date_paid_gmt: {
    type: Date
  },
  discount_tax: {
    type: Date
  },
  discount_total: {
    type: Date,
  },
  fee_lines: {
    type: [String]
  },
  id: {
    type: Number,
  },
  line_items: {
    type: [mongoose.Schema.Types.Mixed]
  },
  meta_data: [metaData],
  number: {
    type: String,
  },
  order_key: {
    type: String,
  },
  parent_id: {
    type: Number
  },
  payment_method: {
    type: String,
  },
  payment_method_title: {
    type: String,
  },
  prices_include_tax: {
    type: Boolean,
  },
  refunds: {
    type: [mongoose.Schema.Types.Mixed]
  },
  shipping: Shipping,
  shipping_lines: [shippingLines],
  shipping_tax: {
    type: String,
  },
  shipping_total: {
    type: String,
  },
  status: {
    type: String,
  },
  tax_lines: {
    type: [mongoose.Schema.Types.Mixed]
  },
  total: {
    type: String,
  },
  total_tax: {
    type: String,
  },
  transaction_id: {
    type: String,
  },
  version: {
    type: String,
  },
  _link: {
    type: mongoose.Schema.Types.Mixed
  },
  store: {
    type: String,
  },
  updated_paypal: {
    type: Boolean,
    default: 0
  },
  shipped: {
    type: Boolean,
    default: 0
  }
});

OrderSchema.plugin(mongoosePaginate);
OrderSchema.plugin(timestamps);

/**
 * Override default toJSON, remove password field and __v version
 */
OrderSchema.methods.toJSON = function () {
  var obj = this.toObject();
  return obj;
};

module.exports = mongoose.model('Order', OrderSchema);
