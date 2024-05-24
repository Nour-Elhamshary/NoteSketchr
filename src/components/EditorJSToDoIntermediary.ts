//We store in the global variable that stores in anything javascript.

interface todoItemsData {
    data: {
    "todoItems":string[]
}
}

export let tempTodoData:todoItemsData = {
    data: {
    todoItems: []
}
};

export let tempSaveTodoData:todoItemsData = {
    data: {
    todoItems: []
}
};

export function flushData() {
    while (tempTodoData.data.todoItems.length > 0) {
        tempTodoData.data.todoItems.pop();
    }
}

export function flushSavedData() {
    while (tempSaveTodoData.data.todoItems.length > 0) {
        tempSaveTodoData.data.todoItems.pop();
    }
}

export function getData(data:todoItemsData) {
    tempTodoData = data;
    console.log("getData(): " + tempTodoData);
}

export function getSavedData(data:todoItemsData) {
    tempSaveTodoData = data;
    console.log("getData(): " + tempSaveTodoData);
}

export function returnData(): todoItemsData {
    return tempTodoData;
}

export function returnSavedData(): todoItemsData {
    return tempSaveTodoData;
}
