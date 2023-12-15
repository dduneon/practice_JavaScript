//https://developer.mozilla.org/ko/docs/Web/JavaScript/Closures
//https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Map
const memoryStore = function(){
    const todoMap = new Map();
    const DAILY_MAX_TODO_COUNT=8;
    const api = new Object();

    api.save = function( todoDate, todoSubject){
        let uuid = self.crypto.randomUUID();
        const item = {
            'id' : uuid,
            'todoDate' : todoDate,
            'todoSubject' : todoSubject
        }

        const count = countByTodoDate(todoDate);
        if(count >=DAILY_MAX_TODO_COUNT){
            throw new Error("DAILY_MAX_TODO_COUNT:" + DAILY_MAX_TODO_COUNT);
        }

        if(todoMap.has(todoDate)){
            const todoItems = todoMap.get(todoDate);
            todoItems.push(item);
        }else{
            const todoItems = new Array();
            todoItems.push(item);
            todoMap.set(todoDate, todoItems);
        }
        printMap();
    }
    
    api.delete=function(todoDate,id){
        if(todoMap.has(todoDate)){

            const todoItems = todoMap.get(todoDate);
           //https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex
           const idx = todoItems.findIndex(function(item){
                return item.id === id;
           });

           if(idx > -1){
            //https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
            todoItems.splice(idx,1);
           }else{
                throw new Error(`${id} not found`);
           }
        }
    }

    api.deleteByTodoDate=function(todoDate){
        if(todoMap.has(todoDate)){
            todoMap.delete(todoDate);
        }
    }

    api.getTodoItemList=function(todoDate){
        if(todoMap.has(todoDate)){
            return todoMap.get(todoDate);
        }
        return [];
    }

    countByTodoDate=function(todoDate){
        if(todoMap.has(todoDate)){
            return todoMap.get(todoDate).length;
        }
        return 0;
    }

    function printMap(){
        //https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/push
        for (const [key, value] of todoMap.entries()) {
            console.log(`${key} = ${value}`);
        }
    }
    
    return api;
}