const {parse} = require('./src/index.js');
[
    ['number','{"type":"number"}'],
    ['number[]','{"type":"array","value":{"type":"number"}}'],
    ['Array<number>','{"type":"array","value":{"type":"number"}}'],
    ['number[][]','{"type":"array","value":{"type":"array","value":{"type":"number"}}}'],
    ['number|string','{"type":"|","value":[{"type":"number"},{"type":"string"}]}'],
    ['number|string|boolean','{"type":"|","value":[{"type":"string"},{"type":"boolean"},{"type":"number"}]}'],
    ['Array<number|string>','{"type":"array","value":{"type":"|","value":[{"type":"number"},{"type":"string"}]}}'],
    ['[string,number]','{"type":"tuple","value":[{"type":"string"},{"type":"number"}]}'],
    ['[string,number][]','{"type":"array","value":{"type":"tuple","value":[{"type":"string"},{"type":"number"}]}}'],
    ['{label:string}','{"type":"object","value":[{"type":"objectValue","mastNeed":true,"key":"label","value":{"type":"string"}}]}'],
    ['{label:string,title:number}','{"type":"object","value":[{"type":"objectValue","mastNeed":true,"key":"label","value":{"type":"string"}},{"type":"objectValue","mastNeed":true,"key":"title","value":{"type":"number"}}]}'],
    ['{label?:string}','{"type":"object","value":[{"type":"objectValue","mastNeed":false,"key":"label","value":{"type":"string"}}]}'],
    ['{label:string}[]','{"type":"array","value":{"type":"object","value":[{"type":"objectValue","mastNeed":true,"key":"label","value":{"type":"string"}}]}}'],
].forEach(vals => {
    if(JSON.stringify(parse(vals[0])) === vals[1]){
        console.log(JSON.stringify(parse(vals[0])) === vals[1])
    } else {
        console.log(false,vals[0],JSON.stringify(parse(vals[0])),vals[1])
    }
})
