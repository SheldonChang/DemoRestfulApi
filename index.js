global.Config = require('./config.json');
global.Ut = require('./utility/utility');

var express = require('express');
var bodyParse = require('body-parser');
var morgan = require('morgan');
var basic_schema = require('./model/basic_db_model.js');
var api = express();
var router = express.Router();
var port = process.env.PORT || 8888;

api.use(morgan('dev'));
api.use(bodyParse.urlencoded({ extended: true }));
api.use(bodyParse.json());

router.use(function(req, res, next) {
    next();
});

router.route('/:schema')
    .post(function(req, res) {
        basic_schema.create({
            schema: req.params.schema,
            data: req.body
        }, function(res_json) {
            res.json(res_json);
        });
    })
    .get(function(req, res) {
        basic_schema.find({
            schema: req.params.schema
        }, function(res_json) {
            res.json(res_json);
        });
    });

router.route('/:schema/:id')
    .get(function(req, res) {
        basic_schema.find_by_id({
            schema: req.params.schema,
            id: req.params.id
        }, function(res_json) {
            res.json(res_json);
        });
    })
    .put(function(req, res) {
        basic_schema.update({
            schema: req.params.schema,
            id: req.params.id,
            data: req.body
        }, function(res_json) {
            res.json(res_json);
        });
    })
    .delete(function(req, res) {
        basic_schema.remove({
            schema: req.params.schema,
            id: req.params.id
        }, function(res_json) {
            res.json(res_json);
        });
    });

router.route('/:schema/:element_name/:id')
    .post(function(req, res) {
        basic_schema.create_element({
            schema: req.params.schema,
            id: req.params.id,
            element_name: req.params.element_name,
            data: req.body
        }, function(res_json) {
            res.json(res_json);
        });
    });


router.route('/:schema/:element_name/:id/:element_id')
    .delete(function(req, res) {
        basic_schema.remove_element({
            schema: req.params.schema,
            id: req.params.id,
            element_id: req.params.element_id,
            element_name: req.params.element_name
        }, function(res_json) {
            res.json(res_json);
        });
    }).put(function(req, res) {
        basic_schema.update_element({
            schema: req.params.schema,
            id: req.params.id,
            element_id: req.params.element_id,
            element_name: req.params.element_name,
            data: req.body
        }, function(res_json) {
            res.json(res_json);
        });
    });


api.use('/', router);

api.listen(port);
