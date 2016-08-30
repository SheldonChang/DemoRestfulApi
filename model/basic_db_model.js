var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(Config.mongodb_url);


var create = function(params, result) {
  var path = './' + params.schema;
  var Schema = require(path);
  var _schema = new Schema(params.data);

  _schema.save(params.data, function(err) {
    if (err) {
      result(return_fail_message(err));
      return;
    }
    find(params, result);
  });
};

var find = function(params, result) {
  var path = './' + params.schema;
  var Schema = require(path);

  Schema.find(function(err, devices) {
    if (err) {
      result(return_fail_message(err));
      return;
    }
    result(return_success_message(devices));
  });
}


var find_by_id = function(params, result) {
  var path = './' + params.schema;
  var Schema = require(path);

  Schema.findById({ _id: params.id }, function(err, devices) {
    if (err) {
      result(return_fail_message(err));
      return;
    }
    result(return_success_message(devices));
  });
}

var update = function(params, result) {
  var path = './' + params.schema;
  var Schema = require(path);
  Schema.update({ _id: params.id }, params.data, function(err) {
    if (err) {
      result(return_fail_message(err));
      return;
    }
    find_by_id(params, result);
  });
}

var remove = function(params, result) {
  var path = './' + params.schema;
  var Schema = require(path);
  Schema.remove({ _id: params.id }, function(err, response) {
    if (err) {
      result(return_fail_message(err));
      return;
    }
    find(params, result);
  });
}

var create_element = function(params, result) {
  var path = './' + params.schema;
  var Schema = require(path);
  var data = {};
  data[params.element_name] = JSON.parse(params.data[params.element_name]);
  Schema.findByIdAndUpdate(params.id, { $push: data }, { new: true, safe: true, upsert: true },
    function(err, model) {
      if (err) {
        result(return_fail_message(err));
        return;
      }
      result(return_success_message(model));
    });
}

var update_element = function(params, result) {
  var path = './' + params.schema;
  var Schema = require(path);
  var element_name = params.element_name;
  var data = combine_data_object(params.element_name, params.data, '.$.');
  var select = {};
  select[element_name + '._id'] = params.element_id;

  Schema.update(select, {
      '$set': data
    },
    function(err, model) {
      if (err) {
        result(return_fail_message(err));
        return;
      }
      find_by_id(params, result);
    });
}

var remove_element = function(params, result) {
  var path = './' + params.schema;
  var Schema = require(path);
  var element_id = params.element_id;
  var data = {};
  data[params.element_name] = { _id: params.element_id };

  Schema.findByIdAndUpdate(params.id.toString(), { $pull: data }, { new: true }, function(err, model) {
    if (err) {
      Ut.log(err);
      Ut.print_call_stack();
      result(Config.error_code.remove_fail);
      return;
    }
    var returnJson = Ut.clone(Config.error_code.success);
    returnJson.result = model;
    result(returnJson);
  });
}

function return_success_message(msg) {
  var returnJson = Ut.clone(Config.error_code.success);
  returnJson.result = msg;
  return returnJson;
}

function return_fail_message(err) {
  Ut.log(err);
  Ut.print_call_stack();
  var returnJson = Ut.clone(Config.error_code.fail);
  returnJson.message = err;
  returnJson.result = {};
  return returnJson;
}

function combine_data_object(item, obj, append) {
  var rs = {};
  for (var key in obj) {
    rs[item + append + key] = obj[key];
  }
  return rs;
}


exports.create = create;
exports.find = find;
exports.find_by_id = find_by_id;
exports.update = update;
exports.remove = remove;
exports.create_element = create_element;
exports.update_element = update_element;
exports.remove_element = remove_element;
