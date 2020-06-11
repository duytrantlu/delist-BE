const mongoose = require('mongoose');
// // const bcrypt = require('bcrypt'); // Use bcryptjs for Windows, bcrypt for Linux
// const bcrypt = require('bcryptjs');
const utils = require('../main/common/utils');
const mongoosePaginate = require('mongoose-paginate');
const timestamps = require('mongoose-timestamp');

const Roles = require('../../src/shared/roles');

// define the User model schema
const OrderSchema = new mongoose.Schema({
  
});

UserSchema.plugin(mongoosePaginate);
UserSchema.plugin(timestamps);

/**
 * Override default toJSON, remove password field and __v version
 */
UserSchema.methods.toJSON = function() {
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

module.exports = mongoose.model('Order', OrderSchema);
