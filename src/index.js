const {parse} = require('./parse');
const {check} = require('./check');
exports.parse = parse;
exports.check = (option, val) => {
    return check(parse(option), val);
}