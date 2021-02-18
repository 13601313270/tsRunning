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
            /*
            * 注意 { [key: number]: string } 是可以匹配上 ['hello']
            * */
            // 通过值的所有键去验证类型的键
            if(Object.keys(val).find(key => {
                return !config.value.find(configKey => {
                    if(configKey.key.type) {
                        return _checkConfig(configKey.key.keyType, val instanceof Array ? +key : key) && _checkConfig(configKey.value, val[key]);
                    } else {
                        return configKey.key === key;
                    }
                })
            })) {
                return false;
            }
            // 通过类型的所有键去验证值的键
            for (let i = 0; i < config.value.length; i++) {
                let temp = config.value[i];
                if(temp.key.type !== 'objectKey') {
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
                } else {
                    /*
                    * { [key: number]: string } 是可以匹配上 []
                    * { [key: string]: string } 是可以匹配上 {}
                    * */
                    if(temp.key.keyType.type === 'string') {
                        if(val instanceof Array) {
                            return false;
                        }
                    }
                    if(temp.key.keyType.type === 'number') {
                        if(!(val instanceof Array)) {
                            return false;
                        }
                    }
                }
            }
            return true;
        } else if(config.type === 'value') {
            return config.value === val;
        } else if(config.type === 'func') {
            if(typeof val === 'function') {
                console.warn("对函数类型的check操作，只能判断是否是函数");
                return true;
            } else {
                return false;
            }
        } else {
            console.log('************* otherType *************')
            console.log(config.type)
        }
    }

    return _checkConfig(parseConfig, value)
}

exports.check = check;
