function check(parseConfig, value) {
    function _checkConfig(config, val) {
        if(config.type === 'number') {
            return typeof val === 'number'
        } else if(config.type === 'string') {
            return typeof val === 'string'
        } else if(config.type === 'boolean') {
            return typeof val === 'boolean'
        } else if(config.type === 'void') {
            return val === null || val === undefined;
        } else if(config.type === 'any') {
            return true;
        } else if(config.type === 'Date') {
            return val instanceof Date;
        } else if(config.type === 'array') {
            if(val instanceof Array) {
                for (let i = 0; i < val.length; i++) {
                    if(_checkConfig(config.value, val[i]) === false) {
                        return false;
                    }
                }
                return true;
            } else {
                return false;
            }
        } else if(config.type === '|') {
            for (let i = 0; i < config.value.length; i++) {
                if(_checkConfig(config.value[i], val) === true) {
                    return true;
                }
            }
            return false;
        } else if(config.type === 'tuple') {
            if(!(val instanceof Array) || config.value.length !== val.length) {
                return false;
            }
            for (let i = 0; i < config.value.length; i++) {
                if(_checkConfig(config.value[i], val[i]) === false) {
                    return false;
                }
            }
            return true;
        } else if(config.type === 'object') {
            if(typeof val !== 'object') {
                return false;
            }
            const configKeys = config.value.map(item => item.key);
            if(Object.keys(val).find(key => {
                return !configKeys.includes(key)
            })) {
                return false;
            }
            for (let i = 0; i < config.value.length; i++) {
                let temp = config.value[i];
                if(val[temp.key] === undefined) {
                    if(temp.mastNeed) {
                        return false;
                    } else {
                        return true;
                    }
                }
                if(_checkConfig(temp.value, val[temp.key]) === false) {
                    return false;
                }
            }
            return true;
        } else if(config.type === 'value') {
            return config.value === val;
        } else {
            console.log('************* otherType *************')
            console.log(config.type)
        }
    }

    return _checkConfig(parseConfig, value)
}

exports.check = check;
