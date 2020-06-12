const Store = require('mongoose').model('Store');

const { validations } = require('../../config');


exports.list = function(req, res, next){
  const pageOptions = {
    page: req.query['page'] || 1,
    limit: req.query['limit'] || 5000,
    sort: req.query['sort'] || {createdAt: -1}
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
    console.log('[Store] Could not parse \'filter\' param '+ err);
  }

  // User.find({}, '-password -__v', (err, users) => {
    Store.paginate(filterOptions, pageOptions, (err, result) => {
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

exports.create = function(req, res, next){
  if (!req.body.store || typeof req.body.store !== 'object') {
    return res.status(200).json({ success: false, status: 409, errors: ['\'store\' param is required'] });
  }

  const store = req.body.store;

  createStore(store, (err, data) => {
    if (err) {
      if (err) console.log(err);
      return res.status(200).json({ success: false,status:409, errors: [err.message] });
    }
    return res.json({ success: true, status: 200 });
  });
}

const createStore = (store, callback) => {
  validateStore(store, (errValidatiom, s) => {
    if(errValidatiom) return callback(errValidatiom);
    const newStore = new Store(s);
    newStore.save((err, nStore)=>{
      if (err) return callback(err);
      return callback(null, nStore);
    });
  })
}

exports.updateStore = function(req, res, next) {
  if (!req.body.store || typeof req.body.store !== 'object') {
    return res.status(200).json({ success: false, status: 409, errors: ['\'store\' param is required'] });
  }

  const store = req.body.store;

  updateStore(store, (err, data) => {
    if (err) {
      if (err) console.log(err);
      return res.status(200).json({ success: false,status:409, errors: [err.message] });
    }
    return res.json({ success: true, status: 200 });
  });
}

// DELETE many Store /api/users/:id -> id = [ids]
exports.destroys = function(req, res, next) {
  const {ids} = req.params;
  Store.deleteMany({_id:{$in: ids.split(',')}}, (err, store) => {
    if (err || !store) {
      if (err) console.log(err);
      return res.status(404).json({
        success: false,
        errors: [ err ? err.message : `store id '${req.params.ids} not found'` ]
      });
    }

    return res.json({
      success: true,
      data: store
    });
  });
};

const updateStore = (store, callback) => {
  validateStore(store, (errValidatiom, s) => {
    if(errValidatiom) return callback(errValidatiom);
    Store.findOneAndUpdate({_id: s._id}, s,(err, data) => {
      if (err) return callback(err);

      return callback(null, data);
    })
  })
}

const validateStore = (store, callback) => {
  if (typeof store.name === 'string') {
    store.name = store.name.trim();
    if (store.name.length === 0)
      return callback(new Error('store.name length is 0'));
  } else {
    return callback(new Error('store.name is required'));
  }
  if (typeof store.baseUrl === 'string') {
    store.baseUrl = store.baseUrl.trim();
    if (!store.baseUrl.match(validations.storeUrl.regex.value))
      return callback(new Error(validations.storeUrl.regex.message));
  } else {
    return callback(new Error('store.baseUrl is required'));
  }
  if (typeof store.consumerKey === 'string') {
    store.consumerKey = store.consumerKey.trim();
    if (store.consumerKey.length === 0)
      return callback(new Error(`store.consumerKey length is 0`));
  } else {
    return callback(new Error('store.consumerKey is required'));
  }
  if (typeof store.consumerSecret === 'string') {
    store.consumerSecret = store.consumerSecret.trim();
    if (store.consumerSecret.length === 0)
      return callback(new Error(`store.consumerSecret length is 0`));
  } else {
    return callback(new Error('store.consumerSecret is required'));
  }
  return callback(null, store);
}