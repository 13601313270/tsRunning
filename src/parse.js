function parse(typeStrProp) {
    const typeStr = typeStrProp.replace(/\s/g, '')
    let slip = 0;

    function getNextWord(onlyGet = false) {
        const beginSlip = slip;
        const keywords = ['[]', '[', ']', '|', ',', ';', '<', '>', '{', '}', '?:', ':', '?', '(', ')', '=>'];
        let word = typeStr[slip];
        if(word === undefined) {
            return word;
        }
        if(keywords.includes(typeStr.slice(slip, slip + 2))) {
            word = typeStr.slice(slip, slip + 2);
            if(!onlyGet) {
                slip += 2
            }
            return word;
        } else if(keywords.includes(typeStr[slip])) {
            if(!onlyGet) {
                slip++
            }
            return word
        }
        while (slip < typeStr.length) {
            if(keywords.includes(typeStr[slip + 1])) {
                slip++;
                if(onlyGet) {
                    slip = beginSlip;
                }
                return word;
            } else {
                slip++;
            }
            if(slip < typeStr.length) {
                word += typeStr[slip];
            }
        }
        if(onlyGet) {
            slip = beginSlip;
        }
        return word;
    }

    function result(env) {
        let temp = {};
        const word = getNextWord(true)
        if(word === undefined) {
            return undefined
        }
        if([
            'number',
            'string',
            'boolean',
            'any',
            'void',
            'undefined',
            'null',
            'never',
            'Date'
        ].includes(getNextWord(true))) {
            temp = {type: getNextWord()}
        } else if(getNextWord(true) === 'Array') {
            getNextWord()
            if(getNextWord() === '<') {
                temp = {
                    type: 'array',
                    value: result('globle')
                }
            }
            if(getNextWord() === '>') {
            }
        } else if(getNextWord(true) === '[') {
            slip++;
            temp = {type: 'tuple', value: []}
            while (getNextWord(true) !== undefined) {
                const orTemp = result('globle')
                temp.value.push(orTemp)
                const nextTemp = getNextWord(true);
                slip++;
                if(nextTemp !== ',') {
                    break;
                }
            }
        } else if(getNextWord(true) === '{') {
            slip++;
            temp = {type: 'object', value: []}
            while (getNextWord(true) !== undefined) {
                if(getNextWord(true) === '}') {
                    break;
                }
                let key;
                if(getNextWord(true) === '[') {
                    getNextWord()
                    key = getNextWord();
                    if(getNextWord(true) === ':') {
                        getNextWord()
                        key = {
                            'type': 'objectKey',
                            'name': key,
                            'keyType': result('[')
                        }
                        getNextWord(); // ]
                    }
                } else {
                    key = getNextWord();
                }
                if(['}', ','].includes(getNextWord(true))) {
                    temp.value.push({
                        type: 'objectValue',
                        mastNeed: true,
                        key: key,
                        value: {type: 'any'}
                    })
                    if(getNextWord(true) === '}') {
                        break;
                    } else {
                        getNextWord(); // ,
                        continue;
                    }
                }
                let mastNeed = getNextWord() !== '?:';
                let value = result('globle');
                const nextWord = getNextWord(); // ,
                temp.value.push({
                    type: 'objectValue',
                    mastNeed: mastNeed,
                    key: key,
                    value: value
                })
                if(nextWord === '}') {
                    break;
                }
            }
        } else if(getNextWord(true).match(/^\d+$/)) {
            temp = {
                type: 'value',
                value: parseInt(getNextWord())
            }
        } else if(getNextWord(true).match(/^\"(.+)\"$/)) {
            temp = {
                type: 'value',
                value: getNextWord().match(/^\"(.+)\"$/, '$1')[1]
            }
        } else if(getNextWord(true).match(/^\'(.+)\'$/)) {
            temp = {
                type: 'value',
                value: getNextWord().match(/^\'(.+)\'$/, '$1')[1]
            }
        } else if(['true', 'false'].includes(getNextWord(true))) {
            temp = {
                type: 'value',
                value: getNextWord() === 'true'
            }
        } else if(getNextWord(true) === '(') {
            getNextWord();
            let leftCount = 1;
            // 判断是否是一个函数语法
            let isFunc = false;
            for (let i = slip; i < typeStr.length; i++) {
                if(typeStr[i] === '(') {
                    leftCount++
                } else if(typeStr[i] === ')') {
                    leftCount--
                }
                if(leftCount === 0) {
                    if(typeStr.slice(i + 1, i + 3) === '=>') {
                        isFunc = true
                    }
                    break;
                }
            }
            if(isFunc) {
                temp = {
                    type: 'func',
                    props: [],
                    return: {type: 'any'}
                }
                let p = 0;
                while (p++ < 100 && getNextWord(true) !== ')') {
                    const paramName = getNextWord();
                    let type = {type: 'any'}
                    if(getNextWord(true) === ':') {
                        getNextWord()
                        type = result(')');
                    }
                    temp.props.push({
                        type: 'prop',
                        name: paramName,
                        propType: type
                    })
                    if(getNextWord(true) === ',') {
                        getNextWord()
                    }
                }
                getNextWord(); // )
                if(getNextWord() !== '=>') {
                    throw new Error('函数类型错误')
                }
                temp.return = result();
            } else {
                temp = result(')')
                if(getNextWord(true) === ')') {
                    getNextWord();
                }
            }
        } else {
            console.log('未知关键词!!!!!!!')
            console.log(getNextWord(true))
            console.log(getNextWord(true))
        }
        if(getNextWord(true) === '|') {
            slip++;
            while (getNextWord(true) !== undefined) {
                const orTemp = result('globle')
                if(orTemp.type === '|') {
                    orTemp.value.unshift(temp);
                    temp = orTemp;
                } else {
                    temp = {type: '|', value: [temp, orTemp]}
                }
                if(getNextWord(true) !== '|') {
                    break;
                }
            }
        } else if(getNextWord(true) === '[]') {
            while (getNextWord(true) === '[]') {
                slip += 2;
                temp = {
                    type: 'array',
                    value: temp
                }
            }
        }
        return temp;
    }

    return result('globle')
}

exports.parse = parse;
