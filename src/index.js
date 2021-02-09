const {parse} = require('./parse');
const {stringify} = require('./stringify');
const {check} = require('./check');
exports.parse = parse;
exports.check = (option, val) => {
    return check(parse(option), val);
}
exports.checkByOption = (option, val) => {
    return check(option, val);
}
exports.stringify = stringify
