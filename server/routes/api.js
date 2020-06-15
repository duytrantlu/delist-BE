const express = require('express');
const router = express.Router();
const authCheck = require('../middleware/auth-check');
const Roles = require('../../src/shared/roles');

const messageController = require('../api/controllers/messageController');
const userController = require('../api/controllers/userController');
const storeController = require('../api/controllers/storeController');
const wooController = require('../api/controllers/wooHooks');
const orderController = require('../api/controllers/orderController');

// GET /api/messages/public1
router.get('/messages/public1', messageController.getPublicMessage1);

// GET /api/messages/private1
router.get('/messages/private1', authCheck(), messageController.getPrivateMessage1);

// GET /api/messages/admin1
router.get('/messages/admin1', authCheck([Roles.admin,Roles.siteAdmin]), messageController.getAdminMessage1);


// GET /api/users
router.get('/users', authCheck([Roles.admin,Roles.siteAdmin, Roles.user]), userController.list);

// GET /api/users/:id
router.get('/users/:id', authCheck([Roles.siteAdmin]), userController.find);

// DELETE /api/users/:id
router.delete('/users/:id', authCheck([Roles.siteAdmin]), userController.destroy);

// DELETE many /api/users/:id
router.delete('/users/ids/:ids', authCheck(), userController.destroys);

// PUT /api/users
router.put('/users', authCheck([Roles.siteAdmin]), userController.updateUser);

// PUT /api/users/password
router.put('/users/password', authCheck([Roles.siteAdmin]), userController.updatePassword);

// PUT /api/users/role
router.put('/users/role', authCheck(), userController.updateRole);

// PUT /api/users/profile
router.put('/users/profile', authCheck(), userController.updateProfile);

// PUT /api/users/profile/password
router.put('/users/profile/password', authCheck(), userController.updateProfilePassword);

// GET /api/stores
router.get('/stores',authCheck(), storeController.list);

// POST /apu/stores
router.post('/stores',authCheck(), storeController.create);

// PUT /api/store
router.put('/stores', authCheck(), storeController.updateStore);

// DELETE many store /api/stores/:ids
router.delete('/stores/:ids', authCheck(), storeController.destroys);

// new API for Hook
router.post('/woo/hooks', wooController.test);

// API FOR SYNC DATA
router.put('/oms/sync', orderController.syncData);

// GET LIST ORDERS
router.get('/orders', orderController.listOrder);

module.exports = router;
