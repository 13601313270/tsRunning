const {getFuncReturnType} = require('../src/getFuncReturnType');

function run() {
    const testList = [
        [function () {
        }, 'any']
    ]
    for (let i = 0; i < testList.length; i++) {
        getFuncReturnType(testList[i][0])
    }
}

exports.functionReturnCheck = run;
