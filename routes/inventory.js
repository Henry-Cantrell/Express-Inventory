var express = require('express');
var router = express.Router();


// Require our controllers.
var motorcycle_controller = require('../controllers/motorcycleController'); 
var manufacturer_controller = require('../controllers/manufacturerController');
var gear_controller = require('../controllers/gearController');
var brand_controller = require('../controllers/brandController');
var geartype_controller = require('../controllers/gearTypeController');
var type_controller = require('../controllers/typeController');

/// MOTORCYCLE ROUTES ///

// GET inventory home page.
router.get('/', motorcycle_controller.index);  

// GET request for creating a Motorcycle. NOTE This must come before routes that display motorcycle (uses id).
router.get('/motorcycle/create', motorcycle_controller.motorcycle_create_get);

// POST request for creating motorcycle.
router.post('/motorcycle/create', motorcycle_controller.motorcycle_create_post);

// GET request to delete motorcycle.
router.get('/motorcycle/:id/delete', motorcycle_controller.motorcycle_delete_get);

// POST request to delete motorcycle.
router.post('/motorcycle/:id/delete', motorcycle_controller.motorcycle_delete_post);

// GET request to update motorcycle.
router.get('/motorcycle/:id/update', motorcycle_controller.motorcycle_update_get);

// POST request to update motorcycle.
router.post('/motorcycle/:id/update', motorcycle_controller.motorcycle_update_post);

// GET request for one motorcycle.
router.get('/motorcycle/:id', motorcycle_controller.motorcycle_detail);

// GET request for list of all motorcycle.
router.get('/motorcycles', motorcycle_controller.motorcycle_list);

/// brand ROUTES ///

// GET request for creating brand. NOTE This must come before route for id (i.e. display brand).
router.get('/brand/create', brand_controller.brand_create_get);

// POST request for creating brand.
router.post('/brand/create', brand_controller.brand_create_post);

// GET request to delete brand.
router.get('/brand/:id/delete', brand_controller.brand_delete_get);

// POST request to delete brand
router.post('/brand/:id/delete', brand_controller.brand_delete_post);

// GET request to update brand.
router.get('/brand/:id/update', brand_controller.brand_update_get);

// POST request to update brand.
router.post('/brand/:id/update', brand_controller.brand_update_post);

// GET request for one brand.
router.get('/brand/:id', brand_controller.brand_detail);

// GET request for list of all brands.
router.get('/brands', brand_controller.brand_list);

/// gear ROUTES ///

// GET request for creating gear. NOTE This must come before route for id (i.e. display gear).
router.get('/gear/create', gear_controller.gear_create_get);

// POST request for creating gear.
router.post('/gear/create', gear_controller.gear_create_post);

// GET request to delete gear.
router.get('/gear/:id/delete', gear_controller.gear_delete_get);

// POST request to delete gear
router.post('/gear/:id/delete', gear_controller.gear_delete_post);

// GET request to update gear.
router.get('/gear/:id/update', gear_controller.gear_update_get);

// POST request to update gear.
router.post('/gear/:id/update', gear_controller.gear_update_post);

// GET request for one gear.
router.get('/gear/:id', gear_controller.gear_detail);

// GET request for list of all gears.
router.get('/gear', gear_controller.gear_list);

/// manufacturer ROUTES ///

// GET request for creating manufacturer. NOTE This must come before route for id (i.e. display manufacturer).
router.get('/manufacturer/create', manufacturer_controller.manufacturer_create_get);

// POST request for creating manufacturer.
router.post('/manufacturer/create', manufacturer_controller.manufacturer_create_post);

// GET request to delete manufacturer.
router.get('/manufacturer/:id/delete', manufacturer_controller.manufacturer_delete_get);

// POST request to delete manufacturer
router.post('/manufacturer/:id/delete', manufacturer_controller.manufacturer_delete_post);

// GET request to update manufacturer.
router.get('/manufacturer/:id/update', manufacturer_controller.manufacturer_update_get);

// POST request to update manufacturer.
router.post('/manufacturer/:id/update', manufacturer_controller.manufacturer_update_post);

// GET request for one manufacturer.
router.get('/manufacturer/:id', manufacturer_controller.manufacturer_detail);

// GET request for list of all manufacturers.
router.get('/manufacturers', manufacturer_controller.manufacturer_list);

/// type ROUTES ///

// GET request for creating type. NOTE This must come before route for id (i.e. display type).
router.get('/type/create', type_controller.type_create_get);

// POST request for creating type.
router.post('/type/create', type_controller.type_create_post);

// GET request to delete type.
router.get('/type/:id/delete', type_controller.type_delete_get);

// POST request to delete type
router.post('/type/:id/delete', type_controller.type_delete_post);

// GET request to update type.
router.get('/type/:id/update', type_controller.type_update_get);

// POST request to update type.
router.post('/type/:id/update', type_controller.type_update_post);

// GET request for one type.
router.get('/type/:id', type_controller.type_detail);

// GET request for list of all types.
router.get('/types', type_controller.type_list);

/// geartype ROUTES ///

// GET request for creating geartype. NOTE This must come before route for id (i.e. display geartype).
router.get('/geartype/create', geartype_controller.gearType_create_get);

// POST request for creating geartype.
router.post('/geartype/create', geartype_controller.gearType_create_post);

// GET request to delete geartype.
router.get('/geartype/:id/delete', geartype_controller.gearType_delete_get);

// POST request to delete geartype
router.post('/geartype/:id/delete', geartype_controller.gearType_delete_post);

// GET request to update geartype.
router.get('/geartype/:id/update', geartype_controller.gearType_update_get);

// POST request to update geartype.
router.post('/geartype/:id/update', geartype_controller.gearType_update_post);

// GET request for one geartype.
router.get('/geartype/:id', geartype_controller.gearType_detail);

// GET request for list of all geartypes.
router.get('/geartypes', geartype_controller.gearType_list);


module.exports = router;
