const {parse, check, stringify} = require('../src/index.js');

function run() {
    const testList = [
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
            'Date',
            '{"type":"Date"}',
            [
                [1, false],
                ['1', false],
                [new Date(), true],
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
            ],
            'Array<number>'
        ],
        [
            'any',
            '{"type":"any"}',
            [
                [1, true],
                ['123', true],
                [null, true],
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
            ],
            'number[]'
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
            ],
            'Array<Array<number>>'
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
            '(number|string)[]',
            '{"type":"array","value":{"type":"|","value":[{"type":"number"},{"type":"string"}]}}',
            [
                [1, false],
                ['', false],
                [[''], true],
                [true, false],
                [null, false],
                [[1, 2], true],
                [[1, ''], true],
                [[true, ''], false],
            ],
            'Array<number|string>'
        ],
        [
            'number|string[]',
            '{"type":"|","value":[{"type":"number"},{"type":"array","value":{"type":"string"}}]}',
            [
                [1, true],
                ['', false],
                [[''], true],
                [true, false],
                [null, false],
            ],
            'number|Array<string>'
        ],
        [
            'number|Date',
            '{"type":"|","value":[{"type":"number"},{"type":"Date"}]}',
            [
                [1, true],
                ['', false],
                [[''], false],
                [true, false],
                [null, false],
                [new Date(), true],
            ]
        ],
        [
            'number|string|boolean',
            '{"type":"|","value":[{"type":"number"},{"type":"string"},{"type":"boolean"}]}',
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
            ],
            '(number|string)[]'
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
            ],
            'Array<[string,number]>'
        ],
        [
            '{ label:string}',
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
            ],
            `{
    label: string
}`
        ],
        [
            '{ [key: string]: number }',
            '{"type":"object","value":[{"type":"objectValue","mastNeed":true,"key":{"type":"objectKey","name":"key","keyType":{"type":"string"}},"value":{"type":"number"}}]}',
            [
                [1, false],
                [[''], false],
                [['', 1], false],
                [{}, true],
                [[], false],
                [{label: 'asd'}, false],
                [{label: 1}, true],
                [{label: 1, title: '11'}, false],
                [{label: 1, title: 2}, true],
                [{label: '', title: '11'}, false],
            ],
            `{
    [key: string]: number
}`
        ],
        [
            '{ [key: number]: number }',
            '{"type":"object","value":[{"type":"objectValue","mastNeed":true,"key":{"type":"objectKey","name":"key","keyType":{"type":"number"}},"value":{"type":"number"}}]}',
            [
                [1, false],
                [[''], false],
                [['', 1], false],
                [{}, false],
                [{label: 'asd'}, false],
                [{label: 1}, false],
                [{label: 1, title: '11'}, false],
                [{label: 1, title: 2}, false],
                [{label: '', title: '11'}, false],
                [[], true],
                [[2], true],
                [['2'], false],
            ],
            `{
    [key: number]: number
}`
        ],
        [
            '{ [key: string]: number, length: number }',
            '{"type":"object","value":[{"type":"objectValue","mastNeed":true,"key":{"type":"objectKey","name":"key","keyType":{"type":"string"}},"value":{"type":"number"}},{"type":"objectValue","mastNeed":true,"key":"length","value":{"type":"number"}}]}',
            [
                [1, false],
                [[''], false],
                [['', 1], false],
                [{}, false],
                [[], false],
                [{label: 'asd'}, false],
                [{label: 1}, false],
                [{label: 1, title: '11'}, false],
                [{label: 1, title: 2}, false],
                [{label: '', title: '11'}, false],
                [{label: 1, length: 2}, true],
                [{label: 1, length: '2'}, false],
                [{label: '', length: 2}, false],
                [{label: 1, length: 2, title: ''}, false],
                [{label: 1, length: 2, title: true}, false],
            ],
            `{
    [key: string]: number,
    length: number
}`
        ],
        [
            '{label:any}',
            '{"type":"object","value":[{"type":"objectValue","mastNeed":true,"key":"label","value":{"type":"any"}}]}',
            [
                [1, false],
                [[''], false],
                [['', 1], false],
                [{}, false],
                [{label: 'asd'}, true],
                [{label: 1}, true],
                [{label: 1, title: '11'}, false],
                [{label: '', title: '11'}, false],
            ],
            `{
    label: any
}`
        ],
        [
            '{label}',
            '{"type":"object","value":[{"type":"objectValue","mastNeed":true,"key":"label","value":{"type":"any"}}]}',
            [
                [1, false],
                [[''], false],
                [['', 1], false],
                [{}, false],
                [{label: 'asd'}, true],
                [{label: 1}, true],
                [{label: 1, title: '11'}, false],
                [{label: '', title: '11'}, false],
            ],
            `{
    label: any
}`
        ],
        [
            '{label,title}',
            '{"type":"object","value":[{"type":"objectValue","mastNeed":true,"key":"label","value":{"type":"any"}},{"type":"objectValue","mastNeed":true,"key":"title","value":{"type":"any"}}]}',
            [
                [1, false],
                [[''], false],
                [['', 1], false],
                [{}, false],
                [{label: 'asd'}, false],
                [{label: 1}, false],
                [{label: 1, title: '11'}, true],
                [{label: '', title: '11'}, true],
            ],
            `{
    label: any,
    title: any
}`
        ],
        [
            '{label:string,title}',
            '{"type":"object","value":[{"type":"objectValue","mastNeed":true,"key":"label","value":{"type":"string"}},{"type":"objectValue","mastNeed":true,"key":"title","value":{"type":"any"}}]}',
            [
                [1, false],
                [[''], false],
                [['', 1], false],
                [{}, false],
                [{label: 'asd'}, false],
                [{label: 1}, false],
                [{label: 1, title: '11'}, false],
                [{label: '', title: '11'}, true],
            ],
            `{
    label: string,
    title: any
}`
        ],
        [
            '{label,title:string}',
            '{"type":"object","value":[{"type":"objectValue","mastNeed":true,"key":"label","value":{"type":"any"}},{"type":"objectValue","mastNeed":true,"key":"title","value":{"type":"string"}}]}',
            [
                [1, false],
                [[''], false],
                [['', 1], false],
                [{}, false],
                [{label: 'asd'}, false],
                [{label: 1}, false],
                [{label: 1, title: '11'}, true],
                [{label: '', title: 11}, false],
            ],
            `{
    label: any,
    title: string
}`
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
            ],
            `{
    label: string,
    title: number
}`
        ],
        [
            '{label:string,title:number,}',
            '{"type":"object","value":[{"type":"objectValue","mastNeed":true,"key":"label","value":{"type":"string"}},{"type":"objectValue","mastNeed":true,"key":"title","value":{"type":"number"}}]}',
            [
                [1, false],
                [[1], false],
                [{}, false],
                [{label: ''}, false],
                [{title: ''}, false],
                [{label: '', title: ''}, false],
                [{label: '', title: 1}, true],
            ],
            `{
    label: string,
    title: number
}`
        ],
        [
            `{
    label:string,
    title:number,
}`,
            '{"type":"object","value":[{"type":"objectValue","mastNeed":true,"key":"label","value":{"type":"string"}},{"type":"objectValue","mastNeed":true,"key":"title","value":{"type":"number"}}]}',
            [
                [1, false],
                [[1], false],
                [{}, false],
                [{label: ''}, false],
                [{title: ''}, false],
                [{label: '', title: ''}, false],
                [{label: '', title: 1}, true],
            ],
            `{
    label: string,
    title: number
}`
        ],
        [
            '{label:string;title:number}',
            '{"type":"object","value":[{"type":"objectValue","mastNeed":true,"key":"label","value":{"type":"string"}},{"type":"objectValue","mastNeed":true,"key":"title","value":{"type":"number"}}]}',
            [
                [1, false],
                [[1], false],
                [{}, false],
                [{label: ''}, false],
                [{title: ''}, false],
                [{label: '', title: ''}, false],
                [{label: '', title: 1}, true],
            ],
            `{
    label: string,
    title: number
}`
        ],
        [
            '{label:string;title:number;}',
            '{"type":"object","value":[{"type":"objectValue","mastNeed":true,"key":"label","value":{"type":"string"}},{"type":"objectValue","mastNeed":true,"key":"title","value":{"type":"number"}}]}',
            [
                [1, false],
                [[1], false],
                [{}, false],
                [{label: ''}, false],
                [{title: ''}, false],
                [{label: '', title: ''}, false],
                [{label: '', title: 1}, true],
            ],
            `{
    label: string,
    title: number
}`
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
            ],
            `{
    label?: string
}`
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
                [[{"label": "asd"}, {"label": "222"}], true],
                [{label: '', title: '11'}, false],
                [[{label: 'asd'}], true],
            ],
            `Array<{
    label: string
}>`
        ],
        [
            '{label:any}[]',
            '{"type":"array","value":{"type":"object","value":[{"type":"objectValue","mastNeed":true,"key":"label","value":{"type":"any"}}]}}',
            [
                [1, false],
                [[''], false],
                [['', 1], false],
                [{}, false],
                [{label: 'asd'}, false],
                [{label: 1}, false],
                [{label: 1, title: '11'}, false],
                [[{"label": "asd"}, {"label": "222"}], true],
                [{label: '', title: '11'}, false],
                [[{label: 'asd'}], true],
                [[{label: 1}], true],
            ],
            `Array<{
    label: any
}>`
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
            ],
            `Array<{
    label?: string
}>`
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
            ],
            `{
    label: string|number
}`
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
            ],
            `{
    articles: Array<{
        deep: {
            deep2: {
                deep3: number
            }
        },
        label: string|number
    }>
}`
        ],
        [
            `{
        label: string
        }`,
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
            ],
            `{
    label: string
}`
        ],
        [
            '88',
            '{"type":"value","value":88}',
            [
                [1, false],
                [88, true],
                ["88", false],
            ]
        ],
        [
            '"88"',
            '{"type":"value","value":"88"}',
            [
                [1, false],
                [88, false],
                ["88", true],
                ["", false],
            ]
        ],
        [
            '"hello"',
            '{"type":"value","value":"hello"}',
            [
                [1, false],
                [88, false],
                ["88", false],
                ["hello", true],
                ["", false],
            ]
        ],
        [
            'true',
            '{"type":"value","value":true}',
            [
                [1, false],
                [88, false],
                ["88", false],
                ["hello", false],
                ["", false],
                [false, false],
                [true, true],
            ]
        ],
        [
            'false',
            '{"type":"value","value":false}',
            [
                [1, false],
                [88, false],
                ["88", false],
                ["hello", false],
                ["", false],
                [false, true],
                [true, false],
            ]
        ],
        [
            '1|3',
            '{"type":"|","value":[{"type":"value","value":1},{"type":"value","value":3}]}',
            [
                [1, true],
                ['123', false],
                [3, true],
                [true, false],
            ]
        ],
        [
            '1|false',
            '{"type":"|","value":[{"type":"value","value":1},{"type":"value","value":false}]}',
            [
                [1, true],
                ['123', false],
                [3, false],
                [true, false],
                [false, true],
            ]
        ],
        [
            '{ label: (price: number) => boolean }',
            '{"type":"object","value":[{"type":"objectValue","mastNeed":true,"key":"label","value":{"type":"func","props":[{"type":"prop","name":"price","propType":{"type":"number"}}],"return":{"type":"boolean"}}}]}',
            [
                [1, false],
                [[''], false],
                [['', 1], false],
                [{}, false],
                [{label: 'asd'}, false],
                [{label: 1}, false],
                [{label: 1, title: '11'}, false],
                [{label: '', title: '11'}, false],
                [function (price) {
                    return false;
                }, false],
                [{
                    label: function (price) {
                        return false;
                    }
                }, true]
            ],
            `{
    label: (price: number) => boolean
}`
        ],
        [
            '{ label: (price: number,) => boolean }',
            '{"type":"object","value":[{"type":"objectValue","mastNeed":true,"key":"label","value":{"type":"func","props":[{"type":"prop","name":"price","propType":{"type":"number"}}],"return":{"type":"boolean"}}}]}',
            [
                [1, false],
                [[''], false],
                [['', 1], false],
                [{}, false],
                [{label: 'asd'}, false],
                [{label: 1}, false],
                [{label: 1, title: '11'}, false],
                [{label: '', title: '11'}, false],
                [function (price) {
                    return false;
                }, false],
                [{
                    label: function (price) {
                        return false;
                    }
                }, true]
            ],
            `{
    label: (price: number) => boolean
}`
        ],
        [
            '{ label: (price: number,) => {boolean} }',
            '{"type":"object","value":[{"type":"objectValue","mastNeed":true,"key":"label","value":{"type":"func","props":[{"type":"prop","name":"price","propType":{"type":"number"}}],"return":{"type":"object","value":[{"type":"objectValue","mastNeed":true,"key":"boolean","value":{"type":"any"}}]}}}]}',
            [
                [1, false],
                [[''], false],
                [['', 1], false],
                [{}, false],
                [{label: 'asd'}, false],
                [{label: 1}, false],
                [{label: 1, title: '11'}, false],
                [{label: '', title: '11'}, false],
                [function (price) {
                    return false;
                }, false],
                [{
                    label: function (price) {
                        return false;
                    }
                }, true]
            ],
            `{
    label: (price: number) => {
        boolean: any
    }
}`
        ],
        [
            '{ label: (price: number,title:string) => boolean }',
            '{"type":"object","value":[{"type":"objectValue","mastNeed":true,"key":"label","value":{"type":"func","props":[{"type":"prop","name":"price","propType":{"type":"number"}},{"type":"prop","name":"title","propType":{"type":"string"}}],"return":{"type":"boolean"}}}]}',
            [
                [1, false],
                [[''], false],
                [['', 1], false],
                [{}, false],
                [{label: 'asd'}, false],
                [{label: 1}, false],
                [{label: 1, title: '11'}, false],
                [{label: '', title: '11'}, false],
                [function (price) {
                    return false;
                }, false],
                [{
                    label: function (price) {
                        return false;
                    }
                }, true]
            ],
            `{
    label: (price: number, title: string) => boolean
}`
        ],
    ];
    for (let i = 0; i < testList.length; i++) {
        const vals = testList[i];
        if(JSON.stringify(parse(vals[0])) === vals[1]) {
            console.log(JSON.stringify(parse(vals[0])) === vals[1])
            if(stringify(JSON.parse(vals[1])) !== vals[0] && stringify(JSON.parse(vals[1])) !== vals[3]) {
                console.error('=====stringify失败！=====')
                console.error(vals[0])
                console.error(vals[1])
                console.error(stringify(JSON.parse(vals[1])))
                break;
            }
            for (let j = 0; j < vals[2].length; j++) {
                const itemCheck = vals[2][j];
                if(check(vals[0], itemCheck[0]) === itemCheck[1]) {
                    // console.log('ok')
                } else {
                    console.log('====================error====================')
                    console.log(vals[0])
                    console.log(vals[1])
                    console.log(itemCheck)
                    console.log(check(vals[0], itemCheck[0]), itemCheck[1])
                    break;
                }
            }
        } else {
            console.error(false, '!!!!!', vals[0])
            console.error(false, '!!!!!', JSON.stringify(parse(vals[0])))
            console.error(false, '!!!!!', vals[1])
            break;
        }
    }
}

exports.typeCheck = run;
