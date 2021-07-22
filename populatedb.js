#! /usr/bin/env node

console.log('This script populates some motorcycle-related items to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

var async = require('async')
var Motorcycle = require('./models/motorcycle')
var Type = require('./models/type')
var GearType = require('./models/gear_type')
var Brand = require('./models/brand')
var Gear = require('./models/gear')
var Manufacturer = require('./models/manufacturer')

var mongoose = require('mongoose');
var mongoDB ="mongodb+srv://Henry:FaL6jJrxQsSSi2V@cluster0.abwln.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var motorcycles = []
var gears = []
var types = []
var gear_types = []
var brands = []
var manufacturers = []

function manufacturerCreate(manufacturer_name, country, cb) {
  manufacturerdetail = {manufacturer_name: manufacturer_name, country: country}
  
  var manufacturer = new Manufacturer(manufacturerdetail);
       
  manufacturer.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Manufacturer: ' + manufacturer);
    manufacturers.push(manufacturer)
    cb(null, manufacturer)
  }  );
}

function gearCreate(gear_name, brand, summary, gear_type, cb) {
  geardetail = {gear_name: gear_name, brand: brand, summary: summary, gear_type: gear_type}
  
  var gear = new Gear(geardetail);
       
  gear.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New gear: ' + gear);
    gears.push(gear)
    cb(null, gear)
  }  );
}

function typeCreate(name, cb) {
  var type = new Type({ name: name });
       
  type.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Type: ' + type);
    types.push(type)
    cb(null, type);
  }   );
}

function gearTypeCreate(name, cb) {
  var gearType = new GearType({ name: name });
       
  gearType.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New gearType: ' + gearType);
    gear_types.push(gearType)
    cb(null, gearType);
  }   );
}

function motorcycleCreate(model, manufacturer, summary, type, cb) {
  motorcycledetail = { 
    model: model,
    manufacturer: manufacturer,
    summary: summary,
    type: type,
  }
  if (type != false) motorcycledetail.type = type
    
  var motorcycle = new Motorcycle(motorcycledetail);    
  motorcycle.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Motorcycle: ' + motorcycle);
    motorcycles.push(motorcycle)
    cb(null, motorcycle)
  }  );
}

function brandCreate(brand_name, cb) {
  branddetail = { brand_name: brand_name }
    
  var brand = new Brand(branddetail);    
  brand.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Brand: ' + brand);
    brands.push(brand)
    cb(null, brand)
  }  );
}

function createTypes(cb) {
  async.series([
      function(callback) {
        typeCreate("Cruiser", callback);
      },
      function(callback) {
        typeCreate("Sport", callback);
      },
      function(callback) {
        typeCreate("Vintage", callback);
      },
      ],
      // optional callback
      cb);
}

function createManufacturerGears(cb) {
    async.series([
        function(callback) {
          manufacturerCreate('Harley-Davidson', 'USA', callback);
        },
       function(callback) {
          manufacturerCreate('Honda', 'Japan', callback);
        },
	     function(callback) {
          manufacturerCreate('Ducati', 'Italy', callback);
        },
       function(callback) {
          gearCreate('Schuberth C4', brands[0], 'A full-face motorcycle helmet for speedy rides.', gear_types[0], callback);
        },
        function(callback) {
          gearCreate('Dainese Super Rider', brands[1], 'A padded jacket for rough riding.', gear_types[1], callback);
        },
        function(callback) {
          gearCreate('X-0 Armored Leggings', brands[0], 'Armored pants for emergency sliding.', gear_types[2], callback);
        },
        ],
        // optional callback
        cb);
}

function createMotorcycles(cb) {
    async.series([
        function(callback) {
          motorcycleCreate('Honda XR75', manufacturers[1], 'A vintage model that still packs a punch on tight city streets.', types[2], callback);
        },
        function(callback) {
          motorcycleCreate('Sportster 1200', manufacturers[0], 'A classic cruiser for smooth riding.', types[0], callback);
        },
	function(callback) {
          motorcycleCreate('Diavel 1200', manufacturers[2], 'A fast bike for a speedy ride.', types[1], callback);
        },
        ],
        // optional callback
        cb);
}

function createGearTypes(cb) {
  async.series([
      function(callback) {
        gearTypeCreate('Helmet', callback);
      },
      function(callback) {
        gearTypeCreate('Jacket', callback);
      },
      function(callback) {
        gearTypeCreate('Pants', callback);
      },
      ],
      // optional callback
      cb);
}

function createBrands(cb) {
    async.series([
        function(callback) {
          brandCreate('Champion', callback);
        },
        function(callback) {
          brandCreate('Barnett', callback);
        },
        ],
        // optional callback
        cb);
}

async.series([
    createBrands,
    createGearTypes,
    createTypes,
    createManufacturerGears,
    createMotorcycles,
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+ err);
    }
    // All done, disconnect from database
    mongoose.connection.close();
});


