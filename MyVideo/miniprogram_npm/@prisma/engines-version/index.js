module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1697025983748, function(require, module, exports) {

Object.defineProperty(exports, "__esModule", { value: true });
exports.enginesVersion = void 0;
exports.enginesVersion = require('./package.json').prisma.enginesVersion;
//# sourceMappingURL=index.js.map
}, function(modId) {var map = {"./package.json":1697025983749}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1697025983749, function(require, module, exports) {
module.exports = {
  "name": "@prisma/engines-version",
  "version": "5.4.1-2.ac9d7041ed77bcc8a8dbd2ab6616b39013829574",
  "main": "index.js",
  "types": "index.d.ts",
  "license": "Apache-2.0",
  "author": "Tim Suchanek <suchanek@prisma.io>",
  "prisma": {
    "enginesVersion": "ac9d7041ed77bcc8a8dbd2ab6616b39013829574"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/prisma/engines-wrapper.git",
    "directory": "packages/engines-version"
  },
  "devDependencies": {
    "@types/node": "18.18.4",
    "typescript": "4.9.5"
  },
  "files": [
    "index.js",
    "index.d.ts"
  ],
  "scripts": {
    "build": "tsc -d"
  }
}
}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1697025983748);
})()
//miniprogram-npm-outsideDeps=[]
//# sourceMappingURL=index.js.map