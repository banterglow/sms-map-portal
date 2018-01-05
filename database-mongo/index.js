let mongoose = require('mongoose');
let uniqueValidator = require('mongoose-unique-validator');

mongoose.connect('mongodb://localhost/maps');

let db = mongoose.connection;

db.on('error', function() {
  console.log('mongoose connection error');
});

db.once('open', function() {
  console.log('mongoose connected successfully');
});

let routeSchema = mongoose.Schema({
  id: {
    type: String,
    unique: true,
  },
  createdAt: Date,
  origin: String,
  dest: String
});

routeSchema.plugin(uniqueValidator);

let Route = mongoose.model('Route', routeSchema);

let selectAll = () => {
  return Route.find({}, null, {limit:18, sort: {createdAt: -1}})
};

let insert = (route) => {
  console.log(route)
  let id = route.origin + route.dest;
  return Route.create({ id: id.toLowerCase(), createdAt: new Date(), origin: route.origin, dest: route.dest });
}



module.exports.selectAll = selectAll;
module.exports.insert = insert;