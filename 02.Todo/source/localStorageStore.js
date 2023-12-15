//https://developer.mozilla.org/ko/docs/Web/API/Window/localStorage
const localStorageStore = function(){
    const storage = window.localStorage;
    const DAILY_MAX_TODO_COUNT=8;
    const api = new Object();
    
    api.save=function(todoDate, todoSubject){
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

        let todoItems = JSON.parse(storage.getItem(todoDate));
        if(todoItems){
            todoItems.push(item);
        }else{
            todoItems = new Array();
            todoItems.push(item);
        }
        storage.setItem(todoDate,JSON.stringify(todoItems));

    }

    api.delete=function(todoDate,id){
        const todoItems = JSON.parse(storage.getItem(todoDate));
        if(todoItems){
           //https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex
            const idx = todoItems.findIndex(function(item){
                return item.id === id;
            });

            if(idx > -1){
                //https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
                todoItems.splice(idx,1);
                storage.setItem(todoDate, JSON.stringify(todoItems));
            }else{
                throw new Error(`${id} not found`);
            }
        }
    }

    api.deleteByTodoDate=function(todoDate){
        if(storage.getItem(todoDate)){
            storage.removeItem(todoDate);
        }
    }

    api.getTodoItemList = function(todoDate){
        const todoItems = storage.getItem(todoDate);
        return todoItems ? JSON.parse(todoItems) : [];
    }

    function countByTodoDate(todoDate){
        const todoItems = storage.getItem(todoDate);
        if(todoItems){
            return JSON.parse(todoItems).length;
        }
        return 0;
    }

    return api;
}