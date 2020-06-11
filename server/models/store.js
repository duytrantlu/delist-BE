const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
const timestamps = require('mongoose-timestamp');

// define the User model schema
const StoreSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true,
    index: { unique: true }
  },
  baseUrl: { 
    type: String,
    required: true,
  },
  consumerKey: {
    type: String,
    required: true,
    index: { unique: true }
  },
  consumerSecret: {
    type: String,
    required: true,
    index: { unique: true }
  },
  typeStore: {
    type: String,
    required: false,
  },
  active: { 
    type: Boolean,
    required: true,
  }
});

StoreSchema.plugin(mongoosePaginate);
StoreSchema.plugin(timestamps);

/**
 * Override default toJSON, remove password field and __v version
 */
StoreSchema.methods.toJSON = function() {
  var obj = this.toObject();
  return obj;
};


/**
 * The pre-save hook method.
 *
 * NOTE: pre & post hooks are not executed on update() and findeOneAndUpdate()
 *       http://mongoosejs.com/docs/middleware.html
 */
// UserSchema.pre('save', function saveHook(next) {
//   const user = this;

//   // Proceed further only if the password is modified or the user is new
//   if (!user.isModified('password')) return next();

//   return utils.hash(user.password, (err, hash) => {
//     if (err) { return next (err); }

//     // Replace the password string with hash value
//     user.password = hash;

//     return next();
//   });
// });

module.exports = mongoose.model('Store', StoreSchema);
