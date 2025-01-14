#!/usr/bin/env node

import fs from "fs";
import zonefile from "../lib/zonefile.js";

import { createRequire } from "module";
const require = createRequire(import.meta.url);

var args = function () {
  var ret = [];
  process.argv.forEach(function (val, index, array) {
    if (index >= 2) {
      ret.push(val);
    }
  });
  return ret;
};

var input = args();

var pjson = require("../package.json");
if (input.length === 0) {
  console.log("dns-zonefile version: ", pjson.version);
  console.log("Usage:");
  console.log('   "zonefile [-v|--version]" to show version information.');
  console.log('   "zonefile -p zonefile.txt" to parse a zonefile to JSON.');
  console.log('   "zonefile -g zonefile.json" to generate a zonefile from JSON.');
  console.log(
    '   "zonefile zonefile.json" to generate a zonefile from JSON if the file name ' +
      '\n     contains ".json", case insensitively, otherwise to parse the file as a zonefile to JSON.'
  );
} else if (input[0] === "-v" || input[0] === "--version") {
  console.log("dns-zonefile version: ", pjson.version);
} else if (input[0] === "-g") {
  var src = input[1];
  var options = fs.readFileSync(src, "utf8");
  var output = zonefile.generate(JSON.parse(options));
  console.log(output);
} else if (input[0] === "-p") {
  var src = input[1];
  var options = fs.readFileSync(src, "utf8");
  var output = zonefile.parse(options);
  console.log(JSON.stringify(output));
} else {
  var src = input[0];
  var options = fs.readFileSync(src, "utf8");
  if (src.toLocaleLowerCase().indexOf(".json") > 0) {
    var output = zonefile.generate(JSON.parse(options));
  } else {
    var output = zonefile.parse(options);
    output = JSON.stringify(output);
  }
  console.log(output);
}
