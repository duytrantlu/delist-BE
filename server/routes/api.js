const express = require('express');
const router = express.Router();
const authCheck = require('../middleware/auth-check');
const Roles = require('../../src/shared/roles');

const dashboardController = require('../api/controllers/dashboardController');
const userController = require('../api/controllers/userController');
const storeController = require('../api/controllers/storeController');
const wooController = require('../api/controllers/wooHooks');
const orderController = require('../api/controllers/orderController');

// GET /api/users
router.get('/users', authCheck([Roles.admin, Roles.siteAdmin, Roles.user]), userController.list);

// GET /api/users/:id
router.get('/users/:id', authCheck([Roles.admin, Roles.siteAdmin, Roles.user]), userController.find);

// DELETE /api/users/:id
router.delete('/users/:id', authCheck([Roles.admin, Roles.siteAdmin, Roles.user]), userController.destroy);

// DELETE many /api/users/:id
router.delete('/users/ids/:ids', authCheck([Roles.admin, Roles.siteAdmin, Roles.user]), userController.destroys);

// PUT /api/users
router.put('/users', authCheck([Roles.admin, Roles.siteAdmin, Roles.user]), userController.updateUser);

// PUT /api/users/password
router.put('/users/password', authCheck([Roles.admin, Roles.siteAdmin, Roles.user]), userController.updatePassword);

// PUT /api/users/role
router.put('/users/role', authCheck([Roles.admin, Roles.siteAdmin, Roles.user]), userController.updateRole);

// PUT /api/users/profile
router.put('/users/profile', authCheck([Roles.admin, Roles.siteAdmin, Roles.user]), userController.updateProfile);

// PUT /api/users/profile/password
router.put('/users/profile/password', authCheck([Roles.admin, Roles.siteAdmin, Roles.user]), userController.updateProfilePassword);

// GET /api/stores
router.get('/stores', authCheck([Roles.admin, Roles.siteAdmin, Roles.user]), storeController.list);

// POST /apu/stores
router.post('/stores', authCheck([Roles.admin, Roles.siteAdmin, Roles.user]), storeController.create);

// PUT /api/store
router.put('/stores', authCheck([Roles.admin, Roles.siteAdmin, Roles.user]), storeController.updateStore);

// DELETE many store /api/stores/:ids
router.delete('/stores/:ids', authCheck([Roles.admin, Roles.siteAdmin, Roles.user]), storeController.destroys);

// new API for Hook
router.post('/woo/hooks/create', wooController.create);

router.post('/woo/hooks/update', wooController.update);

router.post('/woo/hooks/delete', wooController.delete);

router.delete('/woo/hooks/delete', wooController.delete);

// API FOR SYNC DATA
router.put('/oms/sync', authCheck([Roles.admin, Roles.siteAdmin, Roles.user]), orderController.syncData);

// GET LIST ORDERS
router.get('/orders', authCheck([Roles.admin, Roles.siteAdmin, Roles.user]), orderController.listOrder);

router.put('/orders', authCheck([Roles.admin, Roles.siteAdmin, Roles.user]), orderController.updateOrders);

// PUT REMOVE TRACKING
router.put('/remove/tracking', authCheck([Roles.admin, Roles.siteAdmin, Roles.user]), orderController.removeElementTracking);


router.get('/export/orders', authCheck([Roles.admin, Roles.siteAdmin, Roles.user]), orderController.exportData);

// Dashboard get Infor
router.get('/dashboard/index', authCheck([Roles.admin, Roles.siteAdmin, Roles.user]), dashboardController.dashboardInfo);



module.exports = router;
