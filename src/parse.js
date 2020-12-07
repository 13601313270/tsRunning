function parse(typeStr) {
    let slip = 0;

    function getNextWord(onlyGet = false) {
        const beginSlip = slip;
        const keywords = ['[]', '[', ']', '|', ',', '<', '>', '{', '}', '?:', ':', '?'];
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
        if(['number', 'string', 'boolean', 'any', 'void', 'undefined', 'null', 'never', 'object'].includes(getNextWord(true))) {
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
                let key = getNextWord();
                let mastNeed = getNextWord() !== '?:';
                let value = result('globle');
                const nextWord = getNextWord()
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
        }
        if(getNextWord(true) === '|') {
            slip++;
            while (getNextWord(true) !== undefined) {
                const orTemp = result('globle')
                if(orTemp.type === '|') {
                    orTemp.value.push(temp);
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
