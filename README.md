# TS运行时校验工具


TS的校验都是在编译时校验，但是某些情况下，需要运行时校验，例如判断接口请求返回的接口是否符合数据结构。
使用方法


```javascript
const {check} = require('ts-running');

// DEMO
check('number', 1);
check('{label:string}', {label: ''});

// check方法返回boolean值
```
