function parse(typeStr){
    let p = 0;
    const p2 = 0;
    let slip = 0;
    let sss = 1;

    function getNextWord(onlyGet=false) {
        const beginSlip = slip;
        const keywords = ['[]','[', ']','|',',','<','>','{','}','?:',':','?'];
        let word = typeStr[slip];
        if(keywords.includes(typeStr.slice(slip,slip+2))){
            word = typeStr.slice(slip,slip+2);
            if(!onlyGet){
                slip+=2
            }
            return word;
        } else if(keywords.includes(typeStr[slip])){
            if(!onlyGet){
                slip++
            }
            return word
        }
        while(slip < typeStr.length && p++ < 10000) {
            if(keywords.includes(typeStr[slip+1])){
                slip++;
                if(onlyGet){
                    slip = beginSlip;
                }
                return word;
            } else {
                slip++;
            }
            if(slip < typeStr.length){
                word += typeStr[slip];
            }
        }
        if(onlyGet){
            slip = beginSlip;
        }
        return word;
    }
    function result(env){
//         console.log(getNextWord());console.log(getNextWord());console.log(getNextWord());console.log(getNextWord());console.log(getNextWord());console.log(getNextWord());
//         console.log('*******');
//         return;
        let temp = {};
        const word = getNextWord(true)
        if(word===undefined){
            return undefined
        }
        if(['number','string','boolean','any','void','undefined','null','never','object'].includes(getNextWord(true))){
            temp = {type:getNextWord()}
        } else if(getNextWord(true)==='Array'){
            getNextWord()
            if(getNextWord()==='<') {
                temp = {
                    type:'array',
                    value: result('globle')
                }
            }
            if(getNextWord()==='>'){
            }
        } else if(getNextWord(true)==='[') {
            slip++;
            sss = 0
            temp = {type:'tuple',value:[]}
            while(sss++<10){
                const orTemp = result('globle')
                temp.value.push(orTemp)
                const nextTemp = getNextWord(true);
                slip++;
                if(nextTemp!==','){
                    break;
                }
            }
        } else if(getNextWord(true)==='{'){
            slip++;
            temp = {type:'object',value:[]}
            sss = 0;
            while(sss++<10){
                let key = getNextWord();
                let mastNeed = getNextWord()!=='?:';
                let value = result('globle');
                const nextWord = getNextWord()
                temp.value.push({
                    type:'objectValue',
                    mastNeed:mastNeed,
                    key:key,
                    value:value
                })
                if(nextWord==='}'){
                    break;
                }
            }
        }
        if(getNextWord(true)==='|'){
            slip++;
            sss = 0
            while(sss++<10){
                const orTemp = result('globle')
                if(orTemp.type==='|'){
                    orTemp.value.push(temp);
                    temp = orTemp;
                } else {
                    temp = {type:'|',value:[temp,orTemp]}
                }
                if(getNextWord(true)!=='|'){
                    break;
                }
            }
        } else if(getNextWord(true)==='[]'){
            while(getNextWord(true)==='[]'){
                slip+=2;
                temp = {
                    type:'array',
                    value:temp
                }
            }
        }
        return temp;
    }
    return result('globle')
}
exports.parse = parse;
