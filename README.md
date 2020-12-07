## TS运行时校验工具ts-running

Typescript给了js类型校验的能力，但是我们知道ts的校验是在编译时执行的，最终到浏览器执行环境，依旧时普通的js，有些特殊的情况，我们需要执行环境增加类型校验能力，例如：

1、node服务端接收到浏览器发送过来的数据，判断数据是否符合结构

2、客户端接收服务端返回的数据，判断数据是否符合结构

基于此类需求，我开发了一个npm包，来实现这个功能。

## 使用方法

我们安装ts-running

```bash
npm i ts-running
```

check方法校验数据是否符合类型，第一个参数时ts的类型语法封装的字符串，第二个参数是校验的数据

```javascript
const {check} = require('ts-running');

// DEMO
check('number', 1); // true
check('{label:string}', {label: ''}); // true
check('{label?:string}[]',[{label: 'hello'}]); // true
check('{label:string|number}',{label: 1}); // true
check('[string,number][]',[['', 1]]); // true
check('{label:string,title:number}',{label: '', title: ''}); // false
```
check方法返回boolean值，说明第二个参数，是否符合第一个参数ts类型语法

## 实现逻辑
1、类型语法结构化
首先我们会把TS类型语法，通过一个解析器，转换成一个JSON结构，例如：
```typescript
number
```
转换成
```javascript
{"type":"number"}
```
json结构，描述了字符串，在这里，`{"type":"number"}`表述为“类型是数字”
第二个例子：
```typescript
number[]
```
转换成
```
{
  "type":"array",
  "value":{
    "type":"number"
  }
}
```
表述为“整体是一个数组，每一项是一个数字”，这种结构表述方式符合这样的特点，复杂的ts类型，具有多层结构，但是每一层是类似的结构，type代表类型，value代表下一层的结构。

这样的逻辑能表达无论多么复杂的ts类型，比如说：
```typescript
{label:string}[]
```
```
{
  "type":"array",
  "value":{
    "type":"object",
    "value":[
      {
        "type":"objectValue",
        "mastNeed":true,
        "key":"label",
        "value":{
          "type":"string"
        }
      }
    ]
  }
}
```
因为我们把表述JSON化，而且这个结构具有递归的特点，我们就可以方便的把复杂的多层的校验，通过递归校验实现
|  TS语法   | 类型表述  | 校验数据  |
|  ----  | ----  | ----  |
| {label:string}[]  | ![image.png](https://upload-images.jianshu.io/upload_images/8105934-6aac6fa9462ea3ee.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240) | ![[{label: 'hello'}]](https://upload-images.jianshu.io/upload_images/8105934-4afaad08b5500575.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240) |

## 源码
语法结构化
```
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

```
数据校验逻辑实现
```
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
        } else {
            console.log('************* otherType *************')
            console.log(config.type)
        }
    }

    return _checkConfig(parseConfig, value)
}

exports.check = check;

```
