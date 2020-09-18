var testing = require('./testing.js');
var t1 = new testing('АЛЕША1333');

console.log(global.db);

module.exports = class {
    constructor(text) {
        console.log(text);
    }
};