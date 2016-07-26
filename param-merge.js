'use strict';

var path = require('path');
var fs = require('fs');
var util = require('util');
var merge = require('lodash.merge');

var args = process.argv.slice(2);

util.log('reading parameter file');
var filename = args[0];
var fileParams = require(path.resolve(filename));
var values = args.slice(1);

var params = {};

util.log('parsing override values');
values.forEach(function(f){
  var bits = f.split('=');
  if(bits.length != 2 || !bits[0] || !bits[1]){
    util.log(`[Error] Could not parse override: ${f}`);
  }
  params[bits[0].trim()] =  { value: bits[1].trim() };
});

fileParams.parameters = merge(fileParams.parameters, params);

util.log('writing output file');
fs.writeFile(filename, JSON.stringify(fileParams, null, 2), (err) => {
  if(err){
    util.log(err);
  }
  util.log('done');
});
