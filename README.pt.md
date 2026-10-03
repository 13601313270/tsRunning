## ts-running: Uma Ferramenta de Validação de Tipos em Tempo de Execução para TypeScript

O TypeScript oferece capacidade de validação de tipos para JavaScript, mas todos sabemos que a validação do TypeScript ocorre em tempo de compilação. Quando o código é executado em um navegador ou em um ambiente Node.js, ele volta a ser JavaScript puro. Existem certos cenários em que precisamos de validação de tipos em tempo de execução, como por exemplo:

1. No lado do servidor (Node.js): verificar se os dados recebidos do navegador estão em conformidade com uma estrutura esperada.

2. No lado do cliente: verificar se os dados retornados pelo servidor estão em conformidade com uma estrutura esperada.

Para atender a essas necessidades, desenvolvi um pacote npm que habilita essa capacidade.

## Instalação

Instale o ts-running via npm:

```bash
npm i ts-running
```

## Uso

O método `check` valida se um valor está em conformidade com um tipo. O primeiro argumento é uma string que representa o tipo usando a sintaxe do TypeScript, e o segundo argumento é o valor a ser validado.

```javascript
const { check } = require('ts-running');

// Exemplos
check('number', 1); // true
check('{label:string}', { label: '' }); // true
check('{label?:string}[]', [{ label: 'hello' }]); // true
check('{label:string|number}', { label: 1 }); // true
check('[string,number][]', [['', 1]]); // true
check('{label:string,title:number}', { label: '', title: '' }); // false
check('"hello"|"world"', 'hello'); // true
```

O método `check` retorna um valor booleano indicando se o segundo argumento corresponde ao tipo TypeScript descrito no primeiro argumento.
