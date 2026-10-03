## ts-running: Una Herramienta de Validación de Tipos en Tiempo de Ejecución para TypeScript

TypeScript le otorga a JavaScript capacidades de validación de tipos, pero todos sabemos que la validación de TypeScript ocurre en tiempo de compilación. Para cuando el código se ejecuta en un navegador o en un entorno Node.js, vuelve a ser JavaScript común y corriente. Hay ciertos escenarios donde necesitamos validación de tipos en tiempo de ejecución, como por ejemplo:

1. En el lado del servidor (Node.js): verificar que los datos recibidos del navegador cumplan con una estructura esperada.

2. En el lado del cliente: verificar que los datos devueltos por el servidor cumplan con una estructura esperada.

Para cubrir estas necesidades, he desarrollado un paquete de npm que permite precisamente esto.

## Instalación

Instala ts-running a través de npm:

```bash
npm i ts-running
```

## Uso

El método `check` valida si un valor cumple con un tipo. El primer argumento es una cadena que representa el tipo usando sintaxis de TypeScript, y el segundo argumento es el valor a validar.

```javascript
const { check } = require('ts-running');

// Ejemplos
check('number', 1); // true
check('{label:string}', { label: '' }); // true
check('{label?:string}[]', [{ label: 'hello' }]); // true
check('{label:string|number}', { label: 1 }); // true
check('[string,number][]', [['', 1]]); // true
check('{label:string,title:number}', { label: '', title: '' }); // false
check('"hello"|"world"', 'hello'); // true
```

El método `check` devuelve un valor booleano que indica si el segundo argumento coincide con el tipo de TypeScript descrito en el primer argumento.
