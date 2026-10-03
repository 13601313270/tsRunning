## TS运行时校验工具ts-running

Typescript给了js类型校验的能力，但是我们知道ts的校验是在编译时执行的，最终到浏览器执行环境，依旧是普通的js，有些特殊的情况，我们需要执行环境增加类型校验能力，例如：

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
check('"hello"|"world"',"hello"); // true
```
check方法返回boolean值，说明第二个参数，是否符合第一个参数ts类型语法
