function stringify(obj) {
    function result(obj) {
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
        ].includes(obj.type)) {
            return obj.type;
        } else if(obj.type === 'array') {
            if(obj.value.type === '|') {
                return '(' + result(obj.value) + ')' + '[]'
            } else {
                return result(obj.value) + '[]'
            }
        } else if(obj.type === '|') {
            return obj.value.map(item => {
                return result(item)
            }).join('|')
        } else if(obj.type === 'tuple') {
            return '[' + obj.value.map(item => {
                return result(item)
            }).join(',') + ']'
        } else if(obj.type === 'object') {
            return '{' + obj.value.map(item => {
                return result(item)
            }).join(',') + '}'
        } else if(obj.type === 'objectValue') {
            return obj.key + (obj.mastNeed ? '' : '?') + ':' + result(obj.value)
        } else if(obj.type === 'value') {
            return JSON.stringify(obj.value);
        }
    }

    return result(obj)
}

exports.stringify = stringify;
