const {parse, check} = require('./src/index.js');
[
    [
        'number',
        '{"type":"number"}',
        [
            [1, true],
            ['123', false],
            [null, false],
        ]
    ],
    [
        'number[]',
        '{"type":"array","value":{"type":"number"}}',
        [
            [1, false],
            [[1], true],
            [[1, 2, 3], true],
            [[1, 2, '3'], false],
            ['123', false],
            [['123'], false],
            [null, false],
        ]
    ],
    [
        'void',
        '{"type":"void"}',
        [
            [1, false],
            [[1], false],
            ['123', false],
            [undefined, true],
            [['123'], false],
            [null, true],
        ]
    ],
    [
        'Array<number>',
        '{"type":"array","value":{"type":"number"}}',
        [
            [1, false],
            [[1], true],
            [[1, 2, 3], true],
            [[1, 2, '3'], false],
            ['123', false],
            [['123'], false],
            [null, false],
        ]
    ],
    [
        'number[][]',
        '{"type":"array","value":{"type":"array","value":{"type":"number"}}}',
        [
            [1, false],
            [[1], false],
            [[[1]], true],
            [[1, 2, 3], false],
            [[[1, 2, 3]], true],
            [[1, 2, '3'], false],
            ['123', false],
            [['123'], false],
            [null, false],
        ]
    ],
    [
        'number|string',
        '{"type":"|","value":[{"type":"number"},{"type":"string"}]}',
        [
            [1, true],
            ['', true],
            [[''], false],
            [true, false],
            [null, false],
        ]
    ],
    [
        'number|string|boolean',
        '{"type":"|","value":[{"type":"string"},{"type":"boolean"},{"type":"number"}]}',
        [
            [1, true],
            ['', true],
            [[''], false],
            [true, true],
            [false, true],
            [null, false],
        ]
    ],
    [
        'Array<number|string>',
        '{"type":"array","value":{"type":"|","value":[{"type":"number"},{"type":"string"}]}}',
        [
            [1, false],
            ['', false],
            [[''], true],
            [[1], true],
            [[true], false],
            [true, false],
            [false, false],
            [null, false],
            [[1, 2, 3], true],
            [[1, 2, '3'], true],
            [[false], false],
            [[1, false, '3'], false],
            ['123', false],
            [['123'], true],
            [null, false],
        ]
    ],
    [
        '[string,number]',
        '{"type":"tuple","value":[{"type":"string"},{"type":"number"}]}',
        [
            [1, false],
            ['', false],
            [[''], false],
            [[1], false],
            [[true], false],
            [true, false],
            [false, false],
            [null, false],
            [[1, 2, 3], false],
            [[1, 2, '3'], false],
            [[false], false],
            [[1, false, '3'], false],
            ['123', false],
            [['123'], false],
            [null, false],
            [[true, 1], false],
            [['', 1], true],
            [['', ''], false],
            [['', 1, 0], false],
        ]
    ],
    [
        '[string,number][]',
        '{"type":"array","value":{"type":"tuple","value":[{"type":"string"},{"type":"number"}]}}',
        [
            [1, false],
            [[''], false],
            [['', 1], false],
            [[['', 1]], true],
            [[['', '']], false],
        ]
    ],
    [
        '{label:string}',
        '{"type":"object","value":[{"type":"objectValue","mastNeed":true,"key":"label","value":{"type":"string"}}]}',
        [
            [1, false],
            [[''], false],
            [['', 1], false],
            [{}, false],
            [{label: 'asd'}, true],
            [{label: 1}, false],
            [{label: 1, title: '11'}, false],
            [{label: '', title: '11'}, false],
        ]
    ],
    [
        '{label:string,title:number}',
        '{"type":"object","value":[{"type":"objectValue","mastNeed":true,"key":"label","value":{"type":"string"}},{"type":"objectValue","mastNeed":true,"key":"title","value":{"type":"number"}}]}',
        [
            [1, false],
            [[1], false],
            [{}, false],
            [{label: ''}, false],
            [{title: ''}, false],
            [{label: '', title: ''}, false],
            [{label: '', title: 1}, true],
        ]
    ],
    [
        '{label?:string}',
        '{"type":"object","value":[{"type":"objectValue","mastNeed":false,"key":"label","value":{"type":"string"}}]}',
        [
            [1, false],
            [[''], false],
            [['', 1], false],
            [{}, true],
            [{label: 'asd'}, true],
            [{label: 1}, false],
            [{label: 1, title: '11'}, false],
            [{label: '', title: '11'}, false],
        ]
    ],
    [
        '{label:string}[]',
        '{"type":"array","value":{"type":"object","value":[{"type":"objectValue","mastNeed":true,"key":"label","value":{"type":"string"}}]}}',
        [
            [1, false],
            [[''], false],
            [['', 1], false],
            [{}, false],
            [{label: 'asd'}, false],
            [{label: 1}, false],
            [{label: 1, title: '11'}, false],
            [{label: '', title: '11'}, false],
            [[{label: 'asd'}], true],
        ]
    ],
    [
        '{label?:string}[]',
        '{"type":"array","value":{"type":"object","value":[{"type":"objectValue","mastNeed":false,"key":"label","value":{"type":"string"}}]}}',
        [
            [1, false],
            [[''], false],
            [['', 1], false],
            [{}, false],
            [{label: 'asd'}, false],
            [{label: 1}, false],
            [{label: 1, title: '11'}, false],
            [{label: '', title: '11'}, false],
            [[{}], true],
            [[{label: 'asd'}], true],
        ]
    ],
    [
        '{label:string|number}',
        '{"type":"object","value":[{"type":"objectValue","mastNeed":true,"key":"label","value":{"type":"|","value":[{"type":"string"},{"type":"number"}]}}]}',
        [
            [1, false],
            [[''], false],
            [['', 1], false],
            [{}, false],
            [{label: 'asd'}, true],
            [{label: 1}, true],
            [{label: 1, title: '11'}, false],
            [{label: '', title: '11'}, false],
        ]
    ],
    [
        '{articles:{deep:{deep2:{deep3:number}},label:string|number}[]}',
        '{"type":"object","value":[{"type":"objectValue","mastNeed":true,"key":"articles","value":{"type":"array","value":{"type":"object","value":[{"type":"objectValue","mastNeed":true,"key":"deep","value":{"type":"object","value":[{"type":"objectValue","mastNeed":true,"key":"deep2","value":{"type":"object","value":[{"type":"objectValue","mastNeed":true,"key":"deep3","value":{"type":"number"}}]}}]}},{"type":"objectValue","mastNeed":true,"key":"label","value":{"type":"|","value":[{"type":"string"},{"type":"number"}]}}]}}}]}',
        [
            [1, false],
            [[''], false],
            [['', 1], false],
            [{}, false],
            [{label: 'asd'}, false],
            [{label: 1}, false],
            [{label: 1, title: '11'}, false],
            [{label: '', title: '11'}, false],
            [{articles: [{deep: {deep2: {deep3: 1}}, label: ''}]}, true],
        ]
    ],
].forEach(vals => {
    if(JSON.stringify(parse(vals[0])) === vals[1]) {
        console.log(JSON.stringify(parse(vals[0])) === vals[1])
        vals[2].forEach(itemCheck => {
            if(check(vals[0], itemCheck[0]) === itemCheck[1]) {
                // console.log('ok')
            } else {
                console.log('====================error====================')
                console.log(vals[0])
                console.log(vals[1])
                console.log(itemCheck)
                console.log(check(vals[0], itemCheck[0]), itemCheck[1])
            }
        })
    } else {
        console.error(false, '!!!!!', vals[0], JSON.stringify(parse(vals[0])), vals[1])
    }
})
