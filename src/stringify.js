function tabStr(tab) {
    return Array(tab * 4 + 1).join(' ')
}

function stringify(obj) {
    function result(obj, tab) {
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
            return 'Array<' + result(obj.value, tab) + '>'
        } else if(obj.type === '|') {
            return obj.value.map(item => {
                return result(item, tab)
            }).join('|')
        } else if(obj.type === 'tuple') {
            return '[' + obj.value.map(item => {
                return result(item, tab)
            }).join(',') + ']'
        } else if(obj.type === 'object') {
            return '{\n' + obj.value.map(item => {
                return tabStr(tab + 1) + result(item, tab + 1)
            }).join(',\n') + '\n' + tabStr(tab) + '}'
        } else if(obj.type === 'objectValue') {
            if(obj.key.type === 'objectKey') {
                return result(obj.key) + (obj.mastNeed ? '' : '?') + ': ' + result(obj.value, tab)
            } else {
                return obj.key + (obj.mastNeed ? '' : '?') + ': ' + result(obj.value, tab)
            }
        } else if(obj.type === 'objectKey') {
            return '[' + obj.name + ': ' + result(obj.keyType) + ']';
        } else if(obj.type === 'value') {
            return JSON.stringify(obj.value);
        } else if(obj.type === 'func') {
            return '(' + obj.props.map(item => {
                return item.name + ": " + result(item.propType, tab);
            }).join(', ') + ') => ' + result(obj.return, tab)
        }
    }

    return result(obj, 0)
}

exports.stringify = stringify;
