'use strict';

var path = require('path');
var fs = require('fs');
var util = require('util');
var merge = require('lodash.merge');

var args = process.argv.slice(2);

var templateFilename = args[0];
var parameterFilename = args[1];

util.log('reading template file');
var template = require(path.resolve(templateFilename));
util.log('reading parameter file');
var fileParams = require(path.resolve(parameterFilename));
var values = args.slice(2);

var params = {};

util.log('parsing override values');
values.forEach(function(f){
  var bits = f.split('=');
  if(bits.length != 2 || !bits[0] || !bits[1]){
    util.log(`[Error] Could not parse override: ${f}`);
  }
  var key = bits[0].trim();
  var value = bits[1].trim();
  if(!!template.parameters[key]){
    params[key] =  { value: value };
  }
});

fileParams.parameters = merge(fileParams.parameters, params);

util.log('writing output file');
fs.writeFile(parameterFilename, JSON.stringify(fileParams, null, 2), (err) => {
  if(err){
    util.log(err);
  }
  util.log('done');
});
